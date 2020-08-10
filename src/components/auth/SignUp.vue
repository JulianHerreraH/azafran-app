<template>
  <v-row
    align="center"
    justify="center"
    v-if="show == 'register'"
  >
    <v-dialog 
      max-width="45%" 
      persistent
      :fullscreen="$vuetify.breakpoint.smAndDown"
      v-model="showDialog"
    >
      <v-card shaped>
        <v-card-title class="text-center deep-purple--text text-h3">
          <v-spacer></v-spacer>
          Ingresa tus datos
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text class="my-4">
          <v-form ref="form">
            <v-text-field
              label="Correo Electronico*"
              prepend-icon="mdi-email"
              type="text"
              required
              v-model="userInfo.email"
              :rules="[rules.minLength, rules.email]"
            ></v-text-field>

            <v-text-field
              label="Contraseña*"
              prepend-icon="mdi-lock"
              type="password"
              autocomplete="off"
              hint="Debe ser de 6 o más caracteres"
              required
              counter
              v-model="userInfo.password"
              :rules="[rules.minLength]"
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Nombre*"
                  type="text"
                  counter="20"
                  required
                  prepend-icon="account_circle"
                  v-model="userInfo.name"
                  :rules="[rules.minLength, rules.maxLength]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Apellido*"
                  type="text"
                  counter="20"
                  required
                  v-model="userInfo.lastName"
                  :rules="[rules.minLength, rules.maxLength]"
                ></v-text-field>
              </v-col>
            </v-row>

          </v-form>
          <small>*Campo obligatiorio</small>
        </v-card-text>
            <v-card-actions class="pb-5">
              <v-spacer></v-spacer>
              <v-btn 
                color="error" 
                :disabled="loading" 
                @click.stop="closeForm"
              >CANCELAR</v-btn>
              <v-btn 
                color="deep-purple" 
                dark 
                :loading="loading"
                @click="register"
              >REGISTRAR</v-btn>
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
      rules: {
        maxLength: value => (value && value.length <= 20) || 'Límite es de 20 caracteres',
        minLength: value => !!value || 'Campo no puede estar vacío',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Correo inválido.'
        },
      },
      userInfo: {
        email: null,
        password: null,
        name: null,
        lastName: null
      },
    }
  },

  props: {
    show: {
      type: String
    }
  },
    
  computed: {
    loading() {
      return this.$store.state.loading
    },
    showDialog:  {
      get(){
        return this.$store.state.dialog
      },
      set(value){
        this.$store.commit('setDialog', value)
      }
    }, 
    
  },

  methods: {
    register() {
      if(this.$refs.form.validate()) {
        this.$store.dispatch('registerUser', {...this.userInfo})
      }
    },
    closeForm() {
      this.$refs.form.reset()
      this.$store.commit('setDialog', false)
    },
  }
}
</script>

