<template>
  <div class="relative">
    <input type="file" @change="uploadImage" id="imageInput" class="hidden" />
    <label for="imageInput" class="block sm:size-24 md:size-40 lg:size-60 bg-blue-950 rounded-md cursor-pointer">
      <div class="absolute inset-0 flex items-center justify-center text-white font-bold text-xl md:text-2xl">
        <p>Upload</p> 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </label>
  </div>
</template>

<script>
import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
  methods: {
    async uploadImage(event) {
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
    async run(genpart) {
      const genAI = new GoogleGenerativeAI(gemini);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const prompt = "Clearly and ONLY list ALL food ingredients in this image, every ingredient should have the first letter capitalized and should be only separated by a single space. It should only contain valid food ingredients.";

      const result = await model.generateContent([prompt, genpart]);
      const response = await result.response;
      const text = response.text();
      this.$emit('parsedData', this.parseResponse(text));
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
label {
  display: block;
  width: 80vw;
  max-width: 400px;
  height: 60vh; 
  max-height: 300px;
}
</style>