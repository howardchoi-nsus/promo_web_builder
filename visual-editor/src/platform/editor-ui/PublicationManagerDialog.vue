<script setup>
import { computed, onMounted, reactive, ref } from "vue";

const props = defineProps({
  documentId: { type: String, required: true },
  documentRevision: { type: Number, required: true },
});
const emit = defineEmits(["close", "status"]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const publications = ref([]);
const selectedId = ref("");
const form = reactive({
  slug: "",
  locale: "ko-KR",
  title: "",
  description: "",
  imageUrl: "",
  canonicalUrl: "",
  noIndex: false,
  revalidateSeconds: 300,
});

const documentPublications = computed(() => publications.value.filter(
  (item) => item.publication.documentId === props.documentId,
));
const selected = computed(() => documentPublications.value.find(
  (item) => item.publication.id === selectedId.value,
) || null);

async function api(options = {}, endpoint = "/api/promo-publications") {
  const response = await fetch(endpoint, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const requestError = new Error(payload.error || `게시 API 오류(${response.status})`);
    requestError.code = payload.code || `HTTP_${response.status}`;
    throw requestError;
  }
  return payload;
}

function applyPublication(item) {
  if (!item) return;
  selectedId.value = item.publication.id;
  Object.assign(form, {
    slug: item.publication.slug,
    locale: item.publication.locale,
    title: item.seo?.title || "",
    description: item.seo?.description || "",
    imageUrl: item.seo?.imageUrl || "",
    canonicalUrl: item.seo?.canonicalUrl || "",
    noIndex: Boolean(item.seo?.noIndex),
    revalidateSeconds: Number(item.cache?.revalidateSeconds ?? 300),
  });
}

function resetForm() {
  selectedId.value = "";
  Object.assign(form, {
    slug: "",
    locale: "ko-KR",
    title: "",
    description: "",
    imageUrl: "",
    canonicalUrl: "",
    noIndex: false,
    revalidateSeconds: 300,
  });
}

async function load({ preserveSelection = true } = {}) {
  loading.value = true;
  error.value = "";
  try {
    const payload = await api();
    publications.value = payload.publications || [];
    const current = preserveSelection
      ? documentPublications.value.find((item) => item.publication.id === selectedId.value)
      : null;
    if (current) applyPublication(current);
    else if (documentPublications.value[0]) applyPublication(documentPublications.value[0]);
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

async function save(status) {
  if (!form.slug || saving.value) return;
  saving.value = true;
  error.value = "";
  try {
    const payload = await api({
      method: "POST",
      body: JSON.stringify({
        documentId: props.documentId,
        documentRevision: props.documentRevision,
        slug: form.slug,
        locale: form.locale,
        status,
        seo: {
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          canonicalUrl: form.canonicalUrl,
          noIndex: form.noIndex,
        },
        revalidateSeconds: Number(form.revalidateSeconds),
      }),
    });
    selectedId.value = payload.publication.publication.id;
    await load();
    const cacheWarning = payload.cacheInvalidation?.status === "failed" ? " (Nuxt 캐시 갱신 실패)" : "";
    emit("status", status === "published" ? `Nuxt 프로모션 게시 완료${cacheWarning}` : "Publication 초안 저장 완료");
  } catch (saveError) {
    error.value = saveError.code === "QUALITY_GATE_REQUIRED"
      ? "현재 revision의 Desktop·Mobile 품질 검사를 통과한 후 게시할 수 있습니다."
      : saveError.message;
  } finally {
    saving.value = false;
  }
}

async function changeStatus(status) {
  if (!selected.value || saving.value) return;
  saving.value = true;
  error.value = "";
  try {
    const payload = await api({
      method: "PATCH",
      body: JSON.stringify({ id: selected.value.publication.id, status }),
    });
    await load();
    const cacheWarning = payload.cacheInvalidation?.status === "failed" ? " Nuxt 캐시 갱신은 실패했습니다." : "";
    emit("status", status === "published"
      ? `선택한 revision을 다시 게시했습니다.${cacheWarning}`
      : `프로모션 게시를 중지했습니다.${cacheWarning}`);
  } catch (statusError) {
    error.value = statusError.message;
  } finally {
    saving.value = false;
  }
}

async function openPreview() {
  if (!selected.value || saving.value) return;
  const previewWindow = window.open("about:blank", "_blank");
  if (previewWindow) previewWindow.opener = null;
  saving.value = true;
  error.value = "";
  try {
    const payload = await api({
      method: "POST",
      body: JSON.stringify({ id: selected.value.publication.id }),
    }, "/api/promo-publication-preview-token");
    const url = new URL(`/preview/promotions/${payload.preview.slug}`, window.location.origin);
    url.searchParams.set("locale", payload.preview.locale);
    url.searchParams.set("token", payload.preview.token);
    if (previewWindow) previewWindow.location.replace(url.href);
    else window.open(url.href, "_blank", "noopener,noreferrer");
  } catch (previewError) {
    if (previewWindow) previewWindow.close();
    error.value = previewError.message;
  } finally {
    saving.value = false;
  }
}

function runtimeUrl(item = selected.value) {
  if (!item) return "";
  const url = new URL(`/promotions/${item.publication.slug}`, window.location.origin);
  url.searchParams.set("locale", item.publication.locale);
  return url.href;
}

onMounted(load);
</script>

<template>
  <div class="publication-dialog-backdrop" @click.self="emit('close')">
    <section class="publication-dialog" role="dialog" aria-modal="true" aria-labelledby="publication-dialog-title">
      <header>
        <div>
          <span>NUXT PUBLICATION</span>
          <h2 id="publication-dialog-title">프로모션 게시 관리</h2>
          <small>Document {{ documentId.slice(0, 8) }} · 현재 revision {{ documentRevision }}</small>
        </div>
        <button type="button" aria-label="게시 관리 닫기" @click="emit('close')">닫기</button>
      </header>

      <p v-if="error" class="publication-dialog__error" role="alert">{{ error }}</p>
      <div class="publication-dialog__body">
        <aside>
          <div class="publication-dialog__aside-title">
            <strong>게시 이력</strong>
            <button type="button" @click="resetForm">새 Publication</button>
          </div>
          <button
            v-for="item in documentPublications"
            :key="item.publication.id"
            type="button"
            class="publication-dialog__history"
            :class="{ selected: selectedId === item.publication.id }"
            @click="applyPublication(item)"
          >
            <strong>{{ item.publication.slug }}</strong>
            <span>r{{ item.publication.publishedRevision }} · {{ item.publication.status }}</span>
          </button>
          <small v-if="!loading && !documentPublications.length">게시 이력이 없습니다.</small>
        </aside>

        <form @submit.prevent="save('draft')">
          <label><span>Slug</span><input v-model.trim="form.slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="summer-promo" /></label>
          <label><span>Locale</span><input v-model.trim="form.locale" required pattern="[a-z]{2,3}(?:-[A-Z]{2})?" /></label>
          <label class="wide"><span>SEO 제목</span><input v-model.trim="form.title" maxlength="120" /></label>
          <label class="wide"><span>SEO 설명</span><textarea v-model.trim="form.description" maxlength="300" rows="3"></textarea></label>
          <label class="wide"><span>OG 이미지 URL</span><input v-model.trim="form.imageUrl" type="url" /></label>
          <label class="wide"><span>Canonical URL</span><input v-model.trim="form.canonicalUrl" type="url" /></label>
          <label><span>캐시 갱신(초)</span><input v-model.number="form.revalidateSeconds" type="number" min="0" max="86400" /></label>
          <label class="publication-dialog__check"><input v-model="form.noIndex" type="checkbox" /><span>검색엔진 제외</span></label>
          <div class="publication-dialog__actions wide">
            <button type="submit" :disabled="saving || !form.slug">초안 저장</button>
            <button type="button" class="primary" :disabled="saving || !form.slug" @click="save('published')">현재 revision 게시</button>
            <button type="button" :disabled="saving || !selected || selected.publication.status !== 'published'" @click="changeStatus('unpublished')">게시 중지</button>
            <button type="button" :disabled="saving || !selected || selected.publication.status === 'published'" @click="changeStatus('published')">선택 revision 재게시</button>
            <button type="button" :disabled="saving || !selected" @click="openPreview">Nuxt 미리보기</button>
            <a v-if="selected?.publication.status === 'published'" :href="runtimeUrl()" target="_blank" rel="noopener noreferrer">Nuxt 페이지 열기</a>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.publication-dialog-backdrop{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:24px;background:rgba(7,10,16,.78)}
.publication-dialog{width:min(960px,100%);max-height:90vh;overflow:auto;border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);box-shadow:0 30px 80px rgba(0,0,0,.45)}
.publication-dialog>header{display:flex;justify-content:space-between;gap:20px;padding:18px 20px;border-bottom:1px solid var(--line)}
.publication-dialog>header span{color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.1em}.publication-dialog h2{margin:4px 0}.publication-dialog small{color:var(--sub)}
.publication-dialog button,.publication-dialog input,.publication-dialog textarea{border:1px solid var(--line);border-radius:7px;background:var(--surface-2);color:var(--ink)}.publication-dialog button{padding:8px 11px;cursor:pointer}.publication-dialog button.primary{background:var(--accent);color:#fff}.publication-dialog button:disabled{opacity:.5;cursor:not-allowed}
.publication-dialog__error{margin:14px 20px 0;padding:10px;border:1px solid #b42318;border-radius:8px;background:#fff1f0;color:#b42318}
.publication-dialog__body{display:grid;grid-template-columns:230px 1fr;min-height:440px}.publication-dialog aside{display:flex;flex-direction:column;gap:7px;padding:16px;border-right:1px solid var(--line)}
.publication-dialog__aside-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}.publication-dialog__history{display:grid;gap:3px;text-align:left}.publication-dialog__history.selected{border-color:var(--accent);background:var(--accent-soft)}.publication-dialog__history span{color:var(--sub);font-size:11px}
.publication-dialog form{display:grid;grid-template-columns:1fr 1fr;gap:13px;padding:18px}.publication-dialog label{display:grid;gap:6px;color:var(--sub);font-size:12px;font-weight:750}.publication-dialog input,.publication-dialog textarea{width:100%;padding:9px}.publication-dialog .wide{grid-column:1/-1}.publication-dialog__check{display:flex!important;align-items:center}.publication-dialog__check input{width:auto}.publication-dialog__actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}.publication-dialog__actions a{color:var(--accent);font-weight:750}
@media(max-width:720px){.publication-dialog-backdrop{padding:8px}.publication-dialog__body{grid-template-columns:1fr}.publication-dialog aside{border-right:0;border-bottom:1px solid var(--line)}.publication-dialog form{grid-template-columns:1fr}.publication-dialog .wide{grid-column:auto}}
</style>
