<template>
  <v-app id="app">
    <v-main>
      <HeaderBar />
      <router-view style="margin-top: 75px;" />
    </v-main>
  </v-app>
</template>


<script>
import HeaderBar from './components/HeaderBar.vue'
export default {
  name: 'App',
  components: {
    HeaderBar
  }
}
</script>

<style>
#app {
  background-color: #FFFDE7;
  /* font-family: 'Amiri', serif; */
  font-size: 1.3em;
}

body,
html {
  margin: 0px;
  padding: 0px;
}
</style>
