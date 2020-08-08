<template>
  <div>
    <v-snackbar
      v-model="snackbar.isVisible"
      :color="snackbar.color"
      dark
      top
    >
      {{snackbar.text}}
      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snackbar.isVisible = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <v-app-bar 
      color="indigo" 
      app 
      flat 
      dark 
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      v-if="loggedUser"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
        <v-toolbar-title  class="text-h5 hidden-sm-and-down">FOOD BLOG</v-toolbar-title>
        <v-spacer></v-spacer>
    
        <v-text-field
          flat
          solo-inverted
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          label="Buscar..."
          class="hidden-sm-and-down "
          v-model="searchTerm"
          @keyup.enter="searched"
          v-if="loggedUser"
        ></v-text-field>
        <v-text-field   
          flat
          solo-inverted
          dense
          clearable
          rounded
          label="Buscar..."
          :class="showSearch()"
          v-model="searchTerm"
          @keyup.enter="searched"
          v-if="loggedUser"
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn 
          icon 
          class="hidden-md-and-up" 
          @click="showSearchMobile = !showSearchMobile"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <span class="hidden-sm-and-down ">{{userEmail}}</span>
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer" 
      app 
      :clipped="$vuetify.breakpoint.lgAndUp" 
      dark 
      class="indigo white--text"
      v-if="loggedUser"
      > 
      
      <v-list-item class="hidden-md-and-up">
        <v-list-item-content>
          <v-list-item-title class="text-h5">FOOD BLOG</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="hidden-md-and-up"> </v-divider>
      <v-list>
        <v-list-item
          v-for="(item) in items"
          :key="item.title"
          link
          @click.stop="clickFun(item)"
          router :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>

      </v-list>

     </v-navigation-drawer>
  </div>
</template>

<script>
import {bus} from '../main'
import {auth} from '../firebase/fb'

export default {
  data(){
    return {
      drawer: null,
      searchTerm: '',
      items: [
        { title: 'Tablero', icon: 'dashboard', route: '/', },
        { title: 'Mi Cuenta', icon: 'mdi-account', route: '/account', },
        { title: 'Cerrar Sesión', icon: 'mdi-logout', route: '/logout', },
      ],
      snackbar: {
        isVisible: false,
        color: '',
        text: '',
      },
      showSearchMobile: false,
      loggedUser: false,
      userEmail: null
    }
  },

  methods: {
      getDate() {
        const date = new Date().toLocaleDateString();
        return `${date}`
      }, 
      searched() {
        this.showSearchMobile = false
        bus.$emit('searched', this.searchTerm)
      },
      showSearch() {
        if(this.$vuetify.breakpoint.mdAndUp) {
          this.showSearchMobile =  false
        }
        return this.showSearchMobile ? 'd-flex mt-5' : 'd-none'
      },
      logout(){
        console.log('User', auth.currentUser)
        auth.signOut().then(() => {
          this.$router.push({name: 'Landing'})
          this.snackbar.isVisible = true
          this.snackbar.color = 'success'
          this.snackbar.text = 'Sesión cerrada exitosamente'
        }).catch(() => {
          this.snackbar.isVisible = true
          this.snackbar.color = 'error'
          this.snackbar.text = 'Error al cerrar sesión'
        })
      },
      clickFun(item) {
        if(item.route == '/logout'){
          this.logout()
        } 
      }
  },
  
  created() {
    bus.$on('snackbar', (data) => {
      this.snackbar = data
    })
    auth.onAuthStateChanged((user) => {
      if(user){
        this.loggedUser = true
        this.userEmail = user.email

      } else {
        this.loggedUser = false
      }
    })
  }

};
</script>

<style>
</style>