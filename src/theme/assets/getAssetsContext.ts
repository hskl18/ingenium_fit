// Asset context helper for dynamic imports
export default function getAssetsContext(type: "images" | "icons") {
  if (type === "images") {
    // Create context for images - exclude @2x and @3x files to avoid conflicts
    const context = require.context(
      "../../assets/images",
      false,
      /^\.\/[^@]*\.(png|jpg|jpeg|gif|webp)$/
    );

    return (path: string) => {
      try {
        // Clean the path - ensure it starts with ./
        const cleanPath = path.startsWith("./") ? path : `./${path}`;
        return context(cleanPath);
      } catch (error) {
        console.warn(`Could not load image: ${path}`, error);
        // Return a placeholder image source
        return import("../../assets/images/nothing.png");
      }
    };
  }

  if (type === "icons") {
    // Create context for icons
    const context = require.context("../../assets/icons", true, /\.svg$/);

    return (path: string) => {
      try {
        // Clean the path - ensure it starts with ./
        const cleanPath = path.startsWith("./") ? path : `./${path}`;
        return context(cleanPath);
      } catch (error) {
        console.warn(`Could not load icon: ${path}`, error);
        // Return a placeholder SVG component
        return {
          default: () => null,
        };
      }
    };
  }

  throw new Error(`Unknown asset type: ${type}`);
}
