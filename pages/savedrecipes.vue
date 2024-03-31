<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Search Bar -->
    <div class="relative flex items-center mb-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search recipes..."
        class="w-full pl-10 pr-3 py-2 border border-2 rounded-lg bg-transparent"
      />
      <!-- Search Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="white"
        class="absolute top-1/2 transform -translate-y-1/2 left-3 w-6 h-6 text-gray-400 dark:text-gray-300"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <!-- Recipe Counter -->
      <div class="text-gray-500 dark:text-gray-400 ml-4"> {{ totalRecipes }} Total Recipes Found</div>
    </div>
    <!-- Recipe Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="p-4 border border-2 rounded-lg shadow-md"
      >
        <div class="flex flex-col h-full">
          <div class="overflow-hidden">
            <p
              class="markdown-content text-gray-600 dark:text-gray-300 break-words flex-grow"
              v-html="formatRecipeText(recipe.recipe_text)"
              :class="{ 'max-h-20': !recipe.expanded }"
            ></p>
          </div>
          <button @click="toggleExpand(recipe)" class="text-blue-500 mt-2 self-end">
            Toggle Expand
          </button>
          <button @click="deleteRecipe(index, recipe.recipe_text)" class="text-red-600 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <Sidebar />
</template>

<script>
import {marked} from 'marked';

export default {
  data() {
    return {
      recipes: [],
      searchTerm: ''
    };
  },
  async mounted() {
    await this.fetchRecipes();
  },
  computed: {
    filteredRecipes() {
      if (!this.searchTerm.trim()) {
        return this.recipes;
      } else {
        return this.recipes.filter(recipe =>
          recipe.recipe_text.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    },
    totalRecipes() {
      return this.recipes.length;
    }
  },
  methods: {
    async fetchRecipes() {
      try {
        const supabase = useSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('username', user.email);
        if (error) {
          throw error;
        }
        this.recipes = data.map(recipe => ({ ...recipe, expanded: false }));
      } catch (error) {
        console.error('Error fetching recipes:', error.message);
      }
    },
    formatRecipeText(text) {
      return marked(text);
    },
    toggleExpand(recipe) {
      recipe.expanded = !recipe.expanded;
    },
    async deleteRecipe(index, text) {
      const supabase = useSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      try {
        const { data, error } = await supabase
          .from('recipes')
          .delete()
          .eq('username', user.email) // Assuming email is the field that matches the user email
          .eq('recipe_text', text); // Assuming recipe_text is the unique identifier

        if (error) {
          throw error;
        }

        // Remove the deleted recipe from the local array
        this.recipes = this.recipes.filter(recipe => recipe.recipe_text !== text);
      } catch (error) {
        console.error('Error deleting recipe:', error.message);
      }
    }

  }
};
</script>

<style scoped>
/* Add any additional styles for the search bar here */
</style>
