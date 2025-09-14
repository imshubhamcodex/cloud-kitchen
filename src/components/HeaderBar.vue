<template>
  <div style="position: fixed; top:0; width: 100%; z-index: 1;">
    <v-app-bar color="#F9FBE7" light height="65" :elevation="elevation" class="pl-2 pr-2">
      <img class="logo" src="../assets/logo.png" width="60" alt="Logo" @click="$router.push('/')">

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

      <!-- Replace the Sign In button -->
      <v-btn v-if="!currentUser" class="signin-btn" color="primary" rounded outlined text @click="signInDialog = true">
        Sign In
      </v-btn>


      <v-btn v-else icon outlined @click="gotoProfile" class="signin-btn">
        <v-icon>mdi-account</v-icon>
      </v-btn>


    </v-app-bar>

    <!-- Dialog -->
    <v-dialog v-model="dialog" persistent max-width="650">
      <v-card>
        <v-card-title class="text-h6" style="background-color: #f5f5f5; font-weight: 500;">
          Cart Summary
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="px-0">
          <div v-if="cart.length === 0" class="empty-cart d-flex flex-column align-center justify-center"
            style="height: 200px;">
            <v-avatar size="64" color="grey lighten-3">
              <v-icon size="36">mdi-food</v-icon>
            </v-avatar>
            <p class="text-center text-subtitle-2 mt-4">Your cart is empty.</p>
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
                    <v-btn icon small :class="isMobile ? 'mr-3' : 'mr-4'" color="green" @click="increaseQty(item)">
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
                  <v-divider class="mt-5"></v-divider>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <!-- GLOBAL Pickup Date & Time (one per checkout) -->
          <div class="d-flex align-center mb-4 justify-space-between pl-5 pr-5">
            <strong class="mr-3">Pickup Date & Time:</strong>
            <v-menu v-model="pickupMenu" :close-on-content-click="false" transition="scale-transition" offset-y
              min-width="250px">
              <template v-slot:activator="{ on, attrs }">
                <!-- use :value to display computed string -->
                <v-text-field dense outlined class="mt-4" :value="pickupDateTime" label="Select Date & Time" readonly
                  v-bind="attrs" v-on="on" style="max-width: 220px;"></v-text-field>
              </template>

              <v-card style="zoom: 0.8;">
                <!-- Date Picker -->
                <v-date-picker v-model="pickupDate" :min="minDate" no-title scrollable></v-date-picker>

                <!-- Time Picker -->
                <v-time-picker v-model="pickupTime" format="24hr" :allowed-hours="hour => allowedHours(hour)"
                  :allowed-minutes="minute => allowedMinutes(minute)" />

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="pickupMenu = false">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>

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
          <v-btn color="red darken-1" icon @click="searchDialog = false">
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
          <v-btn text color="red darken-1" @click="searchDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Sign In Dialog -->
    <v-dialog persistent v-model="signInDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ authMode === 'signIn' ? 'Sign In' : 'Create Account' }}
          <v-spacer></v-spacer>
          <v-btn icon @click="signInDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-5">
          <v-form ref="authForm" v-model="isFormValid">
            <v-text-field v-if="authMode === 'signUp'" v-model="name" label="Full Name" :rules="[signInRules.required]"
              required outlined dense clearable />

            <v-text-field v-if="authMode === 'signUp'" v-model="phone" label="Phone Number" type="tel"
              :rules="[signInRules.phoneRule, signInRules.required]" required outlined dense clearable />

            <v-text-field v-model="email" label="Email" type="email" :rules="[signInRules.required, signInRules.email]"
              required outlined dense clearable />

            <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="showPassword = !showPassword"
              :rules="[signInRules.required, signInRules.min]" required outlined dense clearable />
          </v-form>

          <div class="mt-2">
            <span v-if="authMode === 'signIn'">Don't have an account?
              <a href="#" @click.prevent="toggleAuthMode">Sign Up</a>
            </span>
            <span v-else>Already have an account?
              <a href="#" @click.prevent="toggleAuthMode">Sign In</a>
            </span>
          </div>

          <v-spacer></v-spacer>
          <div class="d-flex justify-end mt-2">
            <v-btn text color="red" @click="signInDialog = false">
              Cancel
            </v-btn>

            <v-btn :loading="loading" :disabled="loading || !isFormValid" text color="green" @click="submitAuth">
              {{ authMode === 'signIn' ? 'Sign In' : 'Sign Up' }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar color="#424242" v-model="snackbar" timeout="4000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn icon small v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>

</template>
<script>
import DishesSlider from './DishesSlider.vue'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase';
import { v4 as uuidv4 } from "uuid";

export default {
  name: 'HeaderBar',
  components: { DishesSlider },
  data() {
    return {
      loader: null,
      loading: false,
      isFormValid: false,
      windowWidth: window.innerWidth,
      values: [],
      snackbar: false,
      snackbarText: '',
      elevation: 0,
      scrollY: 0,
      items: ['Pizza', 'Burger', 'Biryani', 'Salad', 'Sushi', 'Dessert', 'Drinks'],
      dialog: false,
      searchDialog: false,
      selectedItem: null,
      minDate: new Date().toISOString().substr(0, 10),
      signInDialog: false,
      name: '',
      phone: '',
      email: '',
      password: '',
      validSignIn: false,
      showPassword: false,
      authMode: 'signIn', // or 'signUp'
      signInRules: {
        required: v => !!v || 'Required.',
        email: v => {
          const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
          return pattern.test(v) || 'Invalid e-mail.';
        },
        min: v => (v && v.length >= 6) || 'Min 6 characters',
        phoneRule: v => {
          if (!v) return 'Phone number is required.';
          return /^[6-9]\d{9}$/.test(v) || 'Enter a valid 10-digit Indian phone number starting with 6-9.';
        }
      },

      // === NEW: global pickup fields (one per checkout) ===
      pickupMenu: false,
      pickupDate: null,   // yyyy-mm-dd
      pickupTime: null,   // 'HH:mm'
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth < 600;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
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
    // computed readable pickup string
    pickupDateTime() {
      return (this.pickupDate && this.pickupTime) ? `${this.pickupDate} ${this.pickupTime}` : ''
    },
    // we require a single pickup date/time for checkout
    allPickupSelected() {
      return !!(this.pickupDate && this.pickupTime)
    }
  },
  methods: {
    async checkout() {
      const totalAmount = this.cartTotal; // cart total from computed
      const user = this.currentUser;

      // validate pickup selected
      if (!this.pickupDate || !this.pickupTime) {
        this.snackbarText = "Please select pickup date & time before checkout.";
        this.snackbar = true;
        return;
      }

      if (user == null) {
        this.signInDialog = true
        this.dialog = false
        return
      }
      else {
        const options = {
          key: process.env.VUE_APP_RAZORPAY_KEY_ID, // from .env
          amount: totalAmount * 100, // amount in paise
          currency: "INR",
          name: "Mom's Kitchen",
          description: "Food Order Payment",
          handler: async (response) => {
            // Payment success
            await this.saveOrder(response.razorpay_payment_id, totalAmount);
          },
          prefill: {
            name: user?.name || "Guest User",
            email: user?.email || "",
            contact: user?.phone || ""
          },
          theme: { color: "#C59D5F" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    },

    async saveOrder(paymentId, totalAmount) {
      const userId = this.currentUser?.uid || "guest";
      const orderId = uuidv4();
      const pickupDateTime = this.pickupDate && this.pickupTime
        ? new Date(`${this.pickupDate}T${this.pickupTime}:00`)
        : null;

      const orderData = {
        orderId,
        userId,
        items: this.cart.map((item) => ({
          ...item,
          itemOrderId: uuidv4(), // unique ID per item
        })),
        totalAmount,
        paymentId,
        status: "paid",
        createdAt: new Date(),
        pickupDateTime,
        deliveryCode: Math.floor(1000 + Math.random() * 9000), // 4-digit code
      };

      // Save order in Firestore
      await setDoc(doc(db, "orders", orderId), orderData);

      this.$store.commit("CLEAR_CART"); // clear cart if you track in Vuex
      this.dialog = false;
      this.snackbarText = "Payment successful & order placed!";
      this.snackbar = true;

      // reset pickup fields for next order
      this.pickupDate = null;
      this.pickupTime = null;

      if(this.$route.name != 'profile') this.$router.push("/profile");
    },

    gotoProfile() {
      if (this.$route.path !== '/profile') {
        this.$router.push('/profile');
      }
    },

    async submitAuth() {
      if (!this.$refs.authForm.validate()) return;
      this.loader = 'loading';

      if (this.authMode === 'signIn') {
        // 🔹 Sign In Logic
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          const authUser = userCredential.user;

          const docRef = doc(db, "users", authUser.uid);
          const docSnap = await getDoc(docRef);

          let user = {};
          if (docSnap.exists()) {
            user = { ...authUser, ...docSnap.data() };
          }

          console.log(user);
          this.$store.commit('SET_USER', user);
          this.signInDialog = false;

          this.snackbarText = `Signed in as ${user.email}`;
          this.snackbar = true;

          this.email = '';
          this.password = '';
        } catch (error) {
          alert(error.message);
        }

      } else {
        // 🔹 Sign Up Logic
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const authUser = userCredential.user;
          const docRef = doc(db, "users", authUser.uid);

          await setDoc(docRef, {
            name: this.name,
            phone: this.phone,
            email: this.email,
            createdAt: new Date()
          });

          const docSnap = await getDoc(docRef);

          let user = {};
          if (docSnap.exists()) {
            user = { ...authUser, ...docSnap.data() };
          }
          console.log(user);
          this.$store.commit('SET_USER', user);
          this.signInDialog = false;
          this.snackbarText = `Signed up as ${user.email}`;
          this.snackbar = true;

          this.name = '';
          this.phone = '';
          this.email = '';
          this.password = '';
        } catch (error) {
          alert(error.message);
        }
      }
    },
    toggleAuthMode() {
      this.authMode = this.authMode === 'signIn' ? 'signUp' : 'signIn';
    },

    // allowed hours and minutes now use the global pickupDate/pickupTime
    allowedHours(hour) {
      const now = new Date();
      const selectedDate = this.pickupDate ? new Date(this.pickupDate) : null;
      let minHour = 12;

      if (selectedDate && selectedDate.toDateString() === now.toDateString()) {
        minHour = now.getHours() + 1;
        if (minHour < 12) minHour = 12;
      }

      return hour >= minHour && hour <= 20; // max 8 PM
    },
    allowedMinutes(minute) {
      const now = new Date();
      const selectedDate = this.pickupDate ? new Date(this.pickupDate) : null;

      if (
        selectedDate &&
        selectedDate.toDateString() === now.toDateString()
      ) {
        const selectedHour = parseInt(this.pickupTime?.split(':')[0]);
        if (selectedHour === now.getHours() + 1) {
          return minute >= now.getMinutes();
        }
      }
      return true;
    },

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
    openDialog(value) {
      if (value) {
        this.selectedItem = value
        this.searchDialog = true
        this.values = []
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY
    }),
      auth.onAuthStateChanged(user => {
        if (user) {
          this.$store.commit('SET_USER', user);
        } else {
          this.$store.commit('CLEAR_USER');
        }
      });
  },
  watch: {
    scrollY(newVal) {
      this.elevation = newVal > 0 ? 2 : 0
    },
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 4000)

      this.loader = null
    },
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

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
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
    margin-left: 0px !important;
    padding-right: 10px !important;
    padding-left: 10px !important;
  }

}
</style>
