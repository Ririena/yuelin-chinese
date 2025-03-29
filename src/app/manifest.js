export default function manifest() {
  return {
    name: "Yue Chinese",
    short_name: "汉字学习",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/128.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/128.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
