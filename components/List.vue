<template>
  <div>
    <div class="sticky top-0 py-4 z-10">
      <h2 class="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">Ingredients</h2>
    </div>
    <div class="overflow-y-auto max-h-[calc(100vh-6rem)]">
      <ul class="space-y-2">
        <li v-for="(item, index) in items" :key="index" class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <span class="text-gray-800 dark:text-gray-300">{{ item }}</span>
          <button @click="deleteItem(index)" class="text-red-600 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
    <div class="mt-4">
      <input type="text" v-model="newItem" class="border border-gray-300 dark:border-gray-700 p-2 rounded-md mr-2 focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-600">
      <button @click="addItem" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-600">
        Add Item
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      newItem: ''
    };
  },
  methods: {
    deleteItem(index) {
      this.items.splice(index, 1);
    },
    addItem() {
      if (this.newItem.trim() !== '') {
        this.items.push(this.newItem.trim());
        this.newItem = '';
      }
    },
    sendItemsToParent() {
      this.$emit('items-to-parent', this.items);
    }
  }
}
</script>
