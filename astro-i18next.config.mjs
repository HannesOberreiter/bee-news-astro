/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLocale: "en",
  locales: ["en", "de"],
  showDefaultLocale: true,
  load: ["client", "server"],
  i18nextClient: {
    fallbackLng: "en",
  },
};
