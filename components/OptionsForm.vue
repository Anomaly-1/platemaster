<template>
  <div class="container mx-auto px-4 py-8">
    <div class="lg:w-1/2 mx-auto">
      <div class="rounded-lg p-6 mb-6 text-white">
        <h2 class="text-4xl lg:text-5xl font-semibold mb-6 lg:mb-8 text-center">{{ question }}</h2>
        <div class="flex flex-col items-center">
          <button
            v-for="(option, index) in options"
            :key="index"
            @click="selectOption(option)"
            class="bg-black border border-white border-solid hover:bg-white hover:text-black font-semibold py-4 lg:py-5 px-8 lg:px-10 rounded-lg m-2 transition duration-300 ease-in-out"
            :style="{ width: buttonWidth }"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      buttonWidth: '90%',
    };
  },
  methods: {
    selectOption(option) {
      // Emit an event with the selected option
      this.$emit('option-selected', option);
    },
    updateButtonWidth() {
      if (window.innerWidth < 768) {
        this.buttonWidth = '90%';
      } else {
        this.buttonWidth = '70%';
      }
    }
  },
  mounted() {
    this.updateButtonWidth();
    window.addEventListener('resize', this.updateButtonWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateButtonWidth);
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
