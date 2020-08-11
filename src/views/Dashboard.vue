<template>
  <div class="dashboard pa-3">
    <v-container fluid fill-height class="my-2 my-sm-4"> 
      <v-row align="center" class="mb-2"> 
        <v-col cols="8" md="10" class="deep-purple--text text--darken-2 text-left">
          <div class="text-h3 d-none d-sm-block">Mis platillos</div>
          <h2 class="d-block d-sm-none">Mis platillos</h2>
        </v-col>
        <v-col cols="4" md="2" class="text-right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
            <v-btn small color="deep-purple accent-3" @click="sortBy('date')" v-on="on">
              <v-icon small class="white--text">sort</v-icon>
              <span class="caption white--text d-none d-sm-flex">Por Fecha</span>
            </v-btn>
            </template>
            <span> Organizar por fecha</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <div 
        v-if="filter.query != '' " 
        class="text-center text-h5"
      >
        Resultados de tu filtrado
        <a 
          @click="resetDishes" 
          class="text-decoration-underline text-body-1"
        >Ver todos.</a>
      </div>
      <transition-group name="flip-list" tag="div" class="row">
        <dish-card v-for="dish in filteredDishes(dishes)" :dish="dish" :key="dish.id"> </dish-card>
      </transition-group>
    </v-container>
    <dish-create></dish-create>
  </div>
</template>

<script>
import DishCard from "@/components/DishCard";
import DishCreate from "@/components/DishCreate";


export default {
  name: "Home",
  components: {
    'dish-card': DishCard,
    'dish-create': DishCreate,
  },
  data() {
    return {
      searchTerm: '',
      filterType: 'title',
      hasFiltered: false,
      filterText: '',
    }
  },

  methods: {
    sortBy() {
      this.dishes.sort((a,b) => {
        return a.timestamp - b.timestamp
      })
    },
    resetDishes() {
      this.filterText = ''
      this.$store.commit('setFilter', {type: 'title', query: ''})
    },
    showDialog(value) {
      this.canShow = value
    },

    filteredDishes(dishes) {
      const filter = this.$store.state.filter
      const arrFiltered = dishes.filter(dish => {
        switch(filter.type) {
          case 'title':
            return dish.title.toLowerCase().includes(filter.query) 
          case 'cuisine':
            return dish.cuisine.includes(filter.query) 
          case 'difficulty':
            return dish.difficulty.includes(filter.query) 
        }
      })
      return arrFiltered
    },
  },

  computed: {

    loading() {
      return this.$store.state.loading
    },
    filter() {
      return this.$store.state.filter
    },
    dishes() {
      let dishes = this.$store.state.dishes
      return dishes
    },
  },

  created() {
    // Call Firebase listener for the first time
    if(this.$store.state.listenerActive == null) {
      console.log('getDishes first time dashboard')
      this.$store.dispatch('getDishes')
    }
  }

}
</script>

<style scoped>
  .flip-list-move {
    transition: transform 1s;
  }
</style>