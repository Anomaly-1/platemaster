<script setup>
const supabase = useSupabaseClient();
const email = ref("");
const password = ref(null);

async function login() {
    try {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });
        if (error) throw error
        navigateTo("/clickup");
    } catch (error) {
        document.getElementById("err").innerHTML = "Error: " + error.message;
    }
}
</script>

<template>
    <body class="bg-black rounded-lg py-5"> 
      <div class="container flex flex-col mx-auto bg-black rounded-lg pt-12 my-5 h-screen">
        <div class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div class="flex items-center justify-center w-full lg:p-12">
            <div class="max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-black border border-gray-600 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 register-card relative">
              <div class="flex items-center xl:p-10">
                <form class="flex flex-col w-full h-full pb-6 text-center bg-black rounded-3xl" @submit.prevent="login">
                  <h3 class="mb-3 text-3xl font-extrabold text-white">Login</h3>
                  <p class="mb-4 text-gray-400">Enter your email and password</p>
                  <label for="email" class="mb-2 text-sm text-start text-white">Email*</label>
                  <input id="email" name="email" required v-model="email" type="email" placeholder="example@abc.com" class="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-gray-600 mb-5 placeholder:text-gray-400 bg-gray-800 text-white rounded-lg"/>
                  <label for="password" class="mb-2 text-sm text-start text-white">Password*</label>
                  <input id="password" name="password" required v-model="password" type="password" placeholder="••••••" class="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-gray-600 placeholder:text-gray-400 bg-gray-800 text-white rounded-lg"/>
                  <button class="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-purple-100 bg-gray-900" type="submit">Login</button>
                  <p class="text-sm leading-relaxed text-white" id="err"></p>
                  <p class="text-sm leading-relaxed text-white" onclick="navigateTo('/register')">Not registered yet? <a href="/register" class="font-bold text-gray-400">Create an Account</a></p>
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
        transition: box-shadow 0.7s ease;
    }
    
    .register-card:hover {
        box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.4);
    }

    #password {
    margin-bottom: 3rem; 
    }
</style>
  