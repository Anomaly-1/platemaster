<script setup>
definePageMeta({
    middleware: ['auth']
});
</script>

<template>
    <div class="flex items-center justify-center h-screen">
      <div class="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-md">
        <!-- <div class="flex flex-col items-center justify-center mb-8"> -->
          <!-- <img :src="userAvatar" alt="User Avatar" class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"> -->
          <!-- <button @click="handleEditAvatar" class="mt-2 text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-600">
            Edit Avatar
          </button>
          <button @click="handleSaveAvatar" class="mt-2 text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-600">
            Save
          </button> -->
        <!-- </div> -->
        <div class="mb-8 text-lg text-gray-800 dark:text-gray-200">
          <h2 class="text-xl font-semibold mb-4">User Information</h2>
          <div class="mb-4">
            <p class="font-semibold">Email: {{ userEmail }}</p>
          </div>
          <div class="mb-4">
            <p class="font-semibold">Password: ********</p>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  </template>
  
<script>
export default {
  data() {
    return {
      userEmail: '',
      userAvatar: 'https://via.placeholder.com/200',
      avatarFile: null,
    };
  },
  async mounted() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const supabase = useSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        this.userEmail = user.email;
        
        const avatarURL = user.user_metadata?.avatar_url;
        if (avatarURL) {
          this.userAvatar = avatarURL;
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    },
    handleEditAvatar() {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.accept = 'image/*';
      inputElement.click();

      inputElement.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
          this.avatarFile = file;
          
          const reader = new FileReader();
          reader.onload = () => {
            this.userAvatar = reader.result;
          };
          reader.readAsDataURL(file);
        }
      }); 
    },
    async handleSaveAvatar() {
      try {
        const supabase = useSupabaseClient();
        if (this.avatarFile) {
          const { data, error } = await supabase.storage
            .from('images')
            .upload(`avatars/${this.userEmail}/${this.avatarFile.name}`, this.avatarFile);
          if (error) {
            throw error;
          }

          // Get the URL of the uploaded avatar
          const avatarURL = data.Location;

          // Save the avatar URL to user metadata
          const { error: updateError } = await supabase.auth.update({
            data: { user_metadata: { avatar_url: avatarURL } },
          });

          if (updateError) {
            throw updateError;
          }

          console.log('Avatar saved successfully:', avatarURL);
          this.avatarFile = null;
        }
      } catch (error) {
        console.error('Error saving avatar:', error.message);
      }
    }
  }
};
</script>
