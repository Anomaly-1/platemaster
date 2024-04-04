<template>
  <div class="max-w-md mx-auto ml-8">
    <div class="bg-black dark:bg-white shadow-md border-2 border-white dark:border-black p-6">
      <h1 class="text-4xl font-bold mb-4 text-white dark:text-black">Recipe</h1>
      <div v-if="isLoading" class="text-gray-400 dark:text-gray-600">Loading...</div>
      <div v-else-if="response">
        <div class="markdown-content" v-html="renderedMarkdown"></div>
      </div>
      <div v-else class="text-gray-400 dark:text-gray-600">No recipe found.</div>
      <button v-if="response && !recipeSaved"
              @click="saveRecipe()"
              class="text-white border border-white hover:border-black hover:bg-white hover:text-black font-bold py-1 px-4 rounded-full inline-block transition duration-300 ease-in-out">
        Save Recipe
      </button>

    </div>
  </div>
</template>

<script>
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

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
      recipeSaved: false
    };
  },
  computed: {
    renderedMarkdown() {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            breaks: true,
            smartLists: true,
            smartypants: true,
            math: true,
        });
        return marked.parse(this.response);
    },
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

        console.log(recipeText)

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
      const prompt = " Create an original ideal recipe using these ingredients (including portions) with numbered separated steps:" + items.join(" ") + "Your Response should be in aesthetic Markdown and contain THREE parts: 1. ## Title of the Recipe: (Provide a clear and descriptive title for your recipe.) 2. **Ingredients**: (List the ingredients with bullet points.) 3. **Steps**: (List the steps with numbered points.) Ensure to use Markdown syntax for proper formatting. Add a '\n' character anywhere there is a newline needed. ";

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

<style scoped>
/* Add any additional styles for the search bar here */
</style>
