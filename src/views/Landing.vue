<template>
  <v-container class="my-2">
      <h1 class="text-center text-h1 indigo--text">Bienvenido a Food Blog</h1>
      <h1 class="text-center text-h4 indigo--text text--lighten-3">Tu diario personal para recetas</h1>
      <v-row align="center" justify="center" class="my-5">
        <sign-up></sign-up> <login></login>
      </v-row>
      <v-row align="center" class="my-5">
          <v-col cols="8" class="text-h6">
            <ul>
                <li>Registra tus recetas</li>
                <li>Busca tus recetas</li>
                <li>Categoriza tus recetas</li>
            </ul>
          </v-col>
          <v-col cols="4">
            <v-img :src="defaultImage" ></v-img>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import SignUp from "@/components/auth/SignUp";
import Login from "@/components/auth/Login";

export default {
    name: 'Landing',

    components: {
      'sign-up': SignUp,
      'login': Login,
    },

    data() {
      return {
        defaultImage: require('../assets/no_image.jpg')
      }
    }
  
}
</script>

<style>

</style>