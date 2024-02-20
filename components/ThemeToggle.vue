<script setup>
import {useDark, useToggle} from "@vueuse/core"
const isDark = useDark();
const toggleDark = useToggle(isDark);

function toggleTheme() {
    try {
        const icon = document.getElementById("icon");

        const moon = "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z";
        const sun = "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z";

        if (icon.getAttribute("d") == sun) {
            icon.setAttribute("d", moon);
        } else if (icon.getAttribute("d") == moon) {
            icon.setAttribute("d", sun);
        }
        toggleDark();    
    } catch (error) {
        console.log(error.message);
    }
}

</script>

<template>
    <div class="absolute top-0 right-1 w-18 h-14 m-10 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <button @click="toggleTheme()" class="w-12 h-10" fill="white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#3480eb" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-12 h-12">
                <path id="icon" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
        </button>
    </div>
</template>