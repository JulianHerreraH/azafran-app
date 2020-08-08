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
        <v-btn class="info ma-2" dark rounded large fixed top left v-on="{...dialog}">
         ¡Crea una cuenta ahora!
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
                color="indigo" 
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
import {db, auth} from '../../firebase/fb'

export default {
  data() {
    return {
      showDialog: false,
      loading: false,
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
      alert: {
        type: 'success',
        text: '',
        visible: false
      }
    }
  },

  methods: {

    register() {
      if(this.$refs.form.validate()) {
        this.loading = true

        auth
        .createUserWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
        .then(cred => {
          db.collection('Users').add({
            name: this.userInfo.name,
            lastName: this.userInfo.lastName,
            user_id: cred.user.uid
          }).then(() => {
            this.loading = false
            this.showDialog = false
            this.$router.push({name: 'Dashboard'})
          }).catch(error => {
            console.log(error)
          })
        })
        .catch(error => {
          const code = error.code
          this.loading = false
          if(code === 'auth/weak-password') {
            this.alert.visible = true
            this.alert.type = 'warning'
            this.alert.text = 'La contraseña es muy debil, intenta de nuevo'
          } if(code === 'auth/email-already-in-use') {
            this.alert.visible = true
            this.alert.type = 'warning'
            this.alert.text = 'Correo en uso, intenta de nuevo'
           } else {
            this.alert.visible = true
            this.alert.type = 'error'
            this.alert.text = 'Error al crear cuenta :( Intenta de nuevo'
          }
        })
        
      }
    },

    closeForm() {
      this.$refs.form.reset()
      this.showDialog = false
      this.alert.visible = false
    }

  }
}
</script>

