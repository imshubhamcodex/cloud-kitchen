<template>
  <div style="position: fixed; top:0; width: 100%; z-index: 1;">
    <v-app-bar color="#F9FBE7" light height="65" :elevation="elevation" class="pl-2 pr-2">
      <img class="logo" src="../assets/logo.png" width="60" alt="Logo">

      <v-toolbar-title>
        <h3 class="h1 mt-1 search_bar_header">Mom's Kitchen</h3>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-row class="search_bar_header">
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="8">
          <v-autocomplete prepend-inner-icon="mdi-magnify" class="mt-6" dense v-model="values" :items="items" outlined
            chips small-chips label="Search for your favorite dish.." clearable color="primary"
            @change="openDialog"></v-autocomplete>
        </v-col>
      </v-row>

      <div class="vertical-line"></div>

      <!-- Cart button triggers dialog -->
      <v-btn icon outlined @click="dialog = true">
        <v-badge :content="cart.length" color="#E53935" overlap v-if="cart.length > 0">
          <v-icon>mdi-cart</v-icon>
        </v-badge>
        <v-icon v-else>mdi-cart</v-icon>
      </v-btn>


      <div class="vertical-line"></div>

      <v-btn icon outlined>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn class="signin-btn" color="primary" rounded text>Sign in</v-btn>
    </v-app-bar>

    <!-- Dialog -->
    <v-dialog v-model="dialog" persistent max-width="550">
      <v-card>
        <v-card-title class="text-h6" style="background-color: #f5f5f5; font-weight: 500;">
          Cart Summary
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="px-0">
          <div v-if="cart.length === 0">
            <p class="text-center text-subtitle-2 mt-5">Your cart is empty.</p>
          </div>

          <v-list v-else>
            <v-list-item v-for="(item, id) in cart" :key="id" class="mb-2">
              <v-list-item-content>
                <!-- Main Item -->
                <v-list-item-title class="d-flex justify-space-between align-center">
                  <span><strong>{{ item.name }}</strong> : ₹ {{ (item.price * item.quantity) }}</span>
                  <div>
                    <v-btn icon small color="red" @click="decreaseQty(item)">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-1">{{ item.quantity }}</span>
                    <v-btn icon small class="mr-4" color="green" @click="increaseQty(item)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn icon small color="red" @click="removeFromCart(id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-list-item-title>

                <!-- Extras -->
                <div v-if="item.extras.length">
                  <strong class="ml-10">Extras:</strong>
                  <v-list dense style="width: 80%; margin-left: 18.5%;" class="px-0">
                    <div v-for="(extra, i) in item.extras" :key="i"
                      class="px-0 d-flex justify-space-between align-center" style="height: 20px;">
                      <span>{{ truncate(extra.name) }} : ₹ {{ extra.price * extra.quantity }}</span>
                      <div>
                        <v-btn icon small color="red"
                          @click="$store.commit('DECREASE_EXTRA_QTY', { cartIndex: id, extraIndex: i })">
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <span class="mx-1">{{ extra.quantity }}</span>
                        <v-btn icon small color="green" class="mr-5"
                          @click="$store.commit('INCREASE_EXTRA_QTY', { cartIndex: id, extraIndex: i })">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-icon small color="red" class="cursor-pointer"
                          @click="removeExtra(item, i)">mdi-delete</v-icon>
                      </div>
                    </div>
                  </v-list>
                </div>

                <!-- Add-ons -->
                <div v-if="item.add_ons.length">
                  <strong class="ml-10">Add-ons:</strong>
                  <v-list dense style="width: 80%; margin-left: 18.5%;" class="px-0">
                    <div v-for="(add_on, j) in item.add_ons" :key="j"
                      class="px-0 d-flex justify-space-between align-center" style="height: 20px;">
                      <span>{{ truncate(add_on.name) }} : ₹ {{ add_on.price * add_on.quantity }}</span>
                      <div>
                        <v-btn icon small color="red"
                          @click="$store.commit('DECREASE_ADDON_QTY', { cartIndex: id, addOnIndex: j })">
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <span class="mx-1">{{ add_on.quantity }}</span>
                        <v-btn icon small color="green" class="mr-5"
                          @click="$store.commit('INCREASE_ADDON_QTY', { cartIndex: id, addOnIndex: j })">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-icon small color="red" class="cursor-pointer" @click="removeAddon(item, j)">
                          mdi-delete
                        </v-icon>
                      </div>

                    </div>
                  </v-list>
                </div>

                <div>
                  <strong>Pickup Time:</strong>
                  <v-chip-group v-model="item.pickupTime" active-class="deep-purple accent-2 white--text" column>
                    <v-chip v-for="time in item.avail" :key="time" :value="time">
                      {{ time }}
                    </v-chip>
                  </v-chip-group>
                </div>

                <div>
                  <v-divider class="mt-5"></v-divider>
                </div>
              </v-list-item-content>
            </v-list-item>

          </v-list>

          <div class="mt-0 d-flex justify-space-between align-center">
            <strong style="color: black; font-size: 18px;" class="total_price">Total: ₹ {{ cartTotal }}</strong>
            <v-spacer></v-spacer>
            <v-btn class="btn-action" color="red darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn class="btn-action" v-if="cart.length != 0" color="green darken-1" :disabled="!allPickupSelected" text
              @click="checkout">Checkout</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>



    <!-- Search Result Dialog -->
    <v-dialog v-model="searchDialog" max-width="900">
      <v-card v-if="selectedItem">
        <v-card-title>
          {{ selectedItem }}
          <v-spacer></v-spacer>
          <v-btn icon @click="searchDialog = false">
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
          <v-btn text color="primary" @click="searchDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import DishesSlider from './DishesSlider.vue'
export default {
  name: 'HeaderBar',
  components: { DishesSlider },
  data() {
    return {
      values: [],
      elevation: 0,
      scrollY: 0,
      items: ['Pizza', 'Burger', 'Biryani', 'Salad', 'Sushi', 'Dessert', 'Drinks'],
      dialog: false,
      searchDialog: false,
      selectedItem: null,
    }
  },
  computed: {
    cart() {
      return this.$store.getters.cart
    },
    cartTotal() {
      return this.cart.reduce((total, item) => {
        const extrasTotal = item.extras?.reduce((sum, e) => sum + e.price * e.quantity, 0) || 0
        const addOnsTotal = item.add_ons?.reduce((sum, a) => sum + a.price * a.quantity, 0) || 0
        return total + (item.price * item.quantity) + extrasTotal + addOnsTotal
      }, 0)
    },
    allPickupSelected() {
      return this.cart.every(item => item.pickupTime)
    }
  },
  methods: {
    truncate(text) {
      if (window.innerWidth <= 500) {
        if (window.innerWidth <= 400) {
          return text.length > 8 ? text.slice(0, 4) + '…' : text
        } else {
          return text.length > 10 ? text.slice(0, 8) + '…' : text
        }

      }
      return text
    },
    removeFromCart(id) {
      this.$store.commit('REMOVE_FROM_CART', id)
    },
    removeExtra(item, index) {
      item.extras.splice(index, 1);
    },
    removeAddon(item, index) {
      item.add_ons.splice(index, 1);
    },
    increaseQty(item) {
      if (!item.quantity || item.quantity < 1) item.quantity = 1
      else item.quantity++
    },
    decreaseQty(item) {
      if (item.quantity > 1) item.quantity--
    },
    extrasTotal(item) {
      return item.extras?.reduce((sum, e) => sum + e.price, 0) || 0
    },
    addOnsTotal(item) {
      return item.add_ons?.reduce((sum, a) => sum + a.price, 0) || 0
    },
    checkout() {
      alert('Proceed to checkout!')
    },
    openDialog(value) {
      if (value) {
        this.selectedItem = value
        this.searchDialog = true
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY
    })
  },
  watch: {
    scrollY(newVal) {
      this.elevation = newVal > 0 ? 2 : 0
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

.total_price {
  margin-left: 20px;
}

.btn-action {
  margin-right: 20px;
}

@media screen and (max-width: 500px) {
  .search_bar_header {
    display: none;
  }

  .logo {
    margin-top: 10px;
    margin-left: -15px;
  }

  .total_price {
    font-size: 15px !important;
  }

  .btn-action {
    zoom: 0.9;
    padding: 4px !important;
    margin-left: 5px !important;
  }

  .signin-btn {
    margin-left: 5px !important;
    padding-right: 0px !important;
  }

}
</style>
