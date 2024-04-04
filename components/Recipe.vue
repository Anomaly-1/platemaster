<template>
  <div class="max-w-screen-xl mx-auto flex">
    <div class="bg-black dark:bg-white shadow-md border-2 border-white dark:border-black p-6 mr-4 flex-grow overflow-x-hidden overflow-y-auto">
      <h1 class="text-4xl font-bold mb-4 text-white dark:text-black">Recipe</h1>
      <div v-if="isLoading" class="text-gray-400 dark:text-gray-600">Loading...</div>
      <div v-else-if="response">
        <div class="markdown-content" v-html="renderedMarkdown"></div>
      </div>
      <div v-else class="text-gray-400 dark:text-gray-600">No recipe found.</div>
      <button v-if="response && !recipeSaved"
              @click="saveRecipe()"
              class="text-white border border-white hover:border-black hover:bg-white hover:text-black font-bold py-1 px-4 rounded-full inline-block transition duration-300 ease-in-out">
        Save Recipe
      </button>
    </div>
    <div class="flex-grow overflow-x-hidden overflow-y-auto">
      <NutritionLabel :item="items"/>
    </div>
  </div>
</template>



<script>
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

export default {
  props: {
    items: {
      type: Array,
      required: true,
      items: {},
    }
  },
  data() {
    return {
      response: null,
      isLoading: false,
      recipeSaved: false
    };
  },
  computed: {
    renderedMarkdown() {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            breaks: true,
            smartLists: true,
            smartypants: true,
            math: true,
        });
        return marked.parse(this.response);
    },
    formattedResponse() {
      return this.response.replace(/\n/g, "<br>");
    }
  },
  methods: {
    async saveRecipe() {
      try {
        const appId = edamamingid;
        const appKey = edamamingkey;
        const apiUrl = `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`;
        const recipeText = this.response;
        const supabase = useSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser()

        let recipeData = this.parseRecipe(recipeText)

        for (let i = 0; i < recipeData[1].length; i++) {
          recipeData[1][i] = recipeData[1][i].replace("- ", "")

          if (recipeData[1][i] == "") {
            recipeData[1].pop(i)
          }
        }

        recipeData[1].pop(0)

        recipeData[0] = recipeData[0].trim()

        let steps = ""

        for (let i = 0; i < recipeData[2].length; i++) {
          steps += recipeData[2][i] + " "
        }

        recipeData[2] = steps

        const { data, error } = await supabase.from('recipes').insert([
          { username: user.email, recipe_text: recipeText }
        ]);

        if (error) {
          throw error;
        }

        console.log('Recipe saved successfully!');
        this.recipeSaved = true; // Update recipeSaved flag

        const recdata = {
          title: recipeData[0],
          ingr: recipeData[1],
          url: "", // Add your recipe URL here
          summary: "",
          yield: "1",
          time: "",
          img: "", // Add your recipe image URL here
          prep: recipeData[2]
        };

        console.log(recdata)

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'  
          },
          body: JSON.stringify(recdata)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        // Create the item object using data from the API response
        this.items = {
          name: "Mystery", // Set the name to the input text
          serving: 1, // Assuming serving size is 1
          servingPerContainer: 0, // Assuming no servings per container
          servingUnitName: 'serving', // Assuming serving unit is 'serving'
          ingredientStatement: "", // Set the ingredient statement to the input text
          calories: responseData.calories,
          totalFat: Math.round(responseData.totalNutrients.FAMS.quantity + responseData.totalNutrients.FAPU.quantity + responseData.totalNutrients.FATRN.quantity + responseData.totalNutrients.FASAT.quantity),
          saturatedFat: Math.round(responseData.totalNutrients.FASAT.quantity),
          transFat: Math.round(responseData.totalNutrients.FATRN.quantity),
          polyunsaturatedFat: Math.round(responseData.totalNutrients.FAPU.quantity),
          monounsaturatedFat: Math.round(responseData.totalNutrients.FAMS.quantity),
          cholesterol: Math.round(responseData.totalNutrients.CHOLE.quantity),
          sodium: Math.round(responseData.totalNutrients.NA.quantity),
          fiber: Math.round(responseData.totalNutrients.FIBTG.quantity),
          sugars: Math.round(responseData.totalNutrients.SUGAR.quantity),
          protein: Math.round(responseData.totalNutrients.PROCNT.quantity),
          vitaminA: Math.round(responseData.totalNutrients.VITA_RAE.quantity),
          vitaminC: Math.round(responseData.totalNutrients.VITC.quantity),
          calcium: Math.round(responseData.totalNutrients.CA.quantity),
          iron: Math.round(responseData.totalNutrients.FE.quantity),
          potassium: Math.round(responseData.totalNutrients.K.quantity),
          vitaminD: Math.round(responseData.totalNutrients.VITD.quantity),
        };
      } catch (error) {
        console.error('Error saving recipe:', error.message);
      }
    },
    parseRecipe(recipeString) {
        const lines = recipeString.split('\n');

        // Extract title
        const title = lines[0].trim().replace(/#/g, '');

        // Extract ingredients
        let ingredients = [];
        let ingredientsIndex = lines.findIndex(line => line.trim().toLowerCase() === '**ingredients**:');
        if (ingredientsIndex !== -1) {
            ingredients = lines.slice(ingredientsIndex + 1, lines.findIndex(line => line.trim().toLowerCase() === '**steps**:'));

            // Remove asterisks and trim each ingredient
            ingredients = ingredients.map(ingredient => ingredient.replace(/^\*\s*/, '').trim());
        }

        // Extract steps
        let steps = [];
        let stepsIndex = lines.findIndex(line => line.trim().toLowerCase() === '**steps**:');
        if (stepsIndex !== -1) {
            steps = lines.slice(stepsIndex + 1);

            // Remove step numbers and trim each step
            steps = steps.map(step => step.replace(/^\d+\.\s*/, '').trim());
        }

        return [title, ingredients, steps];
    },
    async sendToGeminiAPI(items) {
      this.isLoading = true;
      const genAI = new GoogleGenerativeAI(gemini);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = " Create an original ideal recipe using these ingredients (including portions) with numbered separated steps:" + items.join(" ") + "Your Response should be in aesthetic Markdown and contain THREE parts: 1. ## Title of the Recipe: (Provide a clear and descriptive title for your recipe.) 2. **Ingredients**: (List the ingredients with bullet points.) 3. **Steps**: (List the steps with numbered points.) Ensure to use Markdown syntax for proper formatting. Add a '\n' character anywhere there is a newline needed. ";

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        this.response = text;
      } catch (error) {
        console.error("Error fetching recipe:", error);
        this.response = "Error fetching recipe.";
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.sendToGeminiAPI(this.items);
  },
};
</script>

<style scoped>
/* Add any additional styles for the search bar here */
</style>
