<template>
  <v-container class="profile-container">
    <!-- Order History Section -->
    <OrderHistory class="mt-12 pt-3" :orders="orders" :loading="ordersLoading" :isMobile="isMobile" />

    <v-row justify="center">
      <!-- Profile + Orders -->
      <v-col cols="12" md="8" lg="8">
        <v-card class="mt-12 pt-0 ml-0 mr-0 rounded-lg" rounded elevation="5">
          <v-card-title class="primary white--text" :class="{ 'py-3 px-4': isMobile }">
            <v-icon large color="white" class="mr-2">mdi-account-circle</v-icon>
            <span class="text-truncate">{{ profile.name }}</span>
          </v-card-title>

          <v-card-text class="pa-6" :class="{ 'pa-4': isMobile }">
            <v-skeleton-loader v-if="loading" type="card" />

            <div v-else>
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="profile.name" :rules="nameRules" label="Full Name" prepend-icon="mdi-account"
                      outlined dense />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field v-model="profile.email" label="Email" prepend-icon="mdi-email" outlined dense
                      disabled />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field v-model="profile.phone" :rules="phoneRules" label="Phone Number"
                      prepend-icon="mdi-phone" outlined dense />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea v-model="profile.address" :rules="addressRules" label="Delivery Address"
                      prepend-icon="mdi-map-marker" outlined auto-grow rows="2" dense />
                  </v-col>
                </v-row>
              </v-form>

              <v-alert v-if="error" type="error" dense class="mt-4" dismissible>
                {{ error }}
              </v-alert>

              <v-alert v-if="success" type="success" dense class="mt-4" dismissible>
                {{ success }}
              </v-alert>
            </div>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn color="primary" :disabled="!valid || updateLoading" :loading="updateLoading" @click="updateProfile"
              block>
              <v-icon class="mr-2">mdi-content-save</v-icon>
              <span class="d-none d-sm-inline">Save Changes</span>
              <span class="d-sm-none">Save</span>
            </v-btn>
          </v-card-actions>
          <v-divider />
        </v-card>
      </v-col>
    </v-row>

    <!-- Logout -->
    <v-btn @click="logout" color="red" class="white--text log-out mt-12">
      LOGOUT
      <v-icon class="ml-2">mdi-logout</v-icon>
    </v-btn>

    <!-- Snackbar -->
    <v-snackbar color="#424242" v-model="snackbar" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn icon small v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import OrderHistory from '../components/OrderHistory.vue';

export default {
  name: 'UserProfile',
  components: {
    OrderHistory
  },
  data() {
    return {
      loading: true,
      updateLoading: false,
      ordersLoading: true,
      snackbar: false,
      snackbarText: '',
      valid: false,
      profile: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      orders: [],
      error: null,
      success: null,
      windowWidth: window.innerWidth,
      selectedOrder: null,
      ordersUnsubscribe: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 3 || 'Name must be at least 3 characters'
      ],
      phoneRules: [
        v => !!v || 'Phone number is required',
        v => /^\d{10}$/.test(v) || 'Phone number must be 10 digits'
      ],
      addressRules: [
        v => !!v || 'Address is required',
        v => v.length >= 10 || 'Please enter a complete address'
      ]
    };
  },
  created() {
    this.fetchUserProfile();
    this.fetchOrderHistory();
    window.addEventListener('resize', this.checkScreenSize);
    this.checkScreenSize();
  },

  destroyed() {
    window.removeEventListener('resize', this.checkScreenSize);

    // Clean up Firestore listener
    if (this.ordersUnsubscribe) {
      this.ordersUnsubscribe();
    }
  },

  computed: {
    isMobile() {
      return this.windowWidth < 600;
    }
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$store.commit('CLEAR_USER');   // clear Vuex state
        this.$router.push('/');
        this.snackbarText = "Logged out successfully!";
        this.snackbar = true;
      } catch (error) {
        alert(error.message);
      }
    },
    checkScreenSize() {
      this.windowWidth = window.innerWidth;
    },

    async fetchUserProfile() {
      this.loading = true;
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.profile = {
            name: userData.name || '',
            email: userData.email || auth.currentUser.email,
            phone: userData.phone || '',
            address: userData.address || ''
          };
        } else {
          // Create user document if it doesn't exist
          await setDoc(docRef, {
            name: auth.currentUser.displayName || '',
            email: auth.currentUser.email,
            createdAt: new Date()
          });

          this.profile.name = auth.currentUser.displayName || '';
          this.profile.email = auth.currentUser.email;
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        this.error = 'Failed to load profile data';
      } finally {
        this.loading = false;
      }
    },

    async updateProfile() {
      if (!this.$refs.form.validate()) return;

      this.updateLoading = true;
      this.error = null;
      this.success = null;

      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          name: this.profile.name,
          phone: this.profile.phone,
          address: this.profile.address,
          updatedAt: new Date()
        });

        // Update display name in Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: this.profile.name
        });

        this.success = 'Profile updated.';
      } catch (err) {
        console.error('Error updating profile:', err);
        this.error = 'Failed to update profile';
      } finally {
        this.updateLoading = false;
      }
    },

    fetchOrderHistory() {
      this.ordersLoading = true;
      try {
        const userId = auth.currentUser.uid;

        // Unsubscribe from previous listener if exists
        if (this.ordersUnsubscribe) {
          this.ordersUnsubscribe();
        }

        // Set up real-time listener for orders
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

        this.ordersUnsubscribe = onSnapshot(q, snapshot => {
          this.orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          this.ordersLoading = false;

        }, error => {
          console.error('Error in orders listener:', error);
          this.ordersLoading = false;
        });
      } catch (err) {
        console.error('Error setting up orders listener:', err);
        this.ordersLoading = false;
      }
    },

    getStatusColor(status) {
      const colors = {
        'Pending': 'orange',
        'Confirmed': 'green',
        'Ready': 'blue',
        'Completed': 'indigo',
        'Cancelled': 'red'
      };
      return colors[status] || 'grey';
    },

    calculateOrderTotal(order) {
      let total = 0;
      order.items.forEach(item => {
        total += item.price * item.quantity;

        // Add extras cost
        if (item.extras) {
          item.extras.forEach(extra => {
            total += extra.price * extra.quantity;
          });
        }

        // Add add-ons cost
        if (item.add_ons) {
          item.add_ons.forEach(addon => {
            total += addon.price * addon.quantity;
          });
        }
      });
      return total;
    },

    updateOrderInList(updatedOrder) {
      const index = this.orders.findIndex(o => o.id === updatedOrder.id);
      if (index !== -1) {
        this.orders.splice(index, 1, updatedOrder);
        this.selectedOrder = updatedOrder;
      }
    },
  }
};
</script>

<style scoped>
.profile-container {
  padding-top: 24px;
  padding-bottom: 24px;
  min-height: 100vh;
}

.log-out {
  width: 20%px;
  margin-left: 46%;
}

@media screen and (max-width: 600px) {
  .log-out {
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>