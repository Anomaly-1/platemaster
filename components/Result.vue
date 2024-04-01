<template>
  <div class="max-h-screen mx-auto ml-8 mt-8 overflow-hidden relative">
    <br>
    <h1 class="text-xl sm:text-xl md:text-3xl lg:text-5xl text-center justify-content font-bold text-white m-8 mt-30">{{ filteredHits.length }} Recipes Found</h1>
    
    <!-- Search bar -->
    <div class="relative flex items-center mb-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search recipes..."
        class="w-full text-white pl-10 pr-3 py-2 border border-2 rounded-lg bg-transparent white m-2"
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
    </div>

    <!-- Refresh Button -->
    <button @click="handleRefresh" :disabled="cooldown > 0" class="top-0 right-0 refresh-btn bg-black w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 white mt-18 mr-5 ml-4 p-2 rounded-full">
      <template v-if="cooldown === 0">
        <!-- Refresh icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </template>
      <template v-else>
        <!-- Clock icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </template>
    </button>


    <!-- Recipe grid -->
    <div class="recipe-grid-container max-h-screen overflow-y-auto mb-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div v-for="(hit, index) in filteredHits" :key="index" class="recipe-card border border-white rounded-lg shadow-md">
          <img :src="hit.recipe.image" :alt="hit.recipe.label" class="recipe-image w-full h-auto rounded-t-lg"> 
          <div class="recipe-details p-4 justify-content place-self-center content-center ">
              <h2 class="recipe-label text-lg font-bold mb-2 text-white justify-content text-center">{{ hit.recipe.label }}</h2>
              <p class="text-center recipe-calories text-sm mb-4 text-white">Total Calories: {{ Math.round(hit.recipe.calories/hit.recipe.yield) }}</p>
              <div class="flex justify-center mb-2">
                  <div class="visit-recipe-btn-container mr-2">
                      <a :href="hit.recipe.url" target="_blank" rel="noopener noreferrer" class="text-center block recipe-link border border-white text-white font-bold py-1 px-4 rounded-full inline-block transition duration-300 ease-in-out hover:bg-white hover:text-black">Visit Recipe</a>
                  </div>
                  <!-- Conditionally render the "Save Recipe" button -->
                  <div v-if="!isRecipeSaved(index)" class="visit-recipe-btn-container mr-2">
                      <a @click="saveRecipe(hit.recipe.label, hit.recipe.image, hit.recipe.calories, hit.recipe.url, index)" class="text-center block recipe-link border border-white text-white font-bold py-1 px-4 rounded-full inline-block transition duration-300 ease-in-out hover:bg-white hover:text-black cursor-pointer">Save Recipe</a>
                  </div>
              </div>
          </div>
        </div>
        <!-- Space Block 💀 -->
        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      hits: [], // Array to store parsed hits from the API response
      cooldown: 0, // Cooldown time for the refresh button
      searchTerm: '', // Search term entered by the user
      savedRecipes: [] // Array to store the IDs of saved recipes
    };
  },
  computed: {
    filteredHits() {
      // Filter hits based on the search term
      return this.hits.filter(hit =>
        hit.recipe.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      // Fetch data from API
      try {
        const data = await this.fetchDataFromAPI();
        this.hits = data.hits || [];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    isRecipeSaved(id) {
      return this.savedRecipes.includes(id);
    },
    async saveRecipe(label, image, calories, url, id) {
        try {
            const push = "<h1>"+label+"</h1>"+"\n"+"<img src="+image+" alt= Recipe>"+"\n"+"<b style='text-center'>Calories</b>: "+Math.round(calories)+"\n\n"+"<div style='display: flex; justify-content: center;'> <a href="+url+"target='_blank' rel='noopener noreferrer' style='text-align: center; display: block; border: 1px solid white; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 9999px; transition: background-color 0.3s, color 0.3s; text-decoration: none;'> Visit Recipe</a></div>";
            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser()

            const { data, error } = await supabase.from('recipes').insert([
              { username: user.email, recipe_text: push }
            ]);
            this.savedRecipes.push(id);

        } catch (error) {
            console.error('Error saving recipe:', error.message);
        }
    },
    async fetchDataFromAPI() {
      const appId = edamamrecipeid;
      const appKey = edamamrecipekey;
      const shuffled = this.items.sort(() => 0.5 - Math.random()).slice(0, 3);
      const query = encodeURIComponent(shuffled.join(' '));
      const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${appKey}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    },
    async handleRefresh() {
      if (this.cooldown === 0) {
        // Start cooldown
        this.cooldown = 10;
        // Fetch data from API
        await this.fetchData();
        // Countdown
        const interval = setInterval(() => {
          if (this.cooldown > 0) this.cooldown--;
          else clearInterval(interval);
        }, 1000);
      }
    }
  }
};
</script>

<style scoped>
.refresh-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}

.refresh-btn:disabled {
  cursor: not-allowed;
}
</style>
