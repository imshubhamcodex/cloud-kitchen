<template>
  <v-app id="app">
    <v-main>
      <HeaderBar style="z-index:9999;" />
      <HeroCard class="mt-12 pt-5 mb-5" v-if="isMobile && !isProfilePage" />


      <!-- Search Bar -->
      <v-row class="search-bar" align="center" justify="center" v-if="!isProfilePage && !isErrorPage">
        <v-col cols="12" sm="6" md="8">
          <v-autocomplete prepend-inner-icon="mdi-magnify" class="mt-6" dense v-model="values" :items="items" outlined
            chips small-chips label="Search for your favorite dish.." clearable color="primary"
            @change="openDialog"></v-autocomplete>
        </v-col>
      </v-row>

      <router-view class="router-view" />

      <!-- Search Result Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card v-if="selectedItem">
          <v-card-title>
            {{ selectedItem }}
            <v-spacer></v-spacer>
            <v-btn color="red accent-2" icon @click="dialog = false">
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
            <v-btn text color="red accent-2" @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
import DishesSlider from './components/DishesSlider.vue';
import HeroCard from './components/HeroCard.vue';

export default {
  name: 'App',
  components: { HeaderBar, DishesSlider, HeroCard },
  data() {
    return {
      values: null,
      windowWidth: window.innerWidth,
      items: ['Pizza', 'Biryani',],
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
  computed: {
    isProfilePage() {
      return this.$route.name === 'profile';
    },
    isErrorPage() {
      return this.$route.name === 'error';
    },
    isMobile() {
      return this.windowWidth < 600;
    }
  }
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

.v-dialog--active{
    margin-top: 50px !important;
}




@media (max-width: 500px) {
  .search-bar {
    /* margin-top: 65px !important; */
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

  .v-dialog--active {
    margin: 10px !important
  }

  .v-card__title {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
}
</style>
