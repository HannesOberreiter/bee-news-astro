<template>
  <div
    class="top-full left-0 w-full p-4 bg-orange-100 border border-orange-200 dark:bg-gray-700 dark:border-amber-700 rounded-md mb-1"
  >
    <div class="flex items-center justify-between">
      <div>
        {{ item.attributes.feedsource.data.attributes.source }}
      </div>
      <div>
        <NewsBadge class="bg-yellow-600 text-white">
          {{ t("sponsored") }}
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
    <p class="text-sm cursor-pointer" v-html="item.attributes.preview"></p>

    <!--
     <div class="flex items-center gap-2 pt-2">
      <NewsBadge class="bg-orange-300">
        {{ t("advertisement") }}
      </NewsBadge>
     </div>
     -->
  </div>
</template>

<script setup lang="ts">
import NewsBadge from "./NewsBadge.vue";
import { t } from "i18next";

defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
