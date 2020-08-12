<template>
  <div>
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      dark
      timeout="3000"
      top
    >
      {{snackbar.text}}
    </v-snackbar>

    <v-app-bar 
      color="deep-purple " 
      app 
      flat 
      dark 
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      v-if="loggedUser"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
        <v-toolbar-title class="text-h5 hidden-sm-and-down">AZAFRÁN</v-toolbar-title>
        <v-img max-width="32" :src="icon" class="ml-2 hidden-sm-and-down"></v-img>
        <v-spacer></v-spacer>
        <v-text-field
          flat
          solo-inverted
          hide-details
          rounded
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
        <span class="hidden-sm-and-down ">{{userName}}</span>
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer" 
      app 
      dark 
      :clipped="$vuetify.breakpoint.lgAndUp" 
      class="deep-purple lighten-1 white--text"
      v-if="loggedUser"
      > 
      <v-list-item class="hidden-md-and-up">
        <v-list-item-content>
          <v-list-item-title class="text-h5">AZAFRÁN</v-list-item-title>
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

export default {
  data(){
    return {
      drawer: null,
      searchTerm: '',
      items: [
        { title: 'Tablero', icon: 'dashboard', route: '/', },
        { title: 'Descubrir Recetas', icon: 'mdi-assistant', route: '/discover', },
        { title: 'Mi Cuenta', icon: 'mdi-account', route: '/account', },
        { title: 'Cerrar Sesión', icon: 'mdi-logout', route: '/logout', },
      ],
      showSearchMobile: false,
      icon: require('../assets/flower.png')
    }
  },

  methods: {
    getDate() {
      const date = new Date().toLocaleDateString();
      return `${date}`
    }, 
    searched() {
      this.showSearchMobile = false
      this.$store.commit('setFilter', {type: 'title', query: this.searchTerm})
    },
    showSearch() {
      if(this.$vuetify.breakpoint.mdAndUp) {
        this.showSearchMobile =  false
      }
      return this.showSearchMobile ? 'd-flex mt-5' : 'd-none'
    },
    logout(){
      this.$store.dispatch('logOutUser')
    },
    clickFun(item) {
      if(item.route == '/logout'){
        this.logout()
      } 
    },
  },
  computed: {
    snackbar() {
      let snackbar = {...this.$store.state.snackbar}
      return snackbar
    },
    loggedUser() {
      return this.$store.getters.isAuthenticated
    },
    userName() {
      return this.$store.state.user.name
    }
  },

}
</script>

<style>
</style>