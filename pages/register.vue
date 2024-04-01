<script setup>
import { ref } from 'vue';

const supabase = useSupabaseClient();
const email = ref("");
const password = ref(null);
const confirmPassword = ref(null);
let isLoading = ref(false);

async function signUp() {
  if (password.value !== confirmPassword.value) {
    document.getElementById("Mg").innerHTML = "Error: Passwords do not match";
    return;
  }

  isLoading.value = true;
  try {
    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            data: {
                username: username.value
            }
        }
    });
    if (error) throw error;
    const {dta, err} = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });
    if (error) throw error
    navigateTo("/start");
  } catch (error) {
    document.getElementById("Mg").innerHTML = "Error: " + error.message;
  } finally {
    isLoading.value = false;
  }
}
</script>


<template>
    <body class="bg-black disable-scroll py-5">    
      <div class="container flex flex-col mx-auto bg-black rounded-lg pt-12 my-5 h-screen relative">
        <div class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable relative z-10">
          <div class="flex items-center justify-center w-full lg:p-12">
            <div class="max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-black border border-gray-600 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 register-card relative">
              <div class="flex items-center xl:p-10">
                <form class="flex flex-col w-full h-full pb-6 text-center bg-black rounded-3xl" @submit.prevent="signUp">
                  <h3 class="mb-3 text-3xl font-extrabold text-white">Register</h3>
                  <p class="mb-4 text-gray-400">Start your splendid journey of nutrition</p>
                  <label for="username" class="mb-2 text-sm text-start text-white">Username*</label>
                  <input id="username" v-model="username" name="username" required type="text" placeholder="Enter your username" class="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-600 mb-3 placeholder:text-gray-400 bg-gray-800 text-white rounded-lg"/>
                  <label for="email" class="mb-2 text-sm text-start text-white">Email*</label>
                  <input id="email" v-model="email" name="email" required type="email" placeholder="example@abc.com" class="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-600 mb-3 placeholder:text-gray-400 bg-gray-800 text-white rounded-lg"/>
                  <label for="password" class="mb-2 text-sm text-start text-white">Password*</label>
                  <input id="password" v-model="password" name="password" required type="password" placeholder="••••••" class="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-600 mb-3 placeholder:text-gray-400 bg-gray-800 text-white rounded-lg"/>
                  <label for="confirm-password" class="mb-2 text-sm text-start text-white">Confirm Password*</label>
                  <input id="confirm-password" v-model="confirmPassword" name="confirm-password" required type="password" placeholder="••••••" class="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-600 mb-5 placeholder:text-gray-400 bg-gray-800 text-white rounded-lg"/>
                  <button type="submit" :class="{'cursor-wait': isLoading}" class="relative w-full px-6 py-4 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-purple-100 bg-gray-900">
                    <span v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.55A10 10 0 002.55 12H4zm2 7.45A10 10 0 0012 21.45V20a8 8 0 01-8-8h1.45zM20 12a8 8 0 01-8 8v1.45A10 10 0 0021.45 12H20zm-1.45-9.95A10 10 0 0012 2.55V4a8 8 0 018 8h-1.45z"></path>
                      </svg>
                      Loading
                    </span>
                    <span v-else>Register</span>
                  </button>
                  <p class="text-sm leading-relaxed text-white"><a href="/login" class="font-bold text-gray-400">Already have an account?</a></p>
                  <p class="text-sm leading-relaxed text-white" id="Mg"></p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </template>


<style>
    .register-card {
        box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.2);
        transition: box-shadow 0.7s ease; /* Added transition property */
    }

    .register-card:hover {
        box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.4);
    }
</style>