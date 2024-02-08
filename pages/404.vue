<template>
    <title>404 - Page Not Found</title>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p class="text-lg text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
      <a @click="navigateTo('/login')" class="text-blue-500 hover:underline">Go back to home</a>
    </div>
</template>
  
<script>
</script>
  
<style scoped>
</style>