// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite : {
    define : {
      gemini: JSON.stringify(process.env.GEMINI_KEY)
    }
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  supabase: {
    redirect: false,
  },
  devtools: { enabled: true },
})