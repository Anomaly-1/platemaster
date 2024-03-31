<template>
  <div class="nutrition-label border border-white rounded-lg p-4 lg:px-8 lg:py-6">
    <div class="flex justify-between mb-2">
      <div class="text-white font-bold">Nutrition Facts</div>
      <div class="text-white">Amount per serving</div>
    </div>
    <hr class="thick-line border-white mb-2">
    
    <!-- Nutrition categories -->
    <div class="grid grid-cols-2 gap-x-4">
      <div class="text-white text-left"><b>Name</b></div>
      <div class="text-white text-right">{{ item.name }}</div>

      <div class="calories text-white text-left"><b>Calories</b></div>  
      <div class="text-white text-right calories font-bold">{{ item.calories }}</div>
      <hr class="extend thick-line border-white mb-2 mt-2">
      <br>

      <div class="text-white text-left"><b>Total Fat</b></div>
      <div class="text-white text-right">{{ item.totalFat }}g</div>
  
      <div class="text-white text-left"><b>Saturated Fat</b></div>
      <div class="text-white text-right">{{ item.saturatedFat }}g</div>
  
      <div class="text-white text-left"><b>Trans Fat</b></div>
      <div class="text-white text-right">{{ item.transFat }}g</div>
  
      <div class="text-white text-left"><b>Polyunsaturated Fat</b></div>
      <div class="text-white text-right">{{ item.polyunsaturatedFat }}g</div>
  
      <div class="text-white text-left"><b>Monounsaturated Fat</b></div>
      <div class="text-white text-right">{{ item.monounsaturatedFat }}g</div>
  
      <div class="text-white text-left"><b>Cholesterol</b></div>
      <div class="text-white text-right">{{ item.cholesterol }}mg</div>
  
      <div class="text-white text-left"><b>Sodium</b></div>
      <div class="text-white text-right">{{ item.sodium }}mg</div>
  
      <div class="text-white text-left"><b>Fiber</b></div>
      <div class="text-white text-right">{{ item.fiber }}g</div>
  
      <div class="text-white text-left"><b>Sugars</b></div>
      <div class="text-white text-right">{{ item.sugars }}g</div>
  
      <div class="text-white text-left"><b>Protein</b></div>
      <div class="text-white text-right">{{ item.protein }}g</div>
      <hr class="extend thick-line border-white mb-2 mt-2">
      <br>

      <div class="text-white text-left"><b>Vitamin A</b></div>
      <div class="text-white text-right">{{ item.vitaminA }}µg</div>
  
      <div class="text-white text-left"><b>Vitamin C</b></div>
      <div class="text-white text-right">{{ item.vitaminC }}mg</div>
  
      <div class="text-white text-left"><b>Calcium</b></div>
      <div class="text-white text-right">{{ item.calcium }}mg</div>
  
      <div class="text-white text-left"><b>Iron</b></div>
      <div class="text-white text-right">{{ item.iron }}mg</div>
  
      <div class="text-white text-left"><b>Potassium</b></div>
      <div class="text-white text-right">{{ item.potassium }}mg</div>
  
      <div class="text-white text-left"><b>Vitamin D</b></div>
      <div class="text-white text-right">{{ item.vitaminD }}µg</div>
    </div>
  
    <!-- Daily values -->
    <div class="mt-4 text-xs">
      <div class="text-white">* Percent Daily Values are based on a 2000 calorie diet.</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  watch: {
    item(newValue, oldValue) {
      console.log('Item changed:', newValue);
    }
  }
};
</script>

<style scoped>
/* Add additional styles here */
.nutrition-label {
  background-color: black;
  color: white;
}

/* Styling for thick white lines */
.thick-line {
  border-top: 10px solid white; /* Adjust thickness as needed */
}

.extend {
  width: 205%;
}

/* Styling for smaller calorie count */
.calories {
  font-size: 2rem; /* Adjust font size as needed */
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}
</style>
