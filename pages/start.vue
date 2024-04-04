<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="background h-screen w-screen relative overflow-hidden">
    <!-- Animated block-like background -->
    <div class="mx-auto absolute inset-0 max-w-full h-screen overflow-hidden bg-gradient-to-br from-[#030508] via-[#0f1a1c] to-[#080b12] p-8 text-white duration-800 ease-in transition-property-[#030508] transition-property-[#0f1a1c] transition-property-[#080b12]">
    </div>

    <!-- Main content -->
    <div class="container mx-auto px-4 py-8 z-10 relative">
      <OptionsForm
        v-if="currentQuestion !== null && currentQuestionType === 'options'"
        :question="questions[currentQuestion].question"
        :options="questions[currentQuestion].options"
        @option-selected="handleOptionSelected"
      />
      <SliderForm
        v-else-if="currentQuestion !== null && currentQuestionType === 'slider'"
        :question="questions[currentQuestion].question"
        :limit=questions[currentQuestion].limit
        @option-selected="handleOptionSelected"
      />
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      questions: [
        {
          question: 'What is your weight? (lbs)',
          type: 'slider',
          limit: '500' // Upper limit for weight
        },
        {
          question: 'How old are you?',
          type: 'slider',
          limit: '100' // Assuming maximum age to be 100
        },
        {
          question: 'What is your sex?',
          type: 'options',
          options: ['Male', 'Female']
        },
        {
          question: 'What is your height? (in)',
          type: 'slider',
          limit: '84' // Assuming maximum height to be 200 cm
        },
        {
          question: 'What is your goal weight?',
          type: 'slider',
          limit: '500' // Upper limit for goal weight
        },
        {
          question: 'How active is your lifestyle?',
          type: 'options',
          options: ["No Exercise", "Light Exercise (3-5 days/week)", "Moderate Exercise (3-5 days/week)", "Heavy Exercise (6-7 days/week)", "Strenuous Training (2 or more times a day)"]
        },
        {
          question: 'How extreme would you like to cut or gain mass?',
          type: 'options',
          options: ['Extreme Bulk', 'Moderate Bulk', 'Mild Bulk', 'Maintain', 'Mild Cut', 'Moderate Cut', 'Extreme Cut']
        }
      ],
      currentQuestion: 0,
      currentQuestionType: null,
      formData: []
    };
  },
  methods: {
    handleOptionSelected(option) {
      this.formData[this.currentQuestion] = option;
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.currentQuestionType = this.questions[this.currentQuestion].type;
      } else {
        this.insertDataIntoSupabase().then(() => {
          this.currentQuestion = null;
        }).catch(error => {
          console.error('Error inserting data into Supabase:', error.message);
        });
      }
    },
    async insertDataIntoSupabase() {
      const supabase = useSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Check if there are existing entries with the user's email
      const { data: existingData, error: existingError } = await supabase
        .from('user_responses')
        .select('*')
        .eq('email', user.email);

      if (existingError) {
        console.error('Error fetching existing data:', existingError.message);
        return;
      }

      // Delete existing entries if found
      if (existingData && existingData.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_responses')
          .delete()
          .eq('email', user.email);

        if (deleteError) {
          console.error('Error deleting existing data:', deleteError.message);
          return;
        }
      }

      // Extract form data
      const {
        weight,
        age,
        sex,
        height,
        goal_weight,
        activity_level,
        mass_change_preference
      } = this.formData;

      // Insert new data into Supabase table
      const { data, error } = await supabase
        .from('user_responses')
        .insert([
          {
            email: user.email,
            weight: this.formData[0],
            age: this.formData[1],
            sex: this.formData[2],
            height: this.formData[3],
            goal_weight: this.formData[4],
            lifestyle: this.formData[5],
            mass_change_preference: this.formData[6]
          }
        ]);

      if (error) {
        console.error('Error inserting data into Supabase:', error.message);
      } else {
        console.log('Success');
        navigateTo("/clickup");
        navigateTo("/clickup");
      }
    }

  },
  mounted() {
    // Ensure that currentQuestionType is set initially
    if (this.currentQuestion !== null) {
      this.currentQuestionType = this.questions[this.currentQuestion].type;
    }
  }
};
</script>


<style scoped>
/* Add any additional styles here */
.animated-background {
  width: 100%;
  height: 100%;
}

/* Your animated blobs styles */
/* Define your animated blobs using SVG, HTML, or other elements here */
</style>
