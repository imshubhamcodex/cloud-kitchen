<template>
  <v-container fluid class="page_404 d-flex align-center justify-center" style="height: 100vh;">
    <div class="text-center">
      <v-img src="../assets/error.png" max-width="450" class="mb-4" />
      <h1 class="h1 mb-2">404 Page not Found</h1>
      <h3 class="h2 mb-2">Looks like you're lost.</h3>
      <router-link to="/">
        <v-btn class="mt-5" style="font-weight: bold;" color="primary"><v-icon left>
            mdi-home
          </v-icon> Go to Home</v-btn>
      </router-link>
    </div>
  </v-container>
</template>
<style scoped>
h3 {
  font-style: italic;
}
</style>
