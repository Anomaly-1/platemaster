<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div>
    <div class="flex justify-center mt-8 items-center">
      <button @click="navigateTo('/start')"
        class="border border-white bg-black text-white font-bold py-2 px-4 rounded transition duration-300 hover:bg-white hover:text-black"
      >
        Modify Data
      </button>
    </div>
  </div>
  <Sidebar/>
</template>
<script>
export default {
  
}
</script>
<style>
  
</style>