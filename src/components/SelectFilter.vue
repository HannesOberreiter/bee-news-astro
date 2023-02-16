<template>
  <div class="flex flex-row">
    <div class="grow">
      <label
        :for="`${props.name}_multiple`"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {{ placeholder }}:
      </label>
      <div v-if="error" class="text-red-500">Error: {{ error }}</div>
      <VueMultiselect
        v-else
        :id="`${props.name}_multiple`"
        :loading="isFetching"
        v-model="selected"
        :options="options"
        :placeholder="placeholder"
        label="name"
        track-by="id"
        :multiple="true"
      >
      </VueMultiselect>
    </div>
    <div class="flex-none w-6 h-6">
      <button
        class="focus:outline-none"
        :class="
          selected.length === 0
            ? 'text-gray-300'
            : 'text-green-500 hover:text-red-700'
        "
        aria-label="Clear selection"
        :disabled="selected.length === 0"
        @click="clearAll()"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
          <path
            fill-rule="evenodd"
            d="M6.707 6.707a1 1 0 0 1 1.414 0L10 8.586l2.879-2.88a1 1 0 0 1 1.414 1.414L11.414 10l2.879 2.879a1 1 0 1 1-1.414 1.414L10 11.414l-2.879 2.879a1 1 0 0 1-1.414-1.414L8.586 10 5.707 7.121a1 1 0 0 1 0-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useApi } from "../composables/useApi";
import { stringify } from "qs";
import { onMounted, ref, watch } from "vue";
import { getStore, setStore, useGlobalState } from "../composables/useStore";
import { t } from "i18next";

import VueMultiselect from "vue-multiselect";

const selected = ref([]);
const options = ref([]);
const store = useGlobalState();

const props = defineProps({
  name: {
    type: String,
    default: "categories",
  },
  lang: {
    type: String,
    default: "en",
  },
});
const params = createParams(props.name);
const paramsString = stringify(params.params, {
  arrayFormat: "indices",
  encode: false,
});

const placeholder = `${t("select")} ${t(props.name)}`;

const { data, error, isFetching } = useApi(`/api/${params.url}?${paramsString}`)
  .get()
  .json();

watch(data, (val) => {
  if (val && "data" in val) {
    if (val.data === null) return;
    options.value = (val.data as any).map(
      (item: {
        id: string;
        attributes: {
          name: string;
          source: string;
          localizations: { data: any[] };
        };
      }) => {
        if (props.name === "sources") {
          return {
            id: item.id,
            name: item.attributes.source,
          };
        } else {
          return {
            id: item.id,
            name:
              props.lang === "en"
                ? item.attributes.name
                : item.attributes.localizations.data[0].attributes.name,
          };
        }
      }
    );
  }
});

watch(selected, (val) => {
  if (val) {
    const result = setStore(store().value, props.name, val);
    store().value = result;
  }
});

onMounted(() => {
  if (store().value) {
    selected.value = getStore(store().value, props.name);
  }
});

function createParams(name: string) {
  if (name === "sources") {
    return {
      url: "feedsources",
      params: {
        filters: {
          enabled: true,
        },
        sort: ["source:asc"],
        pagination: {
          page: 1,
          pageSize: 500,
        },
      },
    };
  } else {
    return {
      url: name,
      params: {
        populate: ["localizations"],
        sort: ["name:asc"],
        pagination: {
          page: 1,
          pageSize: 500,
        },
      },
    };
  }
}

function clearAll() {
  selected.value = [];
  store().value = setStore(store().value, props.name, []);
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
