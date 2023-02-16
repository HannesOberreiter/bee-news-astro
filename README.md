# Beekeeping News Feed

![CI](https://github.com/HannesOberreiter/bee-news-astro/workflows/CI/badge.svg?branch=main)

A simple news feed for beekeeping related news. It is built using Astro. The feeds are served via a Strapi host.

> [https://www.beekeeping-news.com/](https://www.beekeeping-news.com/)

## License

[GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE)

## i18n Support

This project uses i18nNext for translations and the command `npx astro-i18next generate` needs to be run beforehand, to build the translation files pages.

## Commands Cheatsheet

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |
