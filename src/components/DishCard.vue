<template>
        <v-col
        cols="12"
        lg="4"
        md = "6"
        >
         <v-card class="mx-auto" outlined>
           <v-img
              class="white--text align-end"
              :src="imageURL"
              :aspect-ratio="16/9"
            >
              <v-card-title class="font-weight-bold text-xl-h3 text-sm-h4">{{dish.title}}</v-card-title>
            </v-img>

            <v-row class=" px-1" align="center" dense justify="space-between">
            <v-card-subtitle>{{ formattedDate(dish.timestamp )}}</v-card-subtitle>
            <v-rating v-model="dish.rating" small dense readonly color="amber" class="mx-2"></v-rating>
            </v-row>

            <v-card-text class="text--primary text-justify">
              {{dish.description | truncate(200) }}
              <!-- <div v-for="ingredient in dish.ingredients" :key="ingredient">{{ingredient}}</div> -->
            </v-card-text>

            <v-row align="center" dense class="px-3">
              <v-chip 
              rounded 
              small 
              :color="getColor()" 
              class="mx-1" 
              dark 
              @click.stop="filterByCuisine"
              >{{dish.cuisine}}</v-chip>
              <v-chip 
              rounded 
              small 
              :color="getDifficultyColor()" 
              class="mx-1" 
              dark 
              @click.stop="filterByDifficulty"
              >{{dish.difficulty}}</v-chip>
            </v-row>

            <v-card-actions>
              <v-btn color="indigo" text @click.stop="dishDetail">
                Ver más
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-col>
</template>

<script>
import {bus} from '../main'

export default {
  name: 'DishCard',
  data() {
    return {
      levels:{
        easy: 'fácil',
        medium: 'media',
        hard: 'difícil'
      },
      defaultImage: require('../assets/no_image.jpg')
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
    }
  },

  methods: {
    formattedDate(timestamp) {
      const dateISO = new Date(timestamp).toISOString().substring(0,10)
      return dateISO.split('-').reverse().join('-')
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
      switch(diff) {
        case this.levels.easy:
          return 'green'
        case this.levels.medium:
          return 'yellow'
        case this.levels.hard: 
          return 'red'
      }
    },
    dishDetail() {
      console.log(this.dish.id) 
    },
    filterByCuisine() {
      bus.$emit('filterDishes', {type: 'cuisine', value: this.dish.cuisine})
    },
    filterByDifficulty() {
      bus.$emit('filterDishes', {type: 'difficulty', value: this.dish.difficulty})
    },
  }
}
</script>
