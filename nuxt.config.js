export default {
  mode: "spa",
  ssr: false,
  server: {
    host: "0.0.0.0",
  },
  /*
   ** Headers of the page
   */
  router: {
    base: process.env.NODE_ENV === "production" ? "/assistant-demo/" : "", // adjust to your repository name
  },
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/icon?family=Material+Icons",
      },
    ],
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "@mdi/font/css/materialdesignicons.css",
    { src: "~assets/scss/style.scss" },
    { src: "~assets/css/style.css" },
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~plugins/vuetify.js", "~plugins/packages.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/vuetify",
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    publicPath: process.env.NODE_ENV === "production" ? "/assistant-demo/" : "",
    extend(config, ctx) {},
  },
};
