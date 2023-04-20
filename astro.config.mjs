import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import vue from "@astrojs/vue";

// https://github.com/yassinedoghri/astro-i18next
import astroI18next from "astro-i18next";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
import webmanifest from "astro-webmanifest";

import svgLoader from "vite-svg-loader";

// https://astro.build/config
export default defineConfig({
  site: "https://www.beekeeping-news.com/",
  integrations: [
    tailwind(),
    vue(),
    astroI18next(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          de: "de",
        },
      },
    }),
    robotsTxt({
      host: true,
      sitemap: true,
    }),
    compress({
      img: false,
      svg: false,
      html: false,
    }),
    webmanifest({
      name: "Beekeeping News",
      icon: "src/images/icon.png",
      short_name: "Bee News",
      description:
        "A curated selection of worldwide feeds related around the topic of beekeeping and honeybees.",
      start_url: "/",
      theme_color: "#fdba74",
      background_color: "#feedd5",
      display: "standalone",
      lang: "en",
      locales: {
        de: {
          name: "Imkerei Nachrichten",
          short_name: "Bienen News",
          description:
            "Eine kuratierte Auswahl weltweiter Feeds rund um das Thema Bienenzucht und Honigbienen.",
          lang: "de",
          start_url: "/de",
        },
      },
    }),
  ],
  vite: {
    plugins: [vue(), svgLoader()],
  },
});
