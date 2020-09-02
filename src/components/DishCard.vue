<template>
  <v-col
    cols="12"
    lg="4"
    md = "6"
  >
    <v-card 
      class="mx-auto white--text" 
      light 
      height="100%"
    >
      <v-img
        class="mx-auto white-bg"
        :src="imageURL"
        cover
        :aspect-ratio="1.65/1"
      >
      <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular 
              indeterminate 
              color="deep-purple" 
              size="48"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-card-title 
      class="font-weight-bold text-xl-h3 text-sm-h4 deep-purple--text pb-1"
      >{{dish.title}}
      </v-card-title>

      <v-row 
        class="px-1" 
        align="center" 
        dense 
        justify="space-between">
          <v-card-subtitle>{{ formattedDate(dish.timestamp )}}</v-card-subtitle>
          <v-rating 
            v-model="dish.rating" 
            small 
            dense 
            readonly 
            color="amber" 
            background-color="orange lighen-3"
            class="mx-2"
          ></v-rating>
      </v-row>

      <v-card-text class="text--primary text-justify white--text py-1">
        {{dish.description | truncate(200) }}
      </v-card-text>

      <v-row align="center" dense class="px-3">
        <v-chip 
          rounded 
          small 
          :color="getColor" 
          class="mx-1" 
          dark 
          @click.stop="filterByCuisine"
        >{{dish.cuisine}}</v-chip>
        <v-chip 
          rounded 
          small 
          :color="getDifficultyColor" 
          class="mx-1" 
          dark 
          @click.stop="filterByDifficulty"
        >{{dish.difficulty}}</v-chip>
      </v-row>

      <v-card-actions>
        <v-btn 
          color="deep-purple" 
          text 
          router 
          :to="dishRoute"
        >
          Ver más
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="deep-purple accent-4"
          @click="changeFavoriteStatus"
        >
          <v-icon>{{icon}}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'DishCard',
  data() {
    return {
      levels:{
        easy: 'fácil',
        medium: 'media',
        hard: 'difícil'
      },
      defaultImage: require('../assets/no_image.jpg'),
      showDetail: false,
    }
  },

  props: {
    dish: {
      type: Object,
      required: true,
    }
  },

  filters: {
    truncate(text, stop, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    }
  },

  computed: {
    imageURL() {
      return this.dish.imageURL || this.defaultImage
    },
    dishRoute() {
      return `dish/${this.dish.id}`
    },
    icon() {
      return this.dish.isFavorite ? 'favorite' : 'favorite_border' 
    },
    getColor() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    getDifficultyColor() {
      const diff = this.dish.difficulty.toLowerCase()
      let color
      switch(diff) {
        case this.levels.easy:
          color = 'green'
          break
        case this.levels.medium:
          color = 'yellow'
          break
        case this.levels.hard: 
          color = 'red'
          break
      }
      return color
    },
  },

  methods: {
    formattedDate(timestamp) {
      const dateISO = new Date(timestamp).toISOString().substring(0,10)
      return dateISO.split('-').reverse().join('-')
    },
    filterByCuisine() {
      this.$store.commit('setFilter', {type: 'cuisine', query: this.dish.cuisine})
    },
    filterByDifficulty() {
     this.$store.commit('setFilter', {type: 'difficulty', query: this.dish.difficulty})
    },
    changeFavoriteStatus() {
      this.dish.isFavorite = !this.dish.isFavorite
      this.$store.dispatch('changeFavoriteStatus', {id: this.dish.id, value: this.dish.isFavorite})
    },
  }
}
</script>

<style scoped>
  .white-bg {
    background-color: white!important;
  }
</style>
