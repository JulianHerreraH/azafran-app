<template>
<v-row>
  <v-dialog 
    v-model="show" 
    max-width="75%"
    persistent
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <v-card class="px-3" shaped outlined>
      <v-card-title class="justify-center">
          <v-row align="center">
            <v-col cols="0">
              <h1 class="indigo--text text-h5 text-sm-h3" >{{detailDish.title}}</h1>
            </v-col>
            <v-col cols="2" class="text-right">
              <v-btn 
                icon 
                large 
                @click="closeDialog"
                color="indigo"
              > <v-icon>close</v-icon>
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
        contain
        dark
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
              color="indigo" 
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
        <v-btn 
          color="info" 
          large  
          dark 
          class="my-2 mx-2"
          @click.stop="editDish()"
        >Editar</v-btn>
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

  </v-dialog>
  <dish-edit :dish="detailDish" :showEdit="showEdit"></dish-edit>
</v-row>
</template>

<script>
import {bus} from '../main'
import {db, storage} from '../firebase/fb'
import DishEdit from "@/components/DishEdit";

export default {
  components: {
    'dish-edit': DishEdit,
  },
  data() {
    return {
      loading: false,
      defaultImage: require('../assets/no_image.jpg'),
      levels:{
        easy: 'fácil',
        medium: 'media',
        hard: 'difícil'
      },
      showEdit: false,
      detailDish: {},
      confirmDelete: false
    }
  },

  props: {
    dish: {
      type: Object,
      required: true,
    },
    show: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    link() {
      return this.dish.link == '' ? 'Platillo sin link' : `Link:` 
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
      return this.dish.imageURL || this.defaultImage
    },
  },

  methods: {
    closeDialog() {
      bus.$emit('showDetail', false)
    },
    editDish() {
      this.showEdit = true
    },
    deleteDish() {
      this.loading = true

      let ref = storage.refFromURL(this.detailDish.imageURL)
      ref.delete().then(() => {
        db.collection('Dishes').doc(this.detailDish.id).delete().then(() => {
          bus.$emit('showDetail', false)
          this.loading = false
          let snackbar = {
            isVisible: true,
            color: 'info',
            text: '¡Platillo eliminado exitosamente!'
          }
          bus.$emit('snackbar', snackbar)
        })
      }).catch((error) => {
        let snackbar = {
          isVisible: true,
          color: 'error',
          text: 'Error eliminando platillo :('
        }
        bus.$emit('snackbar', snackbar)
        console.log("Error uploading image", error)
      })

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
      const diff = this.dish.difficulty.toLowerCase()
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
    this.detailDish = Object.assign({}, this.dish)

    bus.$on('showEdit', (data) => {
      this.showEdit = data
    })
    bus.$on('dishUpdated', (data) => {
      this.detailDish = data
    })
  }



}
</script>

<style scoped>

.outline {
  border: 3px solid#E8EAF6;
  border-radius: 5px;
}

</style>

