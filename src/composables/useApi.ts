import { createFetch } from "@vueuse/core";

const apiEndpoint = import.meta.env.PUBLIC_STRAPI_URL;
const bearerToken = import.meta.env.PUBLIC_STRAPI_JWT;

export const useApi = createFetch({
  baseUrl: apiEndpoint,
  options: {
    async beforeFetch({ options }) {
      options["headers"] = { Authorization: `Bearer ${bearerToken}` };
      return { options };
    },
  },
  fetchOptions: {
    // mode: "cors",
  },
});
