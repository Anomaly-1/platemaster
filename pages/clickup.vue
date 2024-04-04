<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="absolute h-screen w-screen flex items-center justify-center">
    <div class="flex">
      <div>
        <UploadBox @parsedData="handleParsedData" v-if="showUploadBox" />
        <template v-else>
          <template v-if="selectedOption === '...'">
            <List :items="parsedItems" @ingredients-updated="handleItemsUpdated" @find-recipe="handleFindRecipe"/>
          </template>
          <template v-else-if="selectedOption === 'Create Recipe'">
            <Recipe :items="parsedItems" />
          </template> 
          <template v-else>
            <Result v-if="showFindRecipe" :items="parsedItems"/>
          </template>
        </template>
      </div>
    </div>
  </div>
  <Sidebar />
</template>

<script>
export default {
  data() {
    return {
      showUploadBox: true,
      showGeminiBox: false,
      parsedItems: [],
      showFindRecipe: false,
      selectedOption: '...' // Track the selected option
    };
  },
  methods: {
    handleParsedData(parsedData) {
      this.parsedItems = parsedData;
      this.showUploadBox = false;
    },
    handleItemsUpdated(updatedItems) {
      this.parsedItems = updatedItems;
      this.selectedOption = 'Create Recipe'; // Set the selected option to 'Create Recipe'
    },
    handleFindRecipe(updatedItems) {
      this.parsedItems = updatedItems;
      this.showFindRecipe = true;
      this.selectedOption = 'Find Recipe'; // Set the selected option to 'Find Recipe'
    }
  }
}
</script>
