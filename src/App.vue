<template>
  <v-app id="app">
    <v-main>
      <HeaderBar />

      <!-- Search Bar -->
      <v-row class="search-bar" align="center" justify="center">
        <v-col cols="12" sm="6" md="8">
          <v-autocomplete
            prepend-inner-icon="mdi-magnify"
            class="mt-6"
            dense
            v-model="values"
            :items="items"
            outlined
            chips
            small-chips
            label="Search for your favorite dish.."
            clearable
            color="primary"
            @change="openDialog"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <router-view class="router-view" />

      <!-- Search Result Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card v-if="selectedItem">
          <v-card-title>
            {{ selectedItem }}
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="px-0">
            <div class="mt-2">
              <DishesSlider :title="`Search results for: ${selectedItem}`" :item="selectedItem" />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
import DishesSlider from './components/DishesSlider.vue';

export default {
  name: 'App',
  components: { HeaderBar, DishesSlider },
  data() {
    return {
      values: null,
      items: ['Pizza', 'Biryani', 'Pasta', 'Burger', 'Salad', 'Dessert', 'Beverages'],
      dialog: false,
      selectedItem: null,
    }
  },
  methods: {
    openDialog(value) {
      if (value) {
        this.selectedItem = value
        this.dialog = true
      }
    },
  },
}
</script>

<style>
#app {
  background-color: #FFFDE7;
  font-size: 1.3em;
}

body,
html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.router-view {
  margin-top: 0;
}

@media (max-width: 500px) {
  .search-bar {
    margin-top: 65px !important;
    padding-left: 15px;
    padding-right: 15px;
  }

  .router-view {
    margin-top: 0 !important;
  }

  body,
  html {
    overflow-x: hidden;
  }
}
</style>
