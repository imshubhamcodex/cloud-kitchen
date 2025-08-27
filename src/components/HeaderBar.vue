<template>
  <div style="position: fixed; top:0; width: 100%; z-index: 1">
    <v-app-bar color="#F9FBE7" light height="65" :elevation="elevation" class="pl-2 pr-2">
      <img src="../assets/logo.png" width="60" alt="Logo">

      <v-toolbar-title>
        <h3 class="h1 ml-2 mt-1">Mom's Kitchen</h3>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="8">
          <v-autocomplete prepend-inner-icon="mdi-magnify" class="mt-6" dense v-model="values" :items="items" outlined
            chips small-chips label="Search for your favorite dish.." clearable color="primary"></v-autocomplete>
        </v-col>
      </v-row>

      <div class="vertical-line"></div>

      <v-btn icon outlined>
        <v-icon>mdi-cart</v-icon>
      </v-btn>

      <div class="vertical-line"></div>

      <v-btn icon outlined>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn color="primary" rounded text>Sign in</v-btn>


    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      values: [],
      elevation: 0,
      scrollY: 0,
      items: ['Item 1', 'Item 2', 'Item 3']
    }
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY
    })
  },
  watch: {
    scrollY(newVal) {
      this.elevation = newVal > 5 ? 2 : 0
    }
  }
}
</script>

<style scoped>
.vertical-line {
  width: 1px;
  height: 50px;
  background-color: #eedb6f;
  margin: 0 20px;
}
</style>