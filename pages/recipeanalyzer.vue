<template>
  <div class="container mx-auto px-4 py-8 flex flex-col lg:flex-row overflow-y-auto h-screen">
    <!-- Left side with input -->
    <div class="lg:w-1/2 lg:pr-4 mt-20">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white">Analyze Recipe</h1>
        <p class="mt-2 text-lg text-gray-400">Type your ingredients below</p>
      </div>
      <input v-model="recipeTitle" class="w-full h-12 px-4 py-2 mb-4 border border-white bg-black text-white rounded-lg resize-none focus:outline-none focus:border-green-200" placeholder="Recipe Title">
      <textarea v-model="inputText" class="w-full h-32 sm:h-40 px-4 py-2 mb-4 border border-white bg-black text-white rounded-lg resize-none focus:outline-none focus:border-green-200" placeholder="Type your ingredients here..."></textarea>
      <textarea v-model="recipeSummary" class="w-full h-32 sm:h-40 px-4 py-2 mb-4 border border-white bg-black text-white rounded-lg resize-none focus:outline-none focus:border-green-200" placeholder="Recipe Summary *Optional"></textarea>
      <input v-model="cookingTime" class="w-full h-12 px-4 py-2 mb-4 border border-white bg-black text-white rounded-lg resize-none focus:outline-none focus:border-green-200" placeholder="Cooking Time *Optional">
      <textarea v-model="prepInstructions" class="w-full h-32 sm:h-40 px-4 py-2 mb-4 border border-white bg-black text-white rounded-lg resize-none focus:outline-none focus:border-green-200" placeholder="Preparation Instructions *Optional"></textarea>
      <button :disabled="cooldown > 0" @click="handleButtonClick" class="rounded-md w-full py-2 px-4 transition duration-300 ease-in-out border border-emerald-600 bg-black text-emerald-600 font-bold py-4 px-8 rounded-lg border-2 transition duration-300 hover:border-white hover:text-emerald-600">
        <span v-if="cooldown === 0" class="text-xl">Analyze</span>
        <span v-else>
          <!-- Clock icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
      </button>
      <br/>
      <br/>
    </div>

    <!-- Right side with large card -->
    <div class="lg:w-1/2 lg:pl-4 lg:h-fit mt-20 mb-72">
      <div class="bg-gray-800 text-white p-6 rounded-lg h-full">
        <h2 class="text-2xl font-bold mb-4">Analysis Results</h2>
        <NutritionLabel :item="items"/>
      </div>
    </div>
  </div>
  <Sidebar/>
</template>

<script>
export default {
  data() {
    return {
      recipeTitle: '',
      inputText: '',
      recipeSummary: '',
      cookingTime: '',
      prepInstructions: '',
      items: {},
      cooldown: 0 // Cooldown timer in seconds
    };
  },
  methods: {
    async storeIngredients() {
      try {
        const appId = edamamingid;
        const appKey = edamamingkey;
        const apiUrl = `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`;

        const ingredientLines = this.inputText.split("\n");

        const data = {
          title: this.recipeTitle,
          ingr: ingredientLines,
          url: "", // Add your recipe URL here
          summary: this.recipeSummary,
          yield: "1",
          time: this.cookingTime,
          img: "", // Add your recipe image URL here
          prep: this.prepInstructions
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData); // Log the response data

        // Create the item object using data from the API response
        this.items = {
          name: "Mystery", // Set the name to the input text
          serving: 1, // Assuming serving size is 1
          servingPerContainer: 0, // Assuming no servings per container
          servingUnitName: 'serving', // Assuming serving unit is 'serving'
          ingredientStatement: "", // Set the ingredient statement to the input text
          calories: responseData.calories,
          totalFat: Math.round(responseData.totalNutrients.FAMS.quantity + responseData.totalNutrients.FAPU.quantity + responseData.totalNutrients.FATRN.quantity + responseData.totalNutrients.FASAT.quantity),
          saturatedFat: Math.round(responseData.totalNutrients.FASAT.quantity),
          transFat: Math.round(responseData.totalNutrients.FATRN.quantity),
          polyunsaturatedFat: Math.round(responseData.totalNutrients.FAPU.quantity),
          monounsaturatedFat: Math.round(responseData.totalNutrients.FAMS.quantity),
          cholesterol: Math.round(responseData.totalNutrients.CHOLE.quantity),
          sodium: Math.round(responseData.totalNutrients.NA.quantity),
          fiber: Math.round(responseData.totalNutrients.FIBTG.quantity),
          sugars: Math.round(responseData.totalNutrients.SUGAR.quantity),
          protein: Math.round(responseData.totalNutrients.PROCNT.quantity),
          vitaminA: Math.round(responseData.totalNutrients.VITA_RAE.quantity),
          vitaminC: Math.round(responseData.totalNutrients.VITC.quantity),
          calcium: Math.round(responseData.totalNutrients.CA.quantity),
          iron: Math.round(responseData.totalNutrients.FE.quantity),
          potassium: Math.round(responseData.totalNutrients.K.quantity),
          vitaminD: Math.round(responseData.totalNutrients.VITD.quantity),
        };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async handleButtonClick() {
      // Disable button and set cooldown
      this.cooldown = 8;
      // Call storeIngredients method to fetch data
      await this.storeIngredients();
      // Start cooldown countdown
      const interval = setInterval(() => {
        if (this.cooldown > 0) this.cooldown--;
        else clearInterval(interval); // Clear interval when cooldown reaches 0
      }, 1000);
    },
    isEmpty() {
      return !this.items || Object.keys(this.items).length === 0;
    }
  }
};
</script>

<style>
/* Hide the scrollbar while keeping its functionality */
.container {
  overflow: auto;
}

/* Hide scrollbar for Chrome, Safari, and Opera */
::-webkit-scrollbar {
  width: 0; /* Set width to 0 to hide the scrollbar */
}
</style>
