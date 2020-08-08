<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-dialog 
      max-width="45%" 
      persistent
      :fullscreen="$vuetify.breakpoint.smAndDown"
      v-model="showDialog"
    >
      <v-alert :type="alert.type" v-model="alert.visible" dismissible>
        {{alert.text}}
      </v-alert>
      <template v-slot:activator="{ on: dialog }">
        <v-btn class="success ma-2" dark fixed top right rounded large v-on="{...dialog}">
         ¡Inicia Sesión!
        </v-btn>
      </template>
      <v-card shaped>
        <v-card-title class="text-center indigo--text text-h3">
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
                color="indigo" 
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
import {auth} from '../../firebase/fb'

export default {
  data() {
    return {
      showDialog: false,
      loading: false,
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
      alert: {
        type: 'success',
        text: '',
        visible: false
      },
    }
  },

  methods: {

    login() {
      if(this.$refs.form.validate()) {
        this.loading = true

        auth
        .signInWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
        .then(() => {
          this.loading = false
          this.showDialog = false
          this.$router.push({name: 'Dashboard'})
        }).catch(error => {
          this.loading = false
          
          const code = error.code
          if(code === 'auth/wrong-password') {
            this.alert.visible = true
            this.alert.type = 'warning'
            this.alert.text = 'Contraseña incorrecta, intenta de nuevo'
          } if(code === 'auth/user-not-found') {
            this.alert.visible = true
            this.alert.type = 'warning'
            this.alert.text = 'Usuario no existe, intenta de nuevo'
          } else {
            this.alert.visible = true
            this.alert.type = 'error'
            this.alert.text = 'Error al iniciar sesion. Intenta de nuevo'
            }
          })
      }
    },

    closeForm() {
      this.$refs.form.reset()
      this.showDialog = false
      this.alert.visible = false
    },



  }
}
</script>

