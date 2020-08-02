<template>
  <div class="dashboard pa-3">
    <v-container fluid class="my-4"> 
      <v-row align="center">
        <v-col sm="10" md="8" class="indigo--text text--darken-2">
          <h1 class="display-2 d-none d-sm-flex">Mis platillos</h1>
          <h3 class="d-flex d-sm-none ">Mis platillos</h3>
        </v-col>

        <v-col sm="2" md="4" class="text-right">
          <v-btn small color="indigo accent-3" @click="sortBy('date')">
            <v-icon small class="white--text">sort</v-icon>
            <span class="caption white--text d-none d-sm-flex">Por Fecha</span>
          </v-btn>
        </v-col>
      </v-row>

     
        <transition-group name="flip-list" tag="div" class="row">
          
          <dish-card v-for="(dish) in dishes" :dish="dish" :key="dish.id"> </dish-card>

        </transition-group>
  

    </v-container>

    <v-btn fab class="indigo accent-3 ma-2" dark bottom right fixed>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import DishCard from "@/components/DishCard";

export default {
  name: "Home",
  components: {
    DishCard
  },
  data() {
    return {
      dishes: [
        { id:0, name: 'Pizza', date: '2020/07/01', ingredients: 'Tomates, Harina, Carne', rating:3 },
        { id:1, name: 'Arroz', date: '2020/06/28', ingredients: 'Perejil, Arroz, Pollo', rating:5 },
        { id:2, name: 'Pie', date: '2020/07/14', ingredients: 'Moras, Harina, Azucar', rating:4 },
      ]
      
    }
  },
  methods: {

    sortBy() {
      this.dishes.sort((a,b) => {
        let dateA = new Date(a.date)
        let dateB = new Date(b.date)
        return dateA - dateB
      })
    },


  }
};
</script>

<style scoped>
  .flip-list-move {
    transition: transform 1s;
  }
</style>