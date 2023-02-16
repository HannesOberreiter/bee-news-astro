<template>
  <nav class="grid grid-cols-2">
    <ul class="flex items-center">
      <li>
        <small>
          {{ t("pagination.page") }} {{ page }} {{ t("pagination.of") }}
          {{ pageCount }}, {{ t("pagination.total") }}: {{ total }}
        </small>
      </li>
    </ul>
    <ul class="flex items-center justify-end text-black">
      <li>
        <button
          :disabled="page <= 1"
          @click="page = 1"
          class="hover:bg-gray-300 rounded-l-md px-4 py-2 mr-0.5 focus:outline-none"
          :class="
            page <= 1
              ? 'cursor-not-allowed bg-gray-50'
              : 'cursor-pointer bg-gray-200'
          "
        >
          ⏮
        </button>
      </li>
      <li>
        <button
          :disabled="page <= 1"
          @click="page -= 1"
          class="hover:bg-gray-300 rounded-l-md px-4 py-2 mr-0.5 focus:outline-none"
          :class="
            page <= 1
              ? 'cursor-not-allowed bg-gray-50'
              : 'cursor-pointer bg-gray-200'
          "
        >
          ◀
        </button>
      </li>
      <li>
        <button
          :disabled="page >= pageCount"
          @click="page += 1"
          class="hover:bg-gray-300 rounded-r-md px-4 py-2 mr-0.5 focus:outline-none"
          :class="
            page >= pageCount
              ? 'cursor-not-allowed bg-gray-50'
              : 'cursor-pointer bg-gray-200'
          "
        >
          ▶
        </button>
      </li>
      <li>
        <button
          :disabled="page >= pageCount"
          @click="page = pageCount"
          class="hover:bg-gray-300 rounded-r-md px-4 py-2 mr-0.5 focus:outline-none"
          :class="
            page >= pageCount
              ? 'cursor-not-allowed bg-gray-50'
              : 'cursor-pointer bg-gray-200'
          "
        >
          ⏭
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useVModels } from "@vueuse/core";
import { t } from "i18next";

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["update:page"]);
const { page } = useVModels(props, emit);
</script>
