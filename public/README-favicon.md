# Favicon Setup

To use your custom `mascoticon.svg` as the browser tab icon:

1. Place your `mascoticon.svg` file in the `public/` folder
2. Rename it to `favicon.svg` (overwrite the existing one)
3. The browser will automatically use it

Current favicon: `public/favicon.svg`
PWA icons: `public/icons/icon-mascot.svg` (from manifest.json)

## To update:
- Replace `public/favicon.svg` with your `mascoticon.svg`
- Optionally update `public/icons/icon-mascot.svg` for PWA icons
- Run `npm run build` to rebuild