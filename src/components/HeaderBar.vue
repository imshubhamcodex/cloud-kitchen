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
      <v-btn color="primary" rounded text>Sign in</v-btn>
    </v-app-bar>

    <!-- Dialog -->
    <v-dialog v-model="dialog" persistent max-width="550">
      <v-card>
        <v-card-title class="text-h6" style="background-color: #f5f5f5; font-weight: 500;">
          Cart Summary
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <div v-if="cart.length === 0">
            <p class="text-center text-subtitle-2 mt-5">Your cart is empty.</p>
          </div>

          <v-list v-else>
            <v-list-item v-for="(item, id) in cart" :key="id" class="mb-2">
              <v-list-item-content>
                <!-- Main Item -->
                <v-list-item-title class="d-flex justify-space-between align-center">
                  <strong><span>{{ item.name }}</span></strong>
                  <span>₹ {{ item.price }}</span>
                  <v-btn icon small color="red" @click="removeFromCart(id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-title>

                <!-- Extras -->
                <div v-if="item.extras.length">
                  <strong class="ml-10">Extras:</strong>
                  <v-list dense style="width: 80%; margin-left: 18.5%;" class="px-0">
                    <div v-for="(extra, i) in item.extras" :key="i"
                      class="px-0 d-flex justify-space-between align-center" style="height: 20px;">
                      <span>{{ extra.name }}</span>
                      <span>₹ {{ extra.price }}</span>
                      <v-icon small color="red" class="cursor-pointer" @click="removeExtra(item, i)">
                        mdi-delete
                      </v-icon>
                    </div>
                  </v-list>
                </div>

                <!-- Add-ons -->
                <div v-if="item.add_ons.length">
                  <strong class="ml-10">Add-ons:</strong>
                  <v-list dense style="width: 80%; margin-left: 18.5%;" class="px-0">
                    <div v-for="(add_on, j) in item.add_ons" :key="j"
                      class="px-0 d-flex justify-space-between align-center" style="height: 20px;">
                      <span>{{ add_on.name }}</span>
                      <span>₹ {{ add_on.price }}</span>
                      <v-icon small color="red" class="cursor-pointer" @click="removeAddon(item, j)">
                        mdi-delete
                      </v-icon>
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


          <v-divider></v-divider>



          <div class="text-h6 mt-2 text-right">
            Total: ₹ {{ cartTotal }}
          </div>
        </v-card-text>

        <v-card-actions class="pb-6">
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn v-if="cart.length != 0" color="green darken-1" :disabled="!allPickupSelected" text
            @click="checkout">Checkout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      values: [],
      elevation: 0,
      scrollY: 0,
      items: ['Pizza', 'Burger', 'Biryani', 'Salad', 'Sushi', 'Dessert', 'Drinks'],
      dialog: false,
    }
  },
  computed: {
    cart() {
      return this.$store.getters.cart
    },
    cartTotal() {
      return this.cart.reduce((total, item) => {
        const extrasTotal = item.extras?.reduce((sum, e) => sum + e.price, 0) || 0
        const addOnsTotal = item.add_ons?.reduce((sum, a) => sum + a.price, 0) || 0
        return total + item.price + extrasTotal + addOnsTotal
      }, 0)
    },
    allPickupSelected() {
      return this.cart.every(item => item.pickupTime)
    }
  },
  methods: {
    removeFromCart(id) {
      this.$store.commit('REMOVE_FROM_CART', id)
    },
    removeExtra(item, index) {
      item.extras.splice(index, 1);
    },
    removeAddon(item, index) {
      item.add_ons.splice(index, 1);
    },
    checkout() {
      alert('Proceed to checkout!')
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
