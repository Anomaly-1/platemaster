<script setup>
definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="absolute h-screen w-screen flex items-center justify-center">
    <div class="flex">
      <div>
        <UploadBox @parsedData="handleParsedData" v-if="showUploadBox" />
        <List v-if="!showUploadBox" :items="parsedItems" @items-to-parent="handleItemsFromChild" />
        <button @click="showGeminiComponent" v-if="!showUploadBox && !showGeminiBox" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-600">
          Find Food
        </button>
      </div>
      <div v-if="showGeminiBox">
        <Recipe :items="parsedItems" @gemini-response="handleGeminiResponse" />
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
      parsedItems: []
    }
  },
  methods: {
    handleParsedData(parsedData) {
      this.parsedItems = parsedData;
      this.showUploadBox = false;
    },
    showGeminiComponent() {
      this.showGeminiBox = true;
    }
  }
}
</script> 