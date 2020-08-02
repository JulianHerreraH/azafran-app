<template>
            <v-col
        cols="12"
        sm="4"
        >

         <v-card class="mx-auto" max-width="400" outlined>
           <v-img
              class="white--text align-end"
              height="200px"
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            >
              <v-card-title class="font-weight-bold">{{dish.name}}</v-card-title>
            </v-img>

            <v-row class="my-1 px-1" align="center" dense justify="space-between">
            <v-card-subtitle>{{ formattedDate(dish.date) }}</v-card-subtitle>
            <v-rating v-model="dish.rating" small dense readonly color="amber" class="mx-2"></v-rating>
            </v-row>


            <v-card-text class="text--primary">
              <div>{{dish.ingredients}}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="indigo" text>
                Ver más
              </v-btn>

              <v-btn color="red" text>
                Eliminar
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-col>
</template>

<script>
export default {
  name: 'DishCard',
  props: {
    dish: {
      id: '',
      name: '',
      date: '',
      ingredients: '',
      rating: '',
    }
  },
  methods: {
    formattedDate(date) {
        return date.split('/').reverse().join('/')
    }
  }
}
</script>
