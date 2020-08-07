<template>
    <v-dialog 
      v-model="showEdit" 
      persistent  
      max-width="60%"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >   
    <v-card>
                <h1> {{dateC}} {{this.editedDish.timestamp}}</h1>
      <v-card-title>
      <h1 class="text-h4 indigo--text ">Editar platillo</h1>
      </v-card-title>
      <v-card-text>
      <v-form class="px-2" ref="editForm">
        <v-row align="center">
          <v-col cols="12" sm="8">
              <v-text-field 
              label="Nombre de platillo*" 
              required 
              counter="35"
              v-model.lazy.trim="editedDish.title"
              :rules="[rules.minLength, rules.maxLength]"
              >
              </v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-menu
              ref="menuDate"
              v-model="menuDate"
              :close-on-content-click="false"
              :return-value.sync="dateC"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >

            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                v-model="dateC"
                label="Fecha de cocinado"
                readonly
                v-bind="attrs"
                v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker 
              v-model="dateC" 
              no-title 
              scrollable 
              :first-day-of-week="0"
              locale="es-MX"
            >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menuDate = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menuDate.save(dateC)">OK</v-btn>
            </v-date-picker>
            </v-menu>
          </v-col>
          </v-row>

          <v-textarea
            outlined
            clearable
            no-resize
            counter="350"
            required
            v-model="editedDish.description"
            :rules="[rules.minLength, rules.descriptionCounter]"
            label="Descripción*"
          ></v-textarea>

          <div 
          v-for="(ing, index) in dish.ingredients" 
          :key="index" 
          class="py-1"
          >
          <v-text-field
            label="Ingrediente*"
            v-model.lazy.trim="editedDish.ingredients[index]"
            required
            dense
            :rules="[rules.minLength]"
          >
            <template v-slot:append-outer v-if="index == 0">
            <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                <v-btn 
                    icon 
                    color="green" 
                    @click="addIngredientField" 
                    v-on="on" 
                    v-bind="attrs"
                >
                    <v-icon center>add_circle_outline</v-icon>
                </v-btn>
                </template>
                Agregar Ingrediente
            </v-tooltip>
            </template>

            <template v-slot:append-outer v-else>
            <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="red" @click="removeIngredientField(index)" v-on="on" v-bind="attrs">
                    <v-icon center>remove_circle_outline</v-icon>
                </v-btn>
                </template>
                Eliminar Ingrediente
            </v-tooltip>
            </template>
          </v-text-field>
          </div>
          
          <v-row align="center" class="">
          <v-col cols="12" sm="8">
              <v-text-field 
              label="Link receta (opcional)" 
              v-model.lazy.trim="editedDish.link"
              ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="text-center">
          <h3 class="grey--text ">Calificación*:</h3>
          <v-rating
            v-model="editedDish.rating"
            color="amber"
            background-color="orange lighen-3"
            hover
          ></v-rating>
          <small class="red--text text-caption" v-if="noRating">¡Ingresa una calificación!</small>
          </v-col>
          </v-row>

          <v-row>
          <v-col cols="12" sm="6">
              <v-autocomplete
              :items="cuisines"
              v-model="editedDish.cuisine"
              label="Cocina*"
              placeholder="..."
              required
              :rules="[rules.minLength]"
              ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
              <v-select
              :items="difficulties"
              v-model="editedDish.difficulty"
              label="Dificultad"
              :rules="[rules.minLength]"
              required
              ></v-select>
          </v-col>
          </v-row>
      </v-form>
      <small>*Campo obligatiorio</small>
      </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="red darken-1" 
          large  
          dark 
          :disabled="loading"
          @click.stop="closeEdit"
          class="my-2 mx-2"
        >
        Cancelar</v-btn>
        <v-btn 
          color="indigo darken-1" 
          large  
          dark 
          class="my-2 mx-2"
          @click.stop="submit" 
          :loading="loading"
        >Actualizar</v-btn>
        <v-spacer></v-spacer>
    </v-card-actions>
    </v-card>

    </v-dialog>

</template>

<script>
import {db} from '../firebase/fb'
import {bus} from '../main'

export default {

  data() {
    return {
      difficulties: [],
      cuisines: [],
      date: new Date().toISOString().substr(0, 10),
      menuDate: false,
      loading: false,
      noRating: null,
      rules: {
        maxLength: value => (value && value.length <= 35) || 'Límite es 35 caracteres',
        minLength: value => !!value || 'Campo no puede estar vacío',
        descriptionCounter: value => (value && value.length <= 350) || 'Límite es 350 caracteres',
      },
      editedDish: {} 
    }
  },

  props: {
    dish: {
      type: Object,
      required: true,
    },
    showEdit: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    dateC: {
      get() {
        return new Date(this.editedDish.timestamp).toISOString().substring(0,10)
      },
      set(newDate) {
        const nDate = new Date(newDate)
        const timestamp = nDate.getTime()
        this.editedDish.timestamp = timestamp
      }
    }
  },

  methods: {
    addIngredientField() {
      this.editedDish.ingredients.push('')
    },
    removeIngredientField(i) {
      if(this.dish.ingredients.length > 1 ) {
        this.editedDish.ingredients.splice(i,1)
      }
    },
    submit() {

      if(this.$refs.editForm.validate()) {
        if (!this.dish.rating) {
          this.noRating = true
          return
        } 
        
        this.loading = true

        db.collection('Dishes').doc(this.editedDish.id).update(this.editedDish).then(() => {
          bus.$emit('showEdit', false)
          bus.$emit('dishUpdated', this.editedDish)
          this.loading = false
          let snackbar = {
            isVisible: true,
            color: 'success',
            text: '¡Platillo editado exitosamente!'
          }
          bus.$emit('snackbar', snackbar)
        }).catch((error) => {
            let snackbar = {
              isVisible: true,
              color: 'error',
              text: 'Error editando platillo :('
            }
            bus.$emit('snackbar', snackbar)
            console.log("Error getting document:", error)
        })
      }
      
    },
    closeEdit() {
      bus.$emit('showEdit', false)
    }

  },
  
  created() {

    this.editedDish = Object.assign({}, this.dish)

    const diffRef = db.collection('Difficulty')
    diffRef.orderBy('num', 'asc').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
          this.difficulties.push(doc.data().value)
      })
    }).catch(error => {
      this.snackbar.isVisible = true
      this.snackbar.text = 'Error cargando datos de dificultad'
      this.snackbar.color = 'error'
      console.log("Error getting document:", error)
    })

    const cuisineRef = db.collection('Cuisines')
    cuisineRef.orderBy('name', 'asc').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
          this.cuisines.push(doc.data().name)
      })
    }).catch(error => {
      this.snackbar.isVisible = true
      this.snackbar.text = 'Error cargando datos de cocinas'
      this.snackbar.color = 'error'
      console.log("Error getting document:", error)
    })
  }

}
</script>

