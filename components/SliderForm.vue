<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <label class="mt-10 sm:mt-20 block mb-4 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">{{ question }}</label>
    <input type="range" :min="0" :max="parseInt(limit)" v-model="sliderValue" class="block mt-4 w-3/4 sm:w-2/3 md:w-1/2 mb-4 appearance-none" @input="updateSliderValue">
    <div class="flex flex-col items-center">
      <div class="text-white text-3xl">{{ sliderCounter }}</div>
      <button @click="submitInput" class="border border-white bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition duration-300 ease-in-out">Continue</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: String,
    limit: String
  },
  data() {
    return {
      sliderValue: 0,
      sliderCounter: 0,
    };
  },
  methods: {
    updateSliderValue() {
      // Update slider value
      this.sliderCounter = this.sliderValue;
    },
    submitInput() {
      // Emit event with the slider value when the user clicks the button
      this.$emit('option-selected', this.sliderValue);
    }
  }
};
</script>

<style scoped>
/* Styling for the slider */
input[type="range"] {
  /* Track */
  --track-height: 10px;
  --track-color: #4CAF50; /* Set track color here */
  --track-border-radius: 5px;
  /* Thumb */
  --thumb-size: 20px;
  --thumb-color: #fff;
  --thumb-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  /* Progress */
  --progress-color: #4CAF50;
  /* Styles */
  -webkit-appearance: none;
  appearance: none;
  width: 80%;
  height: var(--track-height);
  background: linear-gradient(to right, var(--progress-color) 0%, var(--progress-color) calc((100% * var(--slider-value)) / var(--max)), var(--track-color) calc((100% * var(--slider-value)) / var(--max)), var(--track-color) 100%);
  background-size: 100% var(--track-height);
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  border-radius: var(--track-border-radius);
  outline: none;
  /* Thumb */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background: var(--thumb-color);
    border-radius: 50%;
    box-shadow: var(--thumb-shadow);
    border: none;
    cursor: pointer;
    margin-top: calc((var(--track-height) - var(--thumb-size)) / 2);
  }
  &::-moz-range-thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background: var(--thumb-color);
    border-radius: 50%;
    box-shadow: var(--thumb-shadow);
    border: none;
    cursor: pointer;
    margin-top: calc((var(--track-height) - var(--thumb-size)) / 2);
  }
}
</style>

