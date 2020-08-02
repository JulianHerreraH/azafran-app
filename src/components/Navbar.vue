<template>
  <div>
    <v-app-bar color="indigo" flat dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
      <v-toolbar-title>Food Blog</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <span class="d-none d-sm-flex">{{getDate()}}</span>
    </v-app-bar>


    <v-navigation-drawer v-model="drawer" app temporary dark class="indigo white--text"> 
      
      <v-list-item class="">

        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Username</v-list-item-title>
        </v-list-item-content>

      </v-list-item>

      <v-divider></v-divider>

      <v-list>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
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
      drawer:false,
      items: [
        { title: 'Tablero', icon: 'dashboard', route: '/'},
        { title: 'Mi Cuenta', icon: 'mdi-account', route: '/account'},
        { title: 'Cerrar Sesión', icon: 'mdi-logout', route: '/logout'},
      ],
    }
  },
  methods: {
      getDate() {
        const date = new Date().toLocaleDateString();
        return `${date}`
      }, 
  }

};
</script>

<style>
</style>