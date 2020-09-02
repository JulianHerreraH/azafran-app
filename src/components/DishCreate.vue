<template>
  <v-row justify="center" >
    <v-dialog 
      v-model="showDialog" 
      persistent  
      max-width="60%"
      class="px-sm-5" 
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <template v-slot:activator="{ on: dialog }">
        <v-tooltip left>
          <template v-slot:activator="{on: tooltip}">
          <v-btn 
            class="deep-purple accent-3 ma-2" 
            fab 
            dark 
            bottom 
            right 
            fixed 
            v-on="{...tooltip, ...dialog}"
          >
            <v-icon>add</v-icon>
          </v-btn>
          </template>
          <span> Agregar nuevo platillo</span>
        </v-tooltip>
      </template>
    
      <v-card>
          <v-card-title>
            <h1 class="text-h4 deep-purple--text ">Añadir platillo</h1>
          </v-card-title>
          <v-card-text>
            <v-form class="px-2" ref="form">

              <v-file-input
                label="Foto*"
                show-size 
                counter
                :rules="[rules.minLength]"
                accept="image/*"
                prepend-icon="mdi-camera"
                @change="filePicked"
              ></v-file-input>
         
              <v-row align="center">
                <v-col cols="12" sm="8">
                  <v-text-field 
                  label="Nombre de platillo*" 
                  required 
                  counter="35" 
                  v-model.lazy.trim="dish.title"
                  :rules="[rules.minLength, rules.maxLength]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-menu
                    ref="menuDate"
                    v-model="menuDate"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Fecha de cocinado"
                        readonly
                        v-bind="attrs"
                        :rules="[rules.minLength]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" 
                    no-title 
                    scrollable 
                    :first-day-of-week="0"
                    locale="es-MX">
                      <v-spacer></v-spacer>
                      <v-btn 
                        text 
                        color="primary" 
                        @click="menuDate = false"
                      >Cancel</v-btn>
                      <v-btn 
                        text 
                        color="primary"
                        @click="$refs.menuDate.save(date)"
                      >OK</v-btn>
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
                v-model="dish.description"
                :rules="[rules.minLength, rules.descriptionCounter]"
                label="Descripción*"
              ></v-textarea>

              <div 
                v-for="(field, index) in dish.ingredients" 
                :key="index" 
                class="py-1"
              >
                <v-text-field
                  label="Ingrediente*"
                  v-model.lazy.trim="dish.ingredients[index]"
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
                    v-model="dish.link"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="text-center">
                <h3 class="grey--text ">Calificación*:</h3>
                <v-rating
                  v-model="dish.rating"
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
                    v-model="dish.cuisine"
                    label="Cocina*"
                    placeholder="..."
                    required
                    :rules="[rules.minLength]"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="difficulties"
                    v-model="dish.difficulty"
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
            @click.stop="closeForm()"
            :disabled="loading"
            class="my-2 mx-2"
          >Cerrar</v-btn>
          <v-btn 
            color="deep-purple darken-1" 
            large  
            dark 
            class="my-2 mx-2"
            @click.stop="submit" 
            :loading="loading"
          >Guardar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menuDate: false,
      noRating: null,
      dish: {
        title: '',
        timestamp: null,
        ingredients: [''],
        link: '',
        cuisine: '',
        difficulty: '',
        rating: null,
        imageURL: null,
        user_id: null
      }, 
      imageFile: null,
      rules: {
        maxLength: value => (value && value.length <= 35) || 'Límite es 35 caracteres',
        minLength: value => !!value || 'Campo no puede estar vacío',
        descriptionCounter: value => (value && value.length <= 350) || 'Límite es 350 caracteres',
      },
    }
  },

  computed: {
    showDialog:  {
      get(){
        return this.$store.state.dialog
      },
      set(value){
        this.$store.commit('setDialog', value)
      }
    }, 
    loading() {
      return this.$store.state.loading
    },
    difficulties() { 
      return this.$store.state.difficulties
    },
    cuisines() {
      return this.$store.state.cuisines
    },
    
  },

  methods: {
    addIngredientField() {
      this.dish.ingredients.push('')
    },
    removeIngredientField(i) {
      if(this.dish.ingredients.length > 1 ) {
        this.dish.ingredients.splice(i,1)
      }
    },
    filePicked(file) {
      this.imageFile = file
    },
    submit() {
      if(this.$refs.form.validate()) {
        if (!this.dish.rating) {
          this.noRating = true
          return
        } 
        
        const nDate = new Date(this.date)
        const timestamp = nDate.getTime()
        this.dish.timestamp = timestamp

        if(this.dish.link == undefined) this.dish.link == ''
        
        this.$store.dispatch('createDish', {
          imageFile: this.imageFile,
          dish: this.dish
        })
      }
    },
    closeForm() {
      this.$refs.form.reset()
      this.$store.commit('setDialog', false)
    },
  },
  
  created() {
    this.$store.dispatch('getCategories')
  }
}
</script>

