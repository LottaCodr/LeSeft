# Import the LeSeft design concept into Figma

This is an editable Figma **development plugin**, not an existing Figma file. The connected integration could not create Figma frames directly. Running the plugin creates **7 desktop frames, 7 mobile frames and a design-system board** using native editable Figma frames, text, shapes and image fills. There are no prototype links; the designs are static. All imagery is AI-generated, illustrative and not a representation of actual LeSeft staff, offices or projects. The logo, copy and colours are provisional.

## Steps

1. Download and unzip the Figma import package. Keep `manifest.json` and `code.js` together in the same folder. You need the Figma **desktop app for macOS or Windows**, an editable Figma Design file, and permission to use local development plugins. Open a new company-controlled Design file (or a page where you have edit permission).
2. In the desktop app, choose **Plugins → Development → Import new plugin from manifest…**, then select this folder's `manifest.json`.
3. Run **Plugins → Development → LeSeft Nigeria / Website Concept Importer**. The plugin adds its frames to the current page, to the right of existing content; it does not intentionally remove existing layers. It uses no external network requests. Wait for the completion notification.
4. Inspect the Home desktop frame first. Zoom out for the other six desktop frames, the seven mobile frames beneath them and the design-system board below. Text, shapes and image rectangles can be edited independently. If the display fonts are unavailable, Inter is used as a fallback.
5. Save the file in the **LeSeft-controlled** workspace. Replace the AI-generated images and placeholder wordmark, colours, copy, and contact details with approved assets, and review the layouts. Run the plugin only once unless you want another set of frames.

If Figma requires a plugin ID, use **Plugins → Development → New Plugin** to obtain a Figma-generated development ID, insert that ID in the `id` field of this package's `manifest.json`, then import it again. Do not use an invented publishing ID. If your organisation blocks development plugins, ask the workspace administrator to permit them or use the website preview as a visual reference.

The generator was syntax-checked and exercised with a mock Figma API, but has **not** been run inside your Figma account. Figma plan restrictions, available fonts or security policies may affect import; verify it in the target file.
