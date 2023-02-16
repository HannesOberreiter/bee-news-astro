<template>
  <div v-if="isFetchingNews && !news">
    <div class="flex justify-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-50"
      ></div>
    </div>
  </div>
  <div v-if="errorNews">
    <div class="flex justify-center">
      <div class="text-red-500">
        {{ t("errorLoading") }} 😱
        {{ errorNews }}
      </div>
    </div>
  </div>
  <div v-if="news && !errorNews">
    <ButtonsPagination
      v-model:page="itemPage"
      :page-count="dataNews.meta.pagination.pageCount"
      :page-size="dataNews.meta.pagination.pageSize"
      :total="dataNews.meta.pagination.total"
      class="pb-2"
    />

    <div class="relative pb-2">
      <input
        v-model="searchInput"
        type="text"
        :placeholder="(t('searchPlaceholder') as string)"
        class="rounded-full py-2 pl-4 pr-10 block w-full bg-gray-100 dark:bg-white focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-black"
      />
      <button
        class="absolute right-0 top-0 mt-3 mr-4 text-black"
        @click="searchQuery = searchInput"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>

    <div v-if="isFetchingNews" class="flex justify-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-50"
      ></div>
    </div>
    <div v-else-if="news.length === 0">
      <div class="flex justify-center">
        <div class="text-red-500">{{ t("noEntries") }} 😱</div>
      </div>
    </div>
    <div v-else v-for="(item, index) in news" :key="item.id">
      <NewsItem
        :item="item"
        :feedsource="item.attributes.feedsource.data"
        :categories="item.attributes.feedsource.data.attributes.categories.data"
        :language="item.attributes.feedsource.data.attributes.language.data"
        :lastVisit="lastVisitConstant"
        :currentLanguage="currentLanguage"
      />
      <div v-if="index === positionAd && dataAds">
        <AdsItem
          v-if="dataAds.data.length > 0"
          :item="dataAds.data[randomArrayNumber(dataAds.data.length)]"
        ></AdsItem>
      </div>
    </div>
    <ButtonsPagination
      v-model:page="itemPage"
      :page-count="dataNews.meta.pagination.pageCount"
      :page-size="dataNews.meta.pagination.pageSize"
      :total="dataNews.meta.pagination.total"
    />
  </div>
</template>

<script lang="ts">
const paramsAds = {
  filters: {
    sponsored: true,
  },
  populate: "feedsource",
};


</script>

<script setup lang="ts">
import { useApi } from "../composables/useApi";
import { stringify } from "qs";
import { computed, ref, unref, watch } from "vue";
import { useGlobalState } from "../composables/useStore";
import { t } from "i18next";
import { onKeyDown, useLocalStorage, watchDebounced } from "@vueuse/core";

import ButtonsPagination from "./ButtonsPagination.vue";
import NewsItem from "./NewsItem.vue";
import AdsItem from "./AdsItem.vue";

defineProps({
  currentLanguage: {
    type: String,
    required: true,
  }
});

const searchInput = ref("");
const searchQuery = ref("");
const itemPage = ref(1);
const news = ref();
const positionAd = ref(2);

const filter = useGlobalState();

const lastVisit = useLocalStorage("beenews-lastVisit", new Date())
const lastVisitConstant = unref(lastVisit.value);
lastVisit.value = new Date();

const filterIds = computed(() => {
  const values = JSON.parse(filter().value);
  let ids = {
    sources: [],
    categories: [],
    languages: [],
  };
  if ("sources" in values) {
    ids.sources = values.sources.map((item: any) => item.id);
  }
  if ("categories" in values) {
    ids.categories = values.categories.map((item: any) => item.id);
  }
  if ("languages" in values) {
    ids.languages = values.languages.map((item: any) => item.id);
  }
  return ids;
});

const urlNews = computed(() => {
  const params = {
    filters: {
      sponsored: false,
      $and: [
        {
          $or: [
            {
              title: {
                $containsi: searchQuery.value,
              },
            },
            {
              preview: {
                $containsi: searchQuery.value,
              },
            },
          ],
          feedsource: {
            id: {
              $in: filterIds.value.sources ?? [],
            },
            categories: {
              id: {
                $in: filterIds.value.categories ?? [],
              },
            },
            language: {
              id: {
                $in: filterIds.value.languages ?? [],
              },
            },
          },
        },
      ],
    },
    sort: ["published:desc"],
    populate: [
      "feedsource",
      "feedsource.categories",
      "feedsource.categories.localizations",
      "feedsource.language",
      "feedsource.language.localizations",
    ],
    pagination: {
      page: itemPage.value,
      pageSize: 10,
    },
  };
  return `/api/newsitems?${customStringify(params)}`;
});

const {
  data: dataAds,
  error: erroAds,
  isFetching: isFetchingAds,
} = useApi(`/api/newsitems?${customStringify(paramsAds)}`)
  .get()
  .json();

const {
  data: dataNews,
  error: errorNews,
  isFetching: isFetchingNews,
} = useApi(urlNews, { refetch: true }).get().json();

// Slowed down search input
watchDebounced(
  searchInput,
  (val) => {
    searchQuery.value = val;
  },
  { debounce: 500, maxWait: 1000 }
);

watch(dataNews, (val) => {
  if (val) {
    if (val.meta.pagination.pageCount) {
      itemPage.value = val.meta.pagination.page;
    }
    if (val.data.length > 0) {
      news.value = val.data;
      positionAd.value = randomArrayNumber(val.data.length);
    } else {
      news.value = [];
    }
  }
});

// Move pagination, outside of pagination component as otherwise it will be initiated two times
onKeyDown("ArrowLeft", () => {
  if(!dataNews.value) return;
  if (itemPage.value > 1) {
    itemPage.value--;
  }
})
onKeyDown("ArrowRight", () => {
  if(!dataNews.value) return;
  if (itemPage.value < dataNews.value.meta.pagination.pageCount) {
    itemPage.value++;
  }
})

// Randomly add an ad into news feed
function randomArrayNumber(length: number) {
  return Math.floor(Math.random() * length);
}

function customStringify(params: any) {
  return stringify(params, {
    arrayFormat: "indices",
    encode: false,
  });
}
</script>
