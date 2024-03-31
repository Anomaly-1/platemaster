<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
    <div class="container mx-auto px-4 py-8 flex flex-col lg:flex-row overflow-y-auto h-screen">
      <!-- Left side with input -->
      <div class="lg:w-1/2 lg:pr-4 mt-20">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-white">Analyze Ingredients</h1>
          <p class="mt-2 text-lg text-gray-400">Type your ingredients below</p>
        </div>
        <textarea v-model="inputText" class="w-full h-32 sm:h-40 px-4 py-2 mb-4 border border-white bg-black text-white rounded-lg resize-none focus:outline-none focus:border-green-200" placeholder="Type your ingredients here..."></textarea>
        <button @click="storeIngredients" class="w-full py-2 px-4 text-white border border-white rounded-full transition duration-300 ease-in-out hover:bg-white hover:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500">
          Analyze
        </button>
        <br/>
        <br/>
      </div>
  
      <!-- Right side with large card -->
      <div class="lg:w-1/2 lg:pl-4 lg:h-fit mt-20">
        <div class="bg-gray-800 text-white p-6 rounded-lg h-full">
          <h2 class="text-2xl font-bold mb-4">Analysis Results</h2>
          <NutritionLabel :item="items" v-if="!isEmpty()" />
        </div>
      </div>
    </div>
    <Sidebar/>
</template>
  
  <script>
  export default {
    data() {
      return {
        inputText: '',
        items: {}
      };
    },
    methods: {
        async storeIngredients() {
            try {
            const appId = edamamingid;
            const appKey = edamamingkey;
            const input = this.inputText;
            console.log(input);
            const apiUrl = `https://api.edamam.com/api/nutrition-data?ingr=${input}&app_id=${appId}&app_key=${appKey}&nutrition-type=logging`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Create the item object using data from the API response
            this.items = {
                name: "Mystery", // Set the name to the input text
                serving: 1, // Assuming serving size is 1
                servingPerContainer: 0, // Assuming no servings per container
                servingUnitName: 'serving', // Assuming serving unit is 'serving'
                ingredientStatement: input, // Set the ingredient statement to the input text
                    calories: data.calories,
                    totalFat: Math.round(data.totalNutrients.FAMS.quantity+data.totalNutrients.FAPU.quantity+data.totalNutrients.FATRN.quantity+data.totalNutrients.FASAT.quantity),
                    saturatedFat: Math.round(data.totalNutrients.FASAT.quantity),
                    transFat: Math.round(data.totalNutrients.FATRN.quantity),
                    polyunsaturatedFat: Math.round(data.totalNutrients.FAPU.quantity),
                    monounsaturatedFat: Math.round(data.totalNutrients.FAMS.quantity),
                    cholesterol: Math.round(data.totalNutrients.CHOLE.quantity),
                    sodium: Math.round(data.totalNutrients.NA.quantity),
                    // totalCarb: Math.round(data.totalNutrients.FAMS['CHOCDF.net'].quantity),
                    fiber: Math.round(data.totalNutrients.FIBTG.quantity),
                    sugars: Math.round(data.totalNutrients.SUGAR.quantity),
                    protein: Math.round(data.totalNutrients.PROCNT.quantity),
                    vitaminA: Math.round(data.totalNutrients.VITA_RAE.quantity),
                    vitaminC: Math.round(data.totalNutrients.VITC.quantity),
                    calcium: Math.round(data.totalNutrients.CA.quantity),
                    iron: Math.round(data.totalNutrients.FE.quantity),
                    // addedSugars: Math.round(SUGAR.added.quantity),
                    potassium: Math.round(data.totalNutrients.K.quantity),
                    vitaminD: Math.round(data.totalNutrients.VITD.quantity),
            };
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        isEmpty(obj) {
            if (this.items == null){
                return true;
            }
            else {
                return false;
            }
        }
    }
  };
  </script>
  
  <style>
  /* Add any additional styles here */
  </style>
  