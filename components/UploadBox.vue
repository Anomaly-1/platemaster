<template>
  <div class="relative rounded rounded-md shadow-md shadow-black">
    <label for="imageInput" class="w-full md:w-100 lg:w-140 md:h-80 max-w-3xl mx-auto border-white rounded-lg overflow-hidden shadow-lg flex">
      <div class="w-full md:w-2/3 p-6 space-y-6">
        <h1 id="title" class="text-xl md:text-3xl font-bold text-white mb-2 outfit-outfit">Find Ingredients</h1>
        <p class="text-gray-300 mb-4 outfit-outfit">Scan an image of your fridge so we can easily find several useful ingredients to use in hundreds of tasty, easy and healthy recipes.</p>
        <div 
          class="bottom-0 left-0 flex items-center justify-center px-4 py-2 bg-white text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-200 hover:bg-black hover:text-white hover:border-2 hover:border-white cursor-pointer"
          @mouseover="isHovered = true" 
          @mouseleave="isHovered = false"
        >
          <span>{{ uploadText }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" :stroke="isHovered ? 'white' : 'black'" class="w-6 h-6 m-2 transition-colors duration-300">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          </svg>
          <input type="file" @change="uploadImage" id="imageInput" class="hidden" />
        </div>

        <p class="text-sm leading-relaxed text-white flex items-center">
          <a @click="process" class="font-bold text-gray-400 flex items-center cursor-pointer">
              Manually List Ingredients
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ml-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </a>
        </p>

      </div>
      <div class="hidden md:flex md:w-1/3 items-center justify-center">
        <img src="/avacado.png" alt="Avocado" class="w-48 h-auto floating-card mb-16">
      </div>
    </label>
  </div>
</template>

<script>
import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
  data() {
    return {
      uploadText: 'Upload', // Initial text
      isHovered: false
    };
  },
  methods: {
    async uploadImage(event) {
      this.uploadText = 'Loading...'; // Change text to 'Loading...'
      let file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const dataUrl = event.target.result;
          const base64String = dataUrl.split(",")[1];

          const generativePart = {
            inlineData: {
              data: base64String,
              mimeType: file.type
            }
          };

          await this.run(generativePart);
        };

        reader.readAsDataURL(file);
      }
    },
    async process() {
      this.$emit('parsedData', "Apples");
    },
    async run(genpart) {
      const genAI = new GoogleGenerativeAI(gemini);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = "Clearly and ONLY list ALL food ingredients in this image, every ingredient should have the first letter capitalized and should be only separated by a single space. It should only contain valid food ingredients.";

      const result = await model.generateContent([prompt, genpart]);
      const firstresponse = await result.response;
      const text = firstresponse.text().split(" ");

      this.$emit('parsedData', text);
      this.uploadText = 'Upload';
    },
    parseResponse(response) {
      let tokens = response.split(" ");

      tokens = tokens.map(element => element.replace(", ", "").trim()).filter(element => element !== "");

      console.log(tokens);
      return tokens;
    }
  }
}
</script>

<style scoped>
/* Add any additional styling here */
.outfit-outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600; /* Adjust the font weight as needed */
  font-style: normal;
}

#title {
  font-weight: 600;
}

.floating-card {
  animation: floatAnimation 3s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); /* Adjust duration as needed */
}

@keyframes floatAnimation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px); /* Adjust the amount of floating */
  }
}
</style>
