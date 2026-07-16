<script setup>
import { computed } from "vue";

const props = defineProps({
  content: { type: Object, required: true },
  designSpec: { type: Object, required: true },
  assets: { type: Object, required: true },
});

const orderedSections = computed(() => {
  const definitions = props.content?.sectionSnapshot || [];
  const order = props.content?.sectionOrder || [];
  const positions = new Map(order.map((key, index) => [key, index]));
  return [...definitions].sort((a, b) => (
    (positions.get(a.sectionKey) ?? a.sortOrder ?? 0) - (positions.get(b.sectionKey) ?? b.sortOrder ?? 0)
  ));
});

function valueFor(section, item) {
  return props.content?.sectionInputs?.[section.sectionKey]?.[item.itemKey];
}

function imageUrl(value) {
  const candidate = String(value?.value || "").trim();
  return /^https?:\/\//i.test(candidate) ? candidate : "";
}

function ctaUrl(value) {
  return String(value?.link || "#").trim() || "#";
}

function hasContent(value) {
  if (value && typeof value === "object") {
    return Boolean(value.value || value.label || value.description);
  }
  return Boolean(String(value || "").trim());
}
</script>

<template>
  <div
    class="promo-renderer"
    :style="{
      '--promo-bg': designSpec.theme.backgroundColor,
      '--promo-ink': designSpec.theme.textColor,
      '--promo-accent': designSpec.theme.accentColor,
      '--promo-font': designSpec.theme.fontFamily,
      '--promo-width': `${designSpec.responsive.contentMaxWidth}px`,
    }"
  >
    <section
      v-for="section in orderedSections"
      :key="section.sectionKey"
      class="rendered-section"
      :class="`rendered-section--${section.sectionKey}`"
      :data-section-key="section.sectionKey"
    >
      <div class="rendered-section__inner">
        <div class="rendered-items">
          <article
            v-for="item in section.items"
            :key="item.itemKey"
            class="rendered-item"
            :class="`rendered-item--${item.fieldKind || 'text'}`"
            :data-item-key="item.itemKey"
          >
            <template v-if="item.fieldKind === 'cta'">
              <a
                class="rendered-cta"
                :href="ctaUrl(valueFor(section, item))"
                :target="valueFor(section, item)?.target || '_self'"
                :rel="valueFor(section, item)?.target === '_blank' ? 'noopener noreferrer' : undefined"
              >
                {{ valueFor(section, item)?.label || item.name }}
              </a>
            </template>

            <template v-else-if="item.fieldKind === 'image'">
              <figure class="rendered-image">
                <img v-if="imageUrl(valueFor(section, item))" :src="imageUrl(valueFor(section, item))" :alt="valueFor(section, item)?.alt || item.name" />
                <div v-else class="rendered-image__placeholder">
                  <span>{{ item.name }}</span>
                  <small>{{ valueFor(section, item)?.value || '이미지 준비 중' }}</small>
                </div>
                <figcaption v-if="valueFor(section, item)?.description">{{ valueFor(section, item).description }}</figcaption>
              </figure>
            </template>

            <template v-else>
              <p v-if="hasContent(valueFor(section, item))" class="rendered-text">{{ valueFor(section, item) }}</p>
              <p v-else class="rendered-empty">{{ item.name }}</p>
            </template>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
