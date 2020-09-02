<template>
  <v-row
    align="center"
    justify="center"
    v-if="show == 'login'"
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
              autocomplete="on"
              required
              v-model="userInfo.password"
              :rules="[rules.minLength]"
            ></v-text-field>
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
                @click="login"
              >INICIAR SESIÓN</v-btn>
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
        maxLength: value => (value && value.length <= 20) || 'Límite es 20 caracteres',
        minLength: value => !!value || 'Campo no puede estar vacío',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Correo inválido.'
        },
      },
      userInfo: {
        email: null,
        password: null,
      },
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

  props: {
    show: {
      type: String
    }
  },

  methods: {
    login() {
      if(this.$refs.form.validate()) {
        this.$store.dispatch('loginUser', {
          email: this.userInfo.email,
          password: this.userInfo.password
        })
      }
    },
    closeForm() {
      this.$refs.form.reset()
      this.$store.commit('setDialog', false)
    },
  }
}
</script>

