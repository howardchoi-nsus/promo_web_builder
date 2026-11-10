<script setup>
import { computed } from 'vue';
const props = defineProps({
  title: { type: String, required: true },
  rows: { type: Array, default: () => [] },
  editing: { type: Boolean, default: false },
  showUsage: { type: Boolean, default: false },
  showGroup: { type: Boolean, default: false },
});
const emit = defineEmits(['change']);
const displayRows = computed(() => {
  const rows = props.rows.map(row => ({ ...row, groupSpan: 0 }));
  for (let index = 0; index < rows.length;) {
    let end = index + 1;
    while (end < rows.length && rows[end].groupKey === rows[index].groupKey) end++;
    rows[index].groupSpan = end - index;
    rows[index].groupNeedsConfirmation = rows.slice(index, end).some(row => row.requiresConfirmation);
    index = end;
  }
  return rows;
});
</script>

<template>
  <div class="ai-requirement-table-wrap">
    <table class="ai-requirement-table">
      <caption>{{ title }}</caption>
      <colgroup>
        <col v-if="showGroup" class="ai-requirement-table__group-col" />
        <col class="ai-requirement-table__label-col" /><col />
        <col v-if="showUsage" class="ai-requirement-table__usage-col" />
      </colgroup>
      <thead><tr>
        <th v-if="showGroup" scope="col">구분</th>
        <th scope="col">항목</th><th scope="col">내용</th>
        <th v-if="showUsage" scope="col">예상 사용처</th>
      </tr></thead>
      <tbody>
        <tr v-for="entry in displayRows" :key="entry.path" :class="{ 'is-changed': entry.changed }">
          <td v-if="showGroup && entry.groupSpan" :rowspan="entry.groupSpan" class="ai-requirement-table__group">
            {{ entry.group || '섹션' }}
            <em v-if="entry.groupNeedsConfirmation" class="ai-confirmation-badge">확인 필요</em>
          </td>
          <th scope="row">
            {{ entry.label }}
            <em v-if="!showGroup && entry.requiresConfirmation" class="ai-confirmation-badge">확인 필요</em>
          </th>
          <td class="ai-requirement-table__value">
            <span v-if="!editing" :class="{ 'is-empty': !entry.value }">{{ entry.value || '미입력' }}</span>
            <label v-else-if="entry.inputKind === 'checkbox'" class="ai-requirements-tree__boolean">
              <input type="checkbox" :checked="entry.rawValue" :aria-label="`${entry.label} 수정`" @change="emit('change', entry.path, $event.target.checked)" />
              <span>{{ entry.rawValue ? '예' : '아니오' }}</span>
            </label>
            <select v-else-if="entry.inputKind === 'select'" :value="entry.editValue ?? entry.rawValue" :aria-label="`${entry.label} 수정`" @change="emit('change', entry.path, $event.target.value)">
              <option value="">선택해 주세요</option>
              <option v-for="option in entry.options" :key="option" :value="option">{{ option }}</option>
            </select>
            <textarea v-else-if="entry.inputKind === 'textarea'" :value="entry.editValue ?? entry.rawValue" rows="3" maxlength="2000" :aria-label="`${entry.label} 수정`" @input="emit('change', entry.path, $event.target.value)"></textarea>
            <input v-else :type="entry.inputKind" :value="entry.editValue ?? entry.rawValue" :maxlength="entry.key === 'ctaLabel' || (entry.key === 'label' && entry.path.endsWith('.cta.label')) ? 20 : 2000" :aria-label="`${entry.label} 수정`" @input="emit('change', entry.path, $event.target.value)" />
          </td>
          <td v-if="showUsage" class="ai-requirement-table__usage">{{ entry.usage }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
