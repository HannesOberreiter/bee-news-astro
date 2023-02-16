import { createGlobalState, useStorage } from "@vueuse/core";

const empty = JSON.stringify({
  categories: [],
  languages: [],
  sources: [],
});

export const useGlobalState = () =>
  createGlobalState(() => useStorage(`beenews-filter`, empty));

export const getStore = (store: string, name: string) => {
  try {
    const values = JSON.parse(store);
    return values[name];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const setStore = (store: string, name: string, items: any) => {
  try {
    const values = JSON.parse(store);
    values[name] = items;
    return JSON.stringify(values);
  } catch (e) {
    console.log(e);
    return empty;
  }
};
