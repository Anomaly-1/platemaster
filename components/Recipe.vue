<template>
  <div class="max-w-md mx-auto ml-8">
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4 text-blue-800 dark:text-blue-300">Recipe</h2>
      <div v-if="isLoading" class="text-gray-600 dark:text-gray-400">Loading...</div>
      <div v-else-if="response" class="text-gray-800 dark:text-gray-300" v-html="formattedResponse"></div>
      <div v-else class="text-gray-600 dark:text-gray-400">No recipe found.</div>
      <button v-if="response && !recipeSaved" @click="saveRecipe" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-600">
        Save Recipe
      </button>
    </div>
  </div>
</template>

<script>
import { GoogleGenerativeAI } from '@google/generative-ai';

export default {
  props: {
    items: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      response: null,
      isLoading: false,
      recipeSaved: false // New property to track whether recipe is saved or not
    };
  },
  computed: {
    formattedResponse() {
      return this.response.replace(/\n/g, "<br>");
    }
  },
  methods: {
    async saveRecipe() {
      try {
        const recipeText = this.response;
        const supabase = useSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.from('recipes').insert([
          { username: user.email, recipe_text: recipeText }
        ]);

        if (error) {
          throw error;
        }

        console.log('Recipe saved successfully!');
        this.recipeSaved = true; // Update recipeSaved flag
      } catch (error) {
        console.error('Error saving recipe:', error.message);
      }
    },
    async sendToGeminiAPI(items) {
      this.isLoading = true;
      const genAI = new GoogleGenerativeAI(gemini);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "Create an original ideal recipe using these ingredients (including portions) with numbered separated steps: " + items.join(" ") + " Your Reponse should contain THREE parts: Simply state the title of the recipe, the ingredients needed, and the numbered steps; Additionally, you will put a '\n' character anywhere there is a newline needed.";

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        this.response = text;
      } catch (error) {
        console.error("Error fetching recipe:", error);
        this.response = "Error fetching recipe.";
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.sendToGeminiAPI(this.items);
  },
};
</script>
