<template>
  <v-container fluid fill-height v-if="detailDish">
    <v-card width="100%" class="mx-auto">
      <v-card-title class="justify-center">
          <v-row align="center">
            <v-col cols="7" sm="10">
              <h1 class="deep-purple--text text-h5 text-sm-h3" >{{detailDish.title}}</h1>
            </v-col>
            <v-col cols="5" sm="2" class="text-right">
              <v-btn 
                text
                large
                @click="$router.go(-1)"
                color="deep-purple"
              > Regresar
              </v-btn>
            </v-col>
          </v-row>
      </v-card-title>

      <v-card-subtitle>
        <v-row
        align="center"
        class="mx-0"
        >
          Cocinado el 
            {{formattedDate(detailDish.timestamp)}}
          <v-divider vertical class="mx-2"></v-divider>
          <v-rating
            v-model="detailDish.rating"
            color="amber"
            small
            background-color="orange lighen-3"
            readonly 
          ></v-rating>
        </v-row>
      </v-card-subtitle>

      <v-img
        class="mx-auto outline"
        :src="imageURL"
        :width="imgWidth"
        dark
        cover
        :aspect-ratio="16/9"
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

      <v-card-text class="py-2">
        <h3 class="text-justify text-h6">{{detailDish.description}}</h3>

        <v-row align="stretch">
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold">Ingredientes:</p> 
            <p 
              class="text-body-1 py-0 my-1"
              v-for="ing in detailDish.ingredients" 
              :key="ing"
            >{{ing}}</p>
          </v-col>
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold">Categorías: </p> 
            <v-chip 
              rounded  
              :color="getColor()" 
              class="mx-sm-1 mx-0 mb-2  " 
              dark
            >{{detailDish.cuisine}}</v-chip>
            <v-chip 
              rounded  
              :color="getDifficultyColor()" 
              class="mx-1 mb-2" 
              dark
            >{{detailDish.difficulty}}</v-chip>
            <p class="text-h6 font-weight-bold py-2">{{link}}
              <a 
                :href="detailDish.link" 
                v-if="detailDish.link != ''"
                target="blank"
              >
              Haz click para seguir</a>
            </p> 
          </v-col>
        </v-row>

      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <dish-edit :dish="detailDish"></dish-edit>
        <v-dialog v-model="confirmDelete" persistent max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="error"
              large
              dark
              class="my-2 mx-2"
              v-bind="attrs"
              v-on="on"
            >
              Eliminar
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">¿Seguro que deseas eliminar este platillo?</v-card-title>
            <v-card-text>Esta acción no podrá ser devuelta.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="info" text @click="confirmDelete = false" :loading="loading">Cancelar</v-btn>
              <v-btn color="error" text @click="deleteDish">Borrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import DishEdit from "@/components/DishEdit";

export default {
  components: {
    'dish-edit': DishEdit,
  },
  data() {
    return {
      defaultImage: require('../assets/no_image.jpg'),
      levels:{
        easy: 'fácil',
        medium: 'media',
        hard: 'difícil'
      },
      confirmDelete: false
    }
  },


  computed: {
    link() {
      return this.detailDish.link.trim() == '' ? 'Platillo sin link' : `Link:` 
    },
    imgWidth() {
      let width 
      if (this.$vuetify.breakpoint.smAndDown) {
        width = '100%'
      } else {
        width = '50%'
      }
      return width
    },
    imageURL() {
      return this.detailDish.imageURL || this.defaultImage
    },
    loading() {
      return this.$store.state.loading
    },
    detailDish() {
      let id = this.$route.params.id
      let dish = this.$store.getters.getDish(id)
      return dish
    }
  },

  methods: {
    deleteDish() {
      this.$store.dispatch('deleteDish', {dish: this.detailDish})
    },
    formattedDate(timestamp) {
      const dateISO = new Date(timestamp).toISOString().substring(0,10)
      return dateISO.split('-').reverse().join('-')
    },
    getColor() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    getDifficultyColor() {
      const diff = this.detailDish.difficulty.toLowerCase()
      switch(diff) {
        case this.levels.easy:
          return 'green'
        case this.levels.medium:
          return 'yellow'
        case this.levels.hard: 
          return 'red'
      }
    },
  },

  created() {
    // Call Firebase listener for the first time (page reload)
    if(this.$store.state.listenerActive == null) {
      console.log('getDishes first time dashboard')
      this.$store.dispatch('getDishes')
    }
  }

}
</script>

<style scoped>

.outline {
  border: 3px solid#E8EAF6;
  border-radius: 5px;
}

</style>

