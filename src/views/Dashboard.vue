<template>

  <div class="dashboard pa-3">

  <v-container fluid fill-height class="my-2 my-sm-4"> 
    <v-row align="center" class="mb-2"> 
      <v-col cols="8" md="10" class="indigo--text text--darken-2 text-left">
        <div class="text-h3 d-none d-sm-block">Mis platillos</div>
        <h2 class="d-block d-sm-none ">Mis platillos</h2>
      </v-col>
      <v-col cols="4" md="2" class="text-right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
          <v-btn small color="indigo accent-3" @click="sortBy('date')" v-on="on">
            <v-icon small class="white--text">sort</v-icon>
            <span class="caption white--text d-none d-sm-flex">Por Fecha</span>
          </v-btn>
          </template>
          <span> Organizar por fecha</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <div 
    v-if="hasFiltered" 
    class="text-center text-h5"
    >
      {{filterText}} 
      <a 
      @click="resetDishes" 
      class="text-decoration-underline text-body-1"
      >Ver todos.</a>
    </div>
    <div 
    v-if="filteredDishes.length == 0" 
    @click="resetDishes" 
    class="blue--text text-center text-h4">
      {{searchInfo}} 
    </div>
    <transition-group v-else name="flip-list" tag="div" class="row" >
      <dish-card v-for="dish in filteredDishes" :dish="dish" :key="dish.id"> </dish-card>
    </transition-group>
  </v-container>

  <create-dish></create-dish>

  </div>

</template>

<script>
import DishCard from "@/components/DishCard";
import CreateDish from "@/components/CreateDish";
import {bus} from '../main'
import {db} from '../firebase/fb'

export default {
  name: "Home",
  components: {
    'dish-card': DishCard,
    'create-dish': CreateDish,
  },
  data() {
    return {
      dishes: [], 
      newDish: null,
      searchTerm: '',
      searchInfo:'',
      filterType: 'title',
      hasFiltered: false,
      filterText: ''
    }
  },

  methods: {
    sortBy() {
      this.dishes.sort((a,b) => {
        return a.timestamp - b.timestamp
      })
    },
    resetDishes() {
      this.filterType = 'title'
      this.searchTerm = ''
      this.hasFiltered = false
    }
  },

  computed: {
    filteredDishes() {
      const filter = this.dishes.filter(dish => {
        switch(this.filterType) {
          case 'title':
            return dish.title.toLowerCase().includes(this.searchTerm) 
          case 'cuisine':
            this.filterText = `Platillos de ${this.searchTerm}`
            return dish.cuisine.includes(this.searchTerm) 
          case 'difficulty':
            this.filterText = `Platillos con dificultad ${this.searchTerm}`
            return dish.difficulty.includes(this.searchTerm) 
        }
      })
      return filter
    }
  },

  created() {

    bus.$on('searched', (data) => {
      this.filterType = 'title'
      this.searchTerm = data
    })

    bus.$on('filterDishes', (data) => {
      this.hasFiltered = true
      this.filterType = data.type
      this.searchTerm = data.value
    })

    const collection = db.collection('Dishes').limit(4)
    collection.onSnapshot(res => {
      const changes = res.docChanges()
      
      changes.forEach(change => {
        if(change.type === 'added') {
          this.dishes.push({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
        if(change.type === 'removed') {
          this.dishes = this.dishes.filter(item => item.id != change.doc.id)
        }
      })
      
      console.log('Datos Cargados')
      this.searchInfo = 'Ningun platillo encontrado. Ver todos'

    }, (error) => {
      let snackbar = {
        isVisible: true,
        color: 'error',
        text: 'Error cargando datos'
      }
      bus.$emit('snackbar', snackbar)
      console.log("Error getting document:", error)
    })

  }
}
</script>

<style scoped>
  .flip-list-move {
    transition: transform 1s;
  }
</style>