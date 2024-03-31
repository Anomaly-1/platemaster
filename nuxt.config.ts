// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite : {
    define : {
      gemini: JSON.stringify(process.env.GEMINI_KEY),
      edamamrecipekey: JSON.stringify(process.env.EDAMAM_RECIPE_API_KEY),
      edamamrecipeid: JSON.stringify(process.env.EDAMAM_RECIPE_API_ID),
      edamamingkey: JSON.stringify(process.env.EDAMAM_ING_API_KEY),
      edamamingid: JSON.stringify(process.env.EDAMAM_ING_API_ID), 
    }
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  css:['~/assets/styles.scss'],
  supabase: {
    redirect: false,
  },
  devtools: { enabled: true },
})