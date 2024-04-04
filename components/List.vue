<template>
  <div class="ingredients-container max-w-full mx-20">
    <h1 class="title text-white text-4xl font-bold mb-8 outfit-outfit">Ingredients</h1>
    <div class="ingredient-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8 overflow-auto">
      <div v-for="(ingredient, index) in itemsArray" :key="index" class="ingredient-box relative flex items-center justify-center border border-white p-4 mb-4"
           @mouseover="showDelete[index] = true" @mouseout="showDelete[index] = false">
        <span class="text-white px-4 py-2 uppercase outfit-outfit">{{ ingredient }}</span>
        <img v-show="showDelete[index]" @click="deleteIngredient(index)" src="/delete-icon.png" alt="Delete Icon" class="delete-icon w-4 h-4 absolute top-0 right-0 cursor-pointer">
      </div>
    </div>
    <div class="add-ingredient flex items-center mt-8">
      <input v-model="newIngredient" type="text" placeholder="Add Ingredient" class="ingredient-input px-2 py-2 border border-white rounded-none text-white bg-transparent outfit-outfit flex-grow mr-4 w-full">
      <img src="/plus-icon.png" alt="Plus Icon" class="plus-icon w-6 h-6 cursor-pointer" @click="addIngredient">
    </div>
    <br>
    <div class="justify-content text-center">
      <button @click="emitIngredients" class="create-recipe-button border border-white text-white py-2 px-4 mt-4 text-lg flex items-center space-x-2 transition-transform">
        <span>Create Recipe</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      <button @click="emitFindRecipe" class="find-recipe-button border border-white text-white py-2 px-4 mt-4 text-lg flex items-center space-x-2 transition-transform">
        <span>Find Recipe</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array // Update prop type to Array
  },
  data() {
    return {
      newIngredient: '',
      showDelete: []
    };
  },
  computed: {
    itemsArray() { 
      // Ensure items is an array before processing
      if (Array.isArray(this.items)) {
        return this.items; // Return the array directly
      } else {
        return []; // Return an empty array if items is not an array
      }
    }
  },
  methods: {
    addIngredient() {
      if (typeof this.newIngredient === 'string' && this.newIngredient.trim() !== '') {
        this.itemsArray.push(this.newIngredient.trim());
        this.newIngredient = '';
      }
    },
    deleteIngredient(index) {
      this.itemsArray.splice(index, 1);
    },
    emitIngredients() {
      this.$emit('ingredients-updated', this.itemsArray);
    },
    emitFindRecipe() {
      this.$emit('find-recipe', this.itemsArray);
    }
  }
};
</script>

<style scoped>
/* Show delete icon when hovering over ingredient */
.ingredient-box:hover .delete-icon {
  display: block;
}

/* Hide delete icon by default */
.delete-icon {
  display: none;
}
</style>
