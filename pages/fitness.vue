<template>
  <div class="flex justify-center items-center h-screen">
    <div class="m-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
        const supabase = useSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Check if there's an entry corresponding to the user's email in the userfitness table
        const { data: userFitnessData, error: fitnessError } = await supabase
          .from('userfitness')
          .select('*')
          .eq('useremail', user.email);

        if (fitnessError) {
          throw fitnessError;
        }

        if (userFitnessData.length > 0) {
          // If an entry exists, retrieve recommended calories, BMI, and goal time
          recommendedCalories.value = userFitnessData[0].recommended_calories;
          bmi.value = userFitnessData[0].bmi;
          timeToReachGoal.value = userFitnessData[0].goaltime;
        } else {
          // If no entry exists, calculate data and insert a new entry
          const userData = await calculateUserData(user.email);
          recommendedCalories.value = userData.recommended_calories;
          bmi.value = userData.bmi;
          timeToReachGoal.value = userData.goaltime;
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    }

    async function calculateUserData(userEmail) {
      // Fetch user data from the user_responses table
      const supabase = useSupabaseClient();
      const { data: userData, error: dataError } = await supabase
        .from('user_responses')
        .select('*')
        .eq('email', userEmail);

      if (dataError) {
        throw dataError;
      }

      // Calculate BMI, recommended calories, and goal time
      const bmiValue = calculateBMI(userData[0].weight, userData[0].height);
      const recommendedCaloriesValue = calculateRecommendedCalories(userData[0].sex, userData[0].age, userData[0].weight, userData[0].height, userData[0].lifestyle, userData[0].mass_change_preference);
      const timeToReachGoalValue = calculateTimeToReachGoal(userData[0].weight, userData[0].goal_weight, userData[0].mass_change_preference, recommendedCaloriesValue);

      console.log(bmiValue, recommendedCalories, timeToReachGoal);

      // Insert a new entry into the userfitness table
      await supabase
        .from('userfitness')
        .insert([{  
          useremail: userEmail, 
          recommended_calories: recommendedCaloriesValue, 
          bmi: bmiValue, 
          goaltime: timeToReachGoalValue 
        }]);

      return {
        recommended_calories: recommendedCaloriesValue,
        bmi: bmiValue,
        goaltime: timeToReachGoalValue
      };
    }

    function calculateBMI(weight, height) {
      // Calculate BMI
      const heightM = height * 0.0254;
      
      console.log(((weight/(0.99999918429)*(0.4535920000001679)) / (heightM * heightM)).toFixed(2))
      return ((weight/(0.99999918429)*(0.4535920000001679)) / (heightM * heightM)).toFixed(2);
    }

    function calculateRecommendedCalories(sex, age, weight, height, lifestyle, changepref) {

      let bmr;
      if (sex === "Male") {
          bmr = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
      } else if (sex === "Female") {
          bmr = 655 + (4.3 * weight) + (4.7 * height) - (4.7 * age)
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

        return (percentages[val] * calories_needed).toFixed(0)
      }


    function calculateTimeToReachGoal(currentWeight, goalWeight, changepref, reccalories) {
      const percentages = [0.75, 0.8, 0.88, 1, 1.12, 1.2, 1.25]
      const val = ['Extreme Cut', 'Moderate Cut', 'Mild Cut', 'Maintain', 'Mild Bulk', 'Moderate Bulk', 'Extreme Bulk'].indexOf(changepref)

      const goaldiff = Math.abs(currentWeight-goalWeight)

      const weeks = goaldiff / ((Math.abs(reccalories - (reccalories * percentages[val]))*7) / 3500)

      if (weeks === NaN) {
          weeks = 0
      }

      return weeks.toFixed(0) + ' weeks';
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

    return { bmi, recommendedCalories, timeToReachGoal, caloriesLeft, caloriesInput, submitCalories, fetchUserData };
  }
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
