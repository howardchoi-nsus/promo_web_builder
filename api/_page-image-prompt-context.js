const { savedDesignBrief } = require('./_page-design-direction');

// Describe the input that is actually supplied. Visual instructions live in
// registered Admin prompts; this metadata is not an image/website reference.
function pageImagePromptContext(snapshot, request, target) {
  const context = snapshot.content.pageContext;
  const brandPalette = Object.fromEntries(
    ['page.background', 'text.primary', 'button.background'].map(role => [
      role, context.tokenValues[context.usagePolicy.bindings[role]],
    ]),
  );
  return {
    target,
    aspectRatio: request.aspectRatio,
    designBrief: savedDesignBrief(snapshot),
    intent: request.intent,
    sourceIds: request.sourceIds,
    contentSources: context.contentSources,
    backgroundColor: brandPalette['page.background'],
    brandPalette,
    visualReference: {
      profileKey: 'ggpoker-promotional-craft-v1',
      scope: 'visual-craft',
      source: 'product-direction',
      mode: 'written-art-direction',
      referenceImageCount: 0,
      websiteInspected: false,
      subjectSource: 'approved-image-intent',
      paletteSource: 'registered-page-policy',
      compositionSource: 'validated-page-target',
    },
  };
}

module.exports = { pageImagePromptContext };
