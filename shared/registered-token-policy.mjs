// Geometry, ordering and layout enums are structural. Visual values must come
// from the pinned, resolved token library; browser defaults are not new tokens.
const VISUAL_PROPERTIES = {
  radius:'border-radius', shadow:'box-shadow', font:'font-family',
  color:'color', textColor:'color', backgroundColor:'background-color', backgroundFadeColor:'background-color',
  surfaceColor:'background-color', accentColor:'color', ctaColor:'color', borderColor:'border-color',
  fontStyle:'font-style', textDecoration:'text-decoration', fontFamily:'font-family', fontSize:'font-size', fontWeight:'font-weight', lineHeight:'line-height',
  letterSpacing:'letter-spacing', borderRadius:'border-radius', boxShadow:'box-shadow',
  textBackground:'background-color', textGradient:'background-image', textStyle:'typography',
  paddingPx:'padding', layoutGapPx:'gap', mobileLayoutGapPx:'gap', layoutPaddingBlockPx:'padding', mobileLayoutPaddingBlockPx:'padding',
};
const normalize = value => String(value ?? '').trim().toLowerCase().replace(/\s+/g,' ');
const PX_PROPERTIES = new Set(['fontSize','letterSpacing','paddingPx','layoutGapPx','mobileLayoutGapPx','layoutPaddingBlockPx','mobileLayoutPaddingBlockPx']);
export function enforceRegisteredDesignTokens(spec, tokenValues = {}, catalog = []) {
  const values = Object.fromEntries(Object.entries(tokenValues).filter(([key,value]) => /^--[a-z][a-z0-9-]*$/.test(key) && typeof value === 'string' && value.trim()));
  const definitions = new Map(catalog.map(token => [token.tokenKey,token]));
  const errors = [];
  function registered(key, property) {
    if (!Object.hasOwn(values,key)) return false;
    const definition = definitions.get(key);
    const properties = definition?.cssProperties || (definition?.cssProperty ? [definition.cssProperty] : []);
    return !properties.length || !property || properties.includes(property)
      || (property === 'color' && properties.includes('background-color'));
  }
  function clean(value,path) {
    if (Array.isArray(value)) return value.map((entry,index) => clean(entry,`${path}[${index}]`));
    if (!value || typeof value !== 'object') return value;
    const result = {};
    for (const [key,entry] of Object.entries(value)) {
      const base = key.endsWith('Token') ? key.slice(0,-5) : key;
      const property = VISUAL_PROPERTIES[base];
      if (key.endsWith('Token') || path.endsWith('.tokenBindings')) {
        if (registered(entry,property)) result[key] = entry;
        else errors.push({code:'UNREGISTERED_DESIGN_TOKEN',path:`${path}.${key}`,value:entry});
      } else if (property) {
        const literal = normalize(typeof entry === 'number' && PX_PROPERTIES.has(key) ? `${entry}px` : entry);
        const match = Object.keys(values).some(token => registered(token,property) && normalize(values[token]) === literal);
        if (match) result[key] = entry;
        else errors.push({code:'UNREGISTERED_DESIGN_VALUE',path:`${path}.${key}`,value:entry});
      } else result[key] = clean(entry,`${path}.${key}`);
    }
    return result;
  }
  return {spec:clean(spec,'designSpec'),errors};
}
