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
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Loopple/loopple-public-assets@main/motion-tailwind/motion-tailwind.css">
    </head>
    <body class="bg-white rounded-lg py-5"> 
    <!-- <ThemeToggle/>    -->
    <div class="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5 h-screen">
        <div class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
            <div class="flex items-center justify-center w-full lg:p-12">
                <div class="flex items-center xl:p-10">
                    <form class="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl" @submit.prevent="login">
                    <h3 class="mb-3 text-4xl font-extrabold text-dark-grey-900">Login</h3>
                    <p class="mb-4 text-grey-700">Enter your email and password</p>
                    <label for="email" class="mb-2 text-sm text-start text-grey-900">Email*</label>
                    <input id="email" name="email" required v-model="email" type="email" placeholder="example@abc.com" class="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
                    <label for="password" class="mb-2 text-sm text-start text-grey-900">Password*</label>
                    <input id="password" name="password" required v-model="password" type="password" placeholder="Enter a password" class="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
                    <div class="flex flex-row justify-between mb-8">
                    </div>
                    <button class="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500" type="submit">Login</button>
                    <p class="text-sm leading-relaxed text-grey-900" id="err"></p>
                    <p class="text-sm leading-relaxed text-grey-900" onclick="navigateTo('/clickup')">Not registered yet? <a href="/register" class="font-bold text-grey-700">Create an Account</a></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </body>
</template>
