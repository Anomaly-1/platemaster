<template>
    <div class="flex justify-center items-center h-screen">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <!-- Card for displaying BMI -->
        <div class="bg-transparent text-white p-4 rounded-lg border border-white text-center">
          <h3 class="text-lg md:text-xl font-bold mb-2">BMI</h3>
          <p class="text-3xl md:text-4xl font-semibold">{{ bmi }}</p>
        </div>
  
        <!-- Card for displaying recommended calorie intake per day -->
        <div class="bg-transparent text-white p-4 rounded-lg border border-white text-center">
          <h3 class="text-lg md:text-xl font-bold mb-2">Recommended Calories</h3>
          <p class="text-3xl md:text-4xl font-semibold">{{ recommendedCalories }}</p>
        </div>
  
        <!-- Card for displaying approximate time estimated to reach goal -->
        <div class="bg-transparent text-white p-4 rounded-lg border border-white text-center">
          <h3 class="text-lg md:text-xl font-bold mb-2">Estimated Time to Reach Goal</h3>
          <p class="text-3xl md:text-4xl font-semibold">{{ timeToReachGoal }}</p>
        </div>
      </div>

      <!-- Card for calorie counter -->
      <div class="mt-8 bg-transparent text-white p-4 rounded-lg border border-white text-center">
        <h3 class="text-white text-lg md:text-xl font-bold mb-2">Calories Left for the Day</h3>
        <p class="text-white text-3xl md:text-4xl font-semibold">{{ caloriesLeft }}</p>
  
        <!-- Input field for users to input a value -->
        <form @submit.prevent="submitCalories">
          <input type="number" v-model="caloriesInput" class="bg-black w-20 h-10 text-white rounded-md p-2 mt-4 border border-white">
          <button type="submit" class="text-white bg-black hover:bg-gray-800 font-bold py-2 px-4 rounded mt-4 ml-4 border border-white">Deduct</button>
          <button @click="resetCalories" class="text-white bg-black hover:bg-gray-800 font-bold py-2 px-4 rounded mt-4 ml-4 border border-white">Reset</button>
        </form>
      </div>
    </div>
    <Sidebar/>
</template>
  
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
        const bmi = ref(0);
        const recommendedCalories = ref(0);
        const timeToReachGoal = ref('');
        const caloriesInput = ref('');
        const caloriesLeft = ref(0);
  
      onMounted(async () => {
        await fetchUserData();
      });
      
    
      async function fetchUserData() {
        try {
          // Fetch user data and calculate BMI
          const supabase = useSupabaseClient();
          const { data: { user } } = await supabase.auth.getUser()
          const { data: userData, error } = await supabase
            .from('user_responses')
            .select('*')
            .eq('email', user.email);
          if (error) {
            throw error;
          }

          calculateBMI(userData[0].weight_kgs, userData[0].height_cm)
          // Calculate recommended calorie intake per day
          const reccalories = calculateRecommendedCalories(userData[0].sex, userData[0].age, userData[0].weight_kgs, userData[0].height_cm, userData[0].lifestyle, userData[0].mass_change_preference)
          caloriesLeft.value = reccalories
          // Calculate approximate time to reach goal
          calculateTimeToReachGoal(userData[0].weight_kgs, userData[0].goal_weight, userData[0].mass_change_preference, reccalories)
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
  
      function calculateBMI(weightKg, heightCm) {
        // Convert height from cm to meters
        const heightM = heightCm / 100;
        // Calculate BMI
        bmi.value = (weightKg / (heightM * heightM)).toFixed(2);
      }
  
      function calculateRecommendedCalories(sex, age, weight, height, lifestyle, changepref) {

        let bmr;
        if (sex === "Male") {
            bmr = 66 + (6.23 * (weight * 2.20462)) + (12.7 * ((height / 1.00000054) * 0.393701)) - (6.8 * age)
        } else if (sex === "Female") {
            bmr = 655 + (4.3 * (weight * 2.20462)) + (4.7 * ((height / 1.00000054) * 0.393701)) - (4.7 * age)
        }

        let tdemultiplier;
        if (lifestyle === "No Exercise") {
            tdemultiplier = 1.2;
        } else if (lifestyle === "Light Exercise (1-3 days/week)") {
            tdemultiplier = 1.375;
        } else if (lifestyle === "Moderate Exercise (3-5 days/week)") {
            tdemultiplier = 1.55
        } else if (lifestyle === "Heavy Exercise (6-7 days/week)") {
            tdemultiplier = 1.725
        } else if (lifestyle === "Strenuous Training (2 or more times a day)") {
            tdemultiplier = 1.9;
        }

        const calories_needed = tdemultiplier * bmr

        const percentages = [0.75, 0.8, 0.88, 1, 1.12, 1.2, 1.25]
        const val = ['Extreme Cut', 'Moderate Cut', 'Mild Cut', 'Maintain', 'Mild Bulk', 'Moderate Bulk', 'Extreme Bulk'].indexOf(changepref)

        recommendedCalories.value = (percentages[val] * calories_needed).toFixed(0)
        
        return recommendedCalories.value
        }

  
      function calculateTimeToReachGoal(currentWeight, goalWeight, changepref, reccalories) {
        const percentages = [0.75, 0.8, 0.88, 1, 1.12, 1.2, 1.25]
        const val = ['Extreme Cut', 'Moderate Cut', 'Mild Cut', 'Maintain', 'Mild Bulk', 'Moderate Bulk', 'Extreme Bulk'].indexOf(changepref)

        const goaldiff = Math.abs(currentWeight-goalWeight)

        const weeks = goaldiff / (((reccalories - (reccalories / percentages[val]))*7) / 500)

        if (weeks === NaN) {
            weeks = 0
        }

        timeToReachGoal.value = weeks.toFixed(0) + ' weeks';
      }
  
      function submitCalories() {
        if (!caloriesInput.value) return;
        const calories = parseInt(caloriesInput.value);
        if (!isNaN(calories)) {
            // Subtract the input calories from caloriesLeft
            caloriesLeft.value -= calories;
            // Clear the input field
            caloriesInput.value = '';
        }
        }

        function resetCalories() {
            caloriesLeft.value = recommendedCalories.value;
        }

        return { bmi, recommendedCalories, timeToReachGoal, caloriesLeft, caloriesInput, submitCalories, fetchUserData };
    }
  };
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>
  