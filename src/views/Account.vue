<template>
  <div class="account pa-3">
    <v-container fluid fill-height>
    <v-row align="center" class="mb-2"> 
      <v-col cols="8" md="10" class="indigo--text text--darken-2 text-left">
        <div class="text-h3 d-none d-sm-block">Mi Cuenta</div>
        <h2 class="d-block d-sm-none ">Mi Cuenta</h2>
      </v-col>
      <v-col cols="4" md="2" class="text-right indigo--text">
        Hoy es, {{currentDate}}
      </v-col>
    </v-row>
      
      <v-row v-if="!loadingProfile">
        <v-col cols="12" sm="4">
          <v-card
            align-self="center"
            :loading="loading"
          >
            <v-card-title>
              <v-avatar color="indigo" size="115" class="mx-auto">
                <v-icon size="100" dark>account_circle</v-icon>
              </v-avatar>
            </v-card-title>

            <v-card-title>
              <v-spacer></v-spacer>
              {{fullName}}
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-row
                align="center"
                class="mx-0"
              >
                <div class="grey--text ml-4">Usuario desde: <b> {{creationDate}} </b></div>
              </v-row>

            <v-list >
              <v-subheader>Tus estadisticas</v-subheader>
              <v-list-item-group color="indigo">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Platillos</v-list-item-title>
                  </v-list-item-content>
                  <v-chip
                    class="ma-2"
                    color="primary"
                  >5</v-chip>
                </v-list-item>
              </v-list-item-group>
            </v-list>         
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" class="px-5">
          <h1 class="text-h5 grey--text">Edita tus datos</h1>
          <v-card>
            <v-card-text class="my-4">
              <v-form ref="form">
                <v-text-field
                  label="Correo Electronico*"
                  prepend-icon="mdi-email"
                  type="text"
                  readonly
                  shaped
                  filled
                  disabled
                  v-model="email"
                ></v-text-field>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Nombre"
                      type="text"
                      counter="20"
                      prepend-icon="account_circle"
                      v-model.lazy.trim="editableUser.name"
                      :rules="[rules.minLength, rules.maxLength]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Apellido"
                      type="text"
                      counter="20"
                      v-model.lazy.trim="editableUser.lastName"
                      :rules="[rules.minLength, rules.maxLength]"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-form>
            </v-card-text>
                <v-card-actions class="pb-5">
                  <v-spacer></v-spacer>
                  <v-btn 
                    color="indigo" 
                    dark 
                    @click="edit"
                    :loading="loading"   
                  >Actualizar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-else
        justify="center"
        align="center"
      >
        <v-progress-circular
          indeterminate
          color="indigo"
          size="48"
        >
        </v-progress-circular>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import {auth, db} from '../firebase/fb'
import {bus} from '../main'

export default {
  data() {
    return {
      user_id: null,
      email: null,
      creationDate: null,
      docId: null,
      user: {},
      editableUser: {},
      loading: false,
      loadingProfile: false,
      rules: {
        maxLength: value => (value && value.length <= 20) || 'Límite es de 20 caracteres',
        minLength: value => !!value || 'Campo no puede estar vacío',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Correo inválido.'
        },
      },
    }
  },

  computed: {
    currentDate() {
      return new Date().toLocaleDateString()
    },
    fullName() {
      return `${this.user.name} ${this.user.lastName}`
    }
  },

  methods: {

    edit() {
      if(this.$refs.form.validate()) {
        this.loading = true

        db.collection('Users')
        .doc(this.docId)
        .update({
          name: this.editableUser.name,
          lastName: this.editableUser.lastName,
          user_id: this.user_id
        })
        .then(() => {
          this.loading= false
          let snackbar = {
            isVisible: true,
            color: 'success',
            text: 'Datos editados exitosamente!'
          }
          bus.$emit('snackbar', snackbar)
          this.user.name = this.editableUser.name
          this.user.lastName = this.editableUser.lastName
        })
        .catch(() => {
          let snackbar = {
            isVisible: true,
            color: 'error',
            text: '¡Error editado tus datos!'
          }
          bus.$emit('snackbar', snackbar)
        })
      }
    }

  },


  created() {
    this.loadingProfile = true
    this.user_id = auth.currentUser.uid
    this.email = auth.currentUser.email
    this.creationDate = auth.currentUser.metadata.creationTime.substring(5,17)
    db.collection('Users')
    .where('user_id', '==', this.user_id)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
        this.user = doc.data()
        this.docId = doc.id
        this.editableUser = doc.data()
        this.loadingProfile = false
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
}
</script>
