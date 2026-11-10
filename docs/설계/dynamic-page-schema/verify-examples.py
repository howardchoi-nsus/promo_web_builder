"""Design-contract verification only; this is not the production validator."""
import copy
import json
from pathlib import Path
import jsonschema

ROOT = Path(__file__).parent
SCHEMA = json.loads((ROOT / 'page-schema.schema.json').read_text())
CONTEXT = json.loads((ROOT / 'example-context.json').read_text())
jsonschema.Draft202012Validator.check_schema(SCHEMA)

def validate(page):
    schema = copy.deepcopy(SCHEMA)
    for definition, values in [('policyRole', CONTEXT['mappedPolicyRoles']), ('sourceId', list(CONTEXT['contentSources'])), ('actionId', list(CONTEXT['actions']))]:
        schema['$defs'][definition] = {'type': 'string', 'enum': values}
    jsonschema.Draft202012Validator(schema).validate(page)
    assert page['root']['role'] == 'page'
    seen, referenced, heading_levels, images = set(), set(), [], {}
    request_ids = {request['id'] for request in page['mediaRequests']}
    assert len(request_ids) == len(page['mediaRequests'])
    def visit(node, depth=1):
        assert depth <= 8, 'maximum depth'
        assert len(seen) < 200 and node['id'] not in seen, 'node count / duplicate ID'
        seen.add(node['id'])
        if node['type'] == 'text':
            if node['role'] == 'heading':
                assert node['headingLevel'] >= 1
                heading_levels.append(node['headingLevel'])
            else:
                assert node['headingLevel'] == 0
            if node['contentMode'] == 'source':
                assert len(node['sourceIds']) == 1 and node['text'] == ''
                referenced.update(node['sourceIds'])
            else:
                assert node['text'].strip()
        if node['type'] == 'image':
            assert (node['assetId'] is None) != (node['requestId'] is None)
            assert node['alt'] == '' if node['decorative'] else bool(node['alt'].strip())
            if node['requestId']:
                assert node['requestId'] in request_ids
                images[node['requestId']] = node['id']
        for child in node.get('children', []):
            visit(child, depth + 1)
    visit(page['root'])
    assert heading_levels.count(1) == 1 and heading_levels[0] == 1
    assert all(b <= a + 1 for a, b in zip(heading_levels, heading_levels[1:]))
    assert all(not item['required'] or key in referenced for key, item in CONTEXT['contentSources'].items())
    assert all(images.get(request['id']) == request['nodeId'] for request in page['mediaRequests'])
    return len(seen)

for filename in ['example-editorial.json', 'example-split-nested.json']:
    page = json.loads((ROOT / filename).read_text())
    count = validate(page)
    print(f'{filename}: structural + sample semantic checks PASS ({count} nodes)')
    bad = copy.deepcopy(page)
    bad['root']['onclick'] = 'alert(1)'
    try:
        validate(bad)
        raise RuntimeError('event property unexpectedly accepted')
    except jsonschema.ValidationError:
        pass
    bad = copy.deepcopy(page)
    bad['root']['styles']['base'] = ['button.unknown']
    try:
        validate(bad)
        raise RuntimeError('unapproved policy role unexpectedly accepted')
    except jsonschema.ValidationError:
        pass
    bad = copy.deepcopy(page)
    bad['root']['children'][0]['id'] = bad['root']['id']
    try:
        validate(bad)
        raise RuntimeError('duplicate node ID unexpectedly accepted')
    except AssertionError:
        pass
print('Negative checks PASS: event handlers, unknown policy roles, duplicate node IDs')
