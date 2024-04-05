<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <button @click="navigateTo('/start')"
      class="border border-emerald-600 bg-black text-emerald-600 font-bold py-4 px-8 rounded-lg transition duration-300 hover:bg-white text-3xl hover:text-emerald-600"
    >
      Modify Data
    </button>
  </div>
  <Sidebar/>
</template>


<script>
export default {
  
}
</script>
<style>
  
</style>