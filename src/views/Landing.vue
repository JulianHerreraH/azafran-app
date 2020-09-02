<template>
  <span>
    <v-parallax
      dark
      class="full"
    >
    <v-row>
      <v-col cols="12" sm="6" class="text-center mt-2">
        <sign-up :show="form" ></sign-up> 
        <v-btn 
          class="info ma-2" 
          dark 
          rounded 
          @click="showForm('register')"
        >
          ¡Crea una cuenta ahora!
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6"  class="text-center">
        <login :show="form"></login>
        <v-btn class="success ma-2" dark rounded  @click="showForm('login')">
          ¡Inicia Sesión!
        </v-btn>
      </v-col>
    </v-row>
    
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <v-img max-width="300" :src="icon" class="mx-auto"></v-img>
            <h1 class="text-h3 text-sm-h1 font-weight-black mb-4 deep-purple--text ">Azafrán</h1>
          <h4 class="text-h5 text-sm-h2  deep-purple--text text--lighten-1">Tu diario personal de recetas</h4>
        </v-col>
      </v-row>
      
    </v-parallax>
  </span>
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
        defaultImage: require('../assets/no_image.jpg'),
        icon: require('../assets/flower.png'),
        form: ''
      }
    }, 

    computed: {
      show() {
        return !this.$store.getters.isAuthenticated
      }
    },

    methods: {
      changeForm(value) {
        this.form = value
      },
      showForm(value) {
        this.$store.commit('setDialog', true)
        this.form = value
      }
    },
}
</script>

<style scoped>
.full {
  height: 100vh!important;
  background-image: url('../assets/back.jpg');
  background-size: cover;
}
</style>