import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import createPersistedState from 'vuex-persistedstate'
import {auth, db, storage} from '../firebase/fb'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({

  plugins: [createPersistedState({
    storage: localStorage,
    paths: ['user', 'dishes'],
  })],  

  state: {
    user: null,
    listenerActive: null,
    dishes: [],
    difficulties: [],
    cuisines: [],
    recipes: [],
    loading: false,
    snackbar: {
      visible: false,
      color: '',
      text: '',
    },
    dialog: false,
    filter: {
      type: 'title',
      query: ''
    }
  },

  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
    setSnackbar(state, payload) {
      state.snackbar = payload
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setListener(state, payload) {
      state.listenerActive = payload
    },
    setDialog(state, payload) {
      state.dialog = payload
    },
    setDishes(state, payload) {
      console.log('add-dish')
      if(state.listenerActive == null) {
        state.dishes = payload
        console.log(state.dishes)
      } else if (state.listenerActive) {
        console.log('only one')
        state.dishes.push(...payload)
      } 
    },
    updateDishes(state, payload) {
      const index = state
      .dishes
      .findIndex(item => item.id == payload.id)
      state.dishes.splice(index, 1, {...payload})
    },
    removeDishes(state, payload) {
      state.dishes = state.dishes.filter(item => item.id != payload)
    },
    setFilter(state, payload) {
      console.log(payload)
      state.filter = {...payload}
    },
    setDifficulties(state, payload) {
      state.difficulties = payload
    },
    setCuisines(state, payload) {
      state.cuisines = payload
    },
    setRecipes(state, payload) {
      state.recipes = payload
    }
  },

  actions: {
    // Auth functions
    registerUser({ commit }, { email, password, name, lastName }) {
      commit('setLoading', true)
      auth
      .createUserWithEmailAndPassword(email, password)
      .then(cred => {
        db.collection('Users/')
        .doc(cred.user.uid)
        .set({
          name,
          lastName,
          user_id: cred.user.uid
        })
        .then(() => {
          commit('setUser', {
            name,
            lastName,
            user_id: cred.user.uid,
            email,
          })
          commit('setLoading', false)
          commit('setDialog', false)
          router.push({ name: 'Dashboard' })
        })
      })
      .catch(error => {
        commit('setLoading', false)
        const code = error.code
        if (code === 'auth/weak-password') {
          commit('setSnackbar', {
            visible: true,
            color: 'warning',
            text: 'La contraseña es muy debil, intenta de nuevo'
          })
        } if (code === 'auth/email-already-in-use') {
          commit('setSnackbar', {
            visible: true,
            color: 'warning',
            text: 'Correo en uso, intenta de nuevo'
          })
        } else {
          commit('setSnackbar', {
            visible: true,
            color: 'warning',
            text: 'Error al crear cuenta :( Intenta de nuevo'
          })
        }
      })
    },
    loginUser({ commit }, { email, password }) {
      commit('setLoading', true)
      auth
      .signInWithEmailAndPassword(email, password)
      .then(cred => {
        db.collection('Users')
        .doc(cred.user.uid)
        .get()
        .then((doc) => {
          if(doc.exists) {
            commit('setUser', {
              ...doc.data(),
              email: cred.user.email,
              user_id: doc.id,
            })
            commit('setLoading', false)
            commit('setDialog', false)
            router.push({ name: 'Dashboard' })
          } else {
            commit('setLoading', false)
            commit('setSnackbar', {
              visible: true,
              color: 'warning',
              text: 'Error al iniciar sesión. Intenta de nuevo'
            })
          }
        })
      })
      .catch(error => {
        commit('setLoading', false)
        const code = error.code
        console.log(code)
        if (code === 'auth/wrong-password') {
          commit('setSnackbar', {
            visible: true,
            color: 'warning',
            text: 'Contraseña incorrecta, intenta de nuevo'
          })
        } if (code === 'auth/user-not-found') {
          commit('setSnackbar', {
            visible: true,
            color: 'warning',
            text: 'Usuario no existe, intenta de nuevo'
          })
        } else {
          commit('setSnackbar', {
            visible: true,
            color: 'warning',
            text: 'Error al iniciar sesion. Intenta de nuevo'
          })
        }
      })
    },
    logOutUser({ commit }) {
      auth.signOut().then(() => {
        commit('setUser', null)
        commit('setListener', null)
        commit('setDishes', [])
        localStorage.clear()
        commit('setSnackbar', {
          visible: true,
          color: 'success',
          text: 'Sesión cerrada exitosamente'
        })
        router.push({ name: 'Landing' })
      }).catch(() => {
        commit('setSnackbar', {
          visible: true,
          color: 'error',
          text: 'Error al cerrar sesión'
        })
      })
    },
    editUser({ commit }, { name, lastName }) {
      commit('setLoading', true)
      db.collection('Users')
      .doc(this.state.user.user_id)
      .update({
        name,
        lastName: lastName,
        user_id: this.state.user.user_id
      })
      .then(() => {
        commit('setLoading', false)
        commit('setSnackbar', {
          visible: true,
          color: 'success',
          text: 'Datos editados exitosamente!'
        })
        commit('setUser', {
          name,
          lastName,
        })
      })
      .catch(() => {
        commit('setLoading', false)
        commit('setSnackbar', {
          visible: true,
          color: 'error',
          text: '¡Error editado tus datos!'
        })
      })
    },

    // Dish related functions
    getDishes({ commit }) {
      commit('setLoading', true)
      db.collection('Dishes')
      .where('user_id', '==', this.state.user.user_id)
      .onSnapshot(res => {
        console.log('getDishes')
        let dishes = []
        res.docChanges().forEach(change => {
          if (change.type === 'added') {
            let dish = { ...change.doc.data(), id: change.doc.id}
            dishes.push(dish)
            console.log('added')
            commit('setDishes', dishes)
          }
          if (change.type === 'modified') {
            commit('updateDishes', {
              ...change.doc.data(),
              id: change.doc.id
            })
            
            console.log('updated')
          }
          if (change.type === 'removed') {
            commit('removeDishes', change.doc.id)
            console.log('modified')
          }
        })
        commit('setListener', true)  
        commit('setLoading', false)
      }, (error) => {
        console.log("Error getting document:", error)
        commit('setLoading', false)
        commit('setSnackbar', {
          visible: true,
          color: 'error',
          text: 'Error cargando datos'
        })
      })
      
    },
    getCategories({ commit }) {
      const diffRef = db.collection('Difficulty')
      let difficulties = []
      diffRef.orderBy('num', 'asc').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          difficulties.push(doc.data().value)
        })
      }).catch(error => {
        commit('setSnackbar', {
          visible: true,
          text: 'Error cargando datos de dificultad',
          color: 'error'
        })
        console.log("Error getting document:", error)
      })
      commit('setDifficulties', difficulties)

      const cuisineRef = db.collection('Cuisines')
      let cuisines = []
      cuisineRef.orderBy('name', 'asc').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          cuisines.push(doc.data().name)
        })
      }).catch(error => {
        commit('setSnackbar', {
          visible: true,
          text: 'Error cargando datos de cocinas',
          color: 'error'
        })
        console.log("Error getting document:", error)
      })
      commit('setCuisines', cuisines)
    },
    createDish({ commit }, { imageFile, dish }) {
      commit('setLoading', true)

      let uploadTask = storage
        .ref()
        .child('Dish_Images/' + imageFile.name)
        .put(imageFile)

      console.log('before upload')

      uploadTask.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done');
      }, error => {
        commit('setLoading', false)
        commit( 'setSnackbar', {
          visible: true,
          color: 'error',
          text: 'Error subiendo imagen'
        })
        console.log("Error uploading image", error)
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          dish.imageURL = downloadURL
          dish.user_id = this.state.user.user_id
          db.collection('Dishes').add(dish).then(() => {
            console.log('create doish')
            commit('setDialog', false)
            commit('setLoading', false)
            commit('setSnackbar', {
              visible: true,
              color: 'success',
              text: '¡Nuevo platillo agregado!'
            })
          })
          .catch((error) => {
            commit('setSnackbar',{
              isVisible: true,
              color: 'error',
              text: 'Error agregando platillo'
            })
            console.log("Error getting document:", error)
          })
        })
      })

    },
    deleteDish({ commit }, { dish } ) {
      commit('setLoading', true)

      let ref = storage.refFromURL(dish.imageURL)
      ref.delete().then(() => {
        db
        .collection('Dishes')
        .doc(dish.id)
        .delete()
        .then(() => {
          commit('setDialog', false)
          commit('setLoading', false)
          commit('setSnackbar', {
            visible: true,
            color: 'info',
            text: '¡Platillo eliminado exitosamente!'
          })
          router.push({ name: 'Dashboard' })
        })
      }).catch((error) => {
        commit('setLoading', false)
        commit('setSnackbar', {
          visible: true,
          color: 'error',
          text: 'Error eliminando platillo'
        })
        console.log("Error uploading image", error)
      })
    },
    editDish( {commit}, { dish } ) {
      commit('setLoading', true)

      db.collection('Dishes')
      .doc(dish.id)
      .update(dish)
      .then(() => {
        commit('setLoading', false)
        commit('setDialog', false)
        commit('setSnackbar', {
          visible: true,
          color: 'success',
          text: '¡Platillo editado exitosamente!'
        })
      })
      .catch(error => {
        commit('setLoading', false)
        commit('setSnackbar', {
          visible: false,
          color: 'error',
          text: 'Error editando platillo :('
        })
        console.log("Error getting document:", error)
      })
    },

    // Recipes functions
    getRecipes({ commit }, search ) {
      const proxy = "https://cors-anywhere.herokuapp.com/"
      const url = 'https://test-es.edamam.com/search'
      const min = Math.floor(Math.random() * 50)
      const high = min + 6
      axios
        .get( proxy+url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          params: {
            q: search,
            app_id: 'cf1a370d',
            app_key: '32061c28c9f06828fc31b3af929d7ca3',
            from: min,
            to: high
          }
        })
        .then(response => {
          commit('setRecipes', response.data.hits)
        })
        .catch(() => {
          commit('setRecipes', [])
          commit('setSnackbar', {
            visible: false,
            color: 'error',
            text: 'Error obteniendo recetas'
          })
        })
    }
  },

  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined;
    },
    getDish: (state) => (id) => {
      return state.dishes.find(item => item.id == id)
    }
  }

})

export default store
