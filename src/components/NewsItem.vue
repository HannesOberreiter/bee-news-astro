<template>
  <div
    class="top-full left-0 w-full p-4 bg-orange-100 border border-orange-200 dark:bg-gray-700 dark:border-amber-700 rounded-md mb-1"
  >
    <div class="flex items-center justify-between">
      <div>
        {{ feedsource.attributes.source }} ({{
          getLocalization(language.attributes)
        }})
      </div>
      <div>
        <span v-if="isNew(item.attributes.createdAt, lastVisit)"> 🔥 </span>
        <NewsBadge
          :class="{
            'bg-orange-300': isLatestNews(item.attributes.published),
            'bg-orange-600 text-white': isToday(item.attributes.published),
          }"
        >
          {{ formattedPublishDate }}
        </NewsBadge>
      </div>
    </div>

    <div class="text-lg font-bold">
      <a :href="item.attributes.link" target="_blank">
        {{ item.attributes.title }}
        <img
          src="/link-arrow.svg"
          class="w-4 inline-flex mb-1"
          alt="Left up arrow inside a box, indicating outgoing link"
        />
      </a>
    </div>
    {{ item.attributes.url }}
    <p
      v-if="item.show"
      class="text-sm cursor-pointer"
      v-html="truncate(item.attributes.preview, 2500)"
      @click="item.show = item.show ? false : true"
    ></p>
    <p
      v-else
      class="text-sm"
      :class="
        item.attributes.preview.length > 100
          ? 'cursor-pointer'
          : 'cursor-default'
      "
      v-html="truncate(item.attributes.preview, 100)"
      @click="item.show = item.show ? false : true"
    ></p>

    <div class="flex items-center gap-2 pt-2">
      <div v-for="category in categories" :key="`category_${category.id}`">
        <NewsBadge class="bg-orange-300">
          {{ getLocalization(category.attributes) }}
        </NewsBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NewsBadge from "./NewsBadge.vue";
import { useDateFormat } from "@vueuse/core";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  feedsource: {
    type: Object,
    required: true,
  },
  language: {
    type: Object,
    required: true,
  },
  categories: {
    type: Object,
    required: true,
  },
  lastVisit: {
    type: Date,
    required: true,
  },
  currentLanguage: {
    type: String,
    required: true,
  },
});

const formattedPublishDate = useDateFormat(
  props.item.attributes.published,
  "YYYY-MM-DD"
);

function truncate(value: string, max: number) {
  if (!value) return "";
  return value.length > max ? value.substring(0, max) + "..." : value;
}

function isToday(date: string) {
  return (
    new Date(date).getDate() === new Date().getDate() &&
    new Date(date).getFullYear() === new Date().getFullYear() &&
    new Date(date).getMonth() === new Date().getMonth()
  );
}

function isLatestNews(date: string) {
  return +new Date(date) > new Date().setDate(new Date().getDate() - 7);
}

function isNew(date: string, lastVisit: Date) {
  return new Date(date) > lastVisit;
}

function getLocalization(ob: any) {
  if (props.currentLanguage === "en") {
    return ob.name;
  } else {
    if (!("localizations" in ob)) return ob.name;
    if (!("data" in ob.localizations)) return ob.name;
    return ob.localizations.data[0].attributes.name;
  }
}
</script>
