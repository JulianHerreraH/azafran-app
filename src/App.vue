<template>
  <v-app dark >
    <app-navbar />
    <v-main >
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "App",

  components: {
    'app-navbar': Navbar,

  },

  data: () => ({
    //
  })
}
</script>

<style >
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;400;500;700;900&display=swap');

  .v-application {
    font-family: 'Poppins', sans-serif !important;
  }

  .v-application .title {
    font-family: 'Roboto Slab', serif !important;
  }
</style>
