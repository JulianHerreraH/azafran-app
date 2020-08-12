<template>
  <v-container fluid class="my-2 my-sm-4"> 
    <v-row align="center" class="mb-2"> 
      <v-col cols="8" md="10" class="deep-purple--text text--darken-2 text-left">
        <div class="text-h4 text-sm-h3">Descubrir</div>
      </v-col>
      <v-col cols="4" md="2" class="text-left deep-purple--text">
        Recetas por <b class="green--text"> EDAMAM </b> 
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-btn-toggle v-model="toggle" color="deep-purple accent-3">
        <v-btn @click="getRecipes('mexicana')">
          Mexicana
        </v-btn>
        <v-btn @click="getRecipes('saludable')">
          Saludable
        </v-btn>
        <v-btn @click="getRecipes('vegetariano')">
          Vegetariano
        </v-btn>
      </v-btn-toggle>
    </v-row>
      <h3 
        v-if="toggle == null"
        class="pa-3 deep-purple--text"
      >Selecciona un tipo de receta para empezar</h3>

    <v-row align="center" v-else>
        <v-col 
          cols="12" 
          sm="4"
          v-for="(item, ndx) in recipes"
          :key="ndx" 
        >
          <v-card
            height="450px"
            class="overflow-y-auto"
          >
          <v-card-title class="deep-purple--text text--darken-4">{{item.recipe.label | truncate(35) }}</v-card-title>
          <v-card-subtitle>{{item.recipe.source}}</v-card-subtitle>
          <v-img
            class="mx-auto white-bg"
            :src="item.recipe.image"
            :lazy-src="defaultImage"
            cover
            max-width="80%"
            :aspect-ratio="1.65/1"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular 
                  indeterminate 
                  color="deep-purple" 
                  size="48"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>

            <v-card-text class="mt-0" >
              <v-row>
                <v-col cols="6">
                  <v-icon>whatshot</v-icon>
                  {{item.recipe.calories.toFixed()}} kcal
                </v-col>
                <v-col cols="6">
                  <v-icon>local_dining</v-icon>
                  {{item.recipe.yield}}
                </v-col>
              </v-row>
             <span class="deep-purple--text text--darken-4 font-weight-bold">Ingredientes</span>
          
              <p class="py-0 my-0" v-for="(ing,ndx) in item.recipe.ingredients" :key="ndx">
                {{ing.text | truncate(45)}} 
              </p>
          
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="deep-purple accent-4"
              >
              <a :href="item.recipe.url">Ver Original</a>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
    
    </v-row>

  </v-container>
</template>

<script>
export default {

  data() {
    return {
      toggle: null,
      defaultImage: require('../assets/no_image.jpg')
    }
  },

  computed: {
    recipes() {
      return this.$store.state.recipes;
    },
  },

  filters: {
    truncate(text, stop, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    }
  },

  methods: {
    getRecipes(query) {
      // SHow only on button select
      if(this.toggle == null || this.toggle == undefined)
        this.$store.dispatch('getRecipes', query)
    },
    showMe(met) {
      console.log(met)
    }
  }


}
</script>

<style>
</style>