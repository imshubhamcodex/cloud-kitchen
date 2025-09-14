<template>
  <div class="order-history">
    <v-card class="elevation-5 rounded-lg">
      <!-- Card Title -->
      <v-card-title class="primary white--text d-flex align-center" :class="{ 'py-3 px-4': isMobile }">
        <v-icon large color="white" class="mr-2">mdi-history</v-icon>
        <span class="text-truncate">Order History</span>
      </v-card-title>

      <v-card-text class="pa-0">
        <!-- Loading State -->
        <v-skeleton-loader v-if="loading" type="table" />

        <!-- No Orders -->
        <div v-else-if="orders.length === 0" class="pa-6 text-center">
          <v-icon size="64" color="grey lighten-1">mdi-cart-off</v-icon>
          <p class="text-h6 grey--text text--darken-1 mt-4">No orders yet</p>
          <v-btn color="primary" text to="/" class="mt-2">
            <v-icon left>mdi-food</v-icon>
            Browse Menu
          </v-btn>
        </div>

        <!-- Orders List -->
        <v-expansion-panels v-else accordion>
          <v-expansion-panel v-for="order in orders" :key="order.id">
            <!-- Header -->
            <v-expansion-panel-header>
              <div class="d-flex align-center flex-wrap justify-space-between w-100">
                <div :class="{ 'mb-2': isMobile }">
                  <strong>Order ID# {{ order.id.substring(0, 8) }}</strong>
                  <div class="text-caption grey--text">
                    {{ formatDate(order.createdAt?.toDate?.() || order.createdAt) }}
                  </div>
                  <!-- Delivery Code -->
                  <div class="text-subtitle-2 font-weight-medium mt-1">
                    Delivery Code: <span class="primary--text">{{ order.deliveryCode }}</span>
                  </div>
                </div>
                <div class="pl-7">
                  <v-chip small :color="getStatusColor(order.status)" text-color="white" class="mr-3">
                    {{ order.status.toUpperCase() }} ₹{{ calculateOrderTotal(order) }}
                  </v-chip>

                  <v-btn color="primary" fab x-small dark @click.stop="reorderItems(order)">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-header>

            <!-- Content -->
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item v-for="item in order.items" :key="item.itemOrderId || item.id"
                  class="flex-column flex-sm-row align-start align-sm-center">
                  <div class="d-flex align-center w-100 flex-wrap">
                    <v-list-item-avatar :class="{ 'mr-3': !isMobile }">
                      <v-avatar size="40" color="grey lighten-3">
                        <v-icon>
                          {{ item.type === 'veg' ? 'mdi-food-apple' : 'mdi-food' }}
                        </v-icon>
                      </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <div class="d-flex justify-space-between align-center">
                        <v-list-item-title class="font-weight-medium">
                          {{ item.name }} x{{ item.quantity }}
                        </v-list-item-title>
                        <span class="font-weight-medium">
                          ₹{{ item.price * item.quantity }}
                        </span>
                      </div>

                      <v-list-item-subtitle
                        v-if="(item.extras && item.extras.length) || (item.add_ons && item.add_ons.length)">
                        <div v-if="item.extras && item.extras.length">
                          <div v-for="(extra, index) in item.extras" :key="'extra-' + index"
                            class="d-flex justify-space-between">
                            <span>Extra: {{ extra.name }} x{{ extra.quantity }}</span>
                            <span>₹{{ extra.price * extra.quantity }}</span>
                          </div>
                        </div>

                        <div v-if="item.add_ons && item.add_ons.length">
                          <div v-for="(addon, index) in item.add_ons" :key="'addon-' + index"
                            class="d-flex justify-space-between">
                            <span>Add-on: {{ addon.name }} x{{ addon.quantity }}</span>
                            <span>₹{{ addon.price * addon.quantity }}</span>
                          </div>
                        </div>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                </v-list-item>
              </v-list>
              <!-- Pickup DateTime -->
              <div class="mt-0" v-if="isMobile">
                <div class="text-subtitle-2 font-weight-medium">Pickup Time: <span class="ml-12">{{
                  formatPickupTime(order.pickupDateTime) }}</span></div>
              </div>
              <div v-else class="ml-5 mt-5">
                <div class="text-subtitle-2 font-weight-medium">Pickup Time:</div>
                <div class="text-subtitle-2">
                  <span>{{ formatPickupTime(order.pickupDateTime) }}</span>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'OrderHistory',
  props: {
    orders: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    isMobile: { type: Boolean, default: false }
  },
  methods: {
    formatPickupTime(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },
    getStatusColor(status) {
      const colors = {
        completed: 'indigo',
        cancelled: 'red',
        paid: 'green'
      };
      return colors[status] || 'grey';
    },
    calculateOrderTotal(order) {
      return order.items.reduce((total, item) => {
        let itemTotal = item.price * item.quantity;
        if (item.extras) item.extras.forEach(e => (itemTotal += e.price * e.quantity));
        if (item.add_ons) item.add_ons.forEach(a => (itemTotal += a.price * a.quantity));
        return total + itemTotal;
      }, 0);
    },
    reorderItems(order) {
      order.items.forEach(item => {
        const cartItem = {
          ...item,
          extras: item.extras ? item.extras.map(e => ({ ...e })) : [],
          add_ons: item.add_ons ? item.add_ons.map(a => ({ ...a })) : [],
          pickupMenu: false,
          pickupDateTime: item.pickupDateTime || order.pickupDateTime || '',
          quantity: item.quantity || 1
        };
        this.$store.commit('ADD_TO_CART', cartItem);
      });
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.order-history {
  width: 100%;
}

@media (max-width: 600px) {
  .v-expansion-panel-header {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .v-list-item {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .v-list-item-avatar {
    margin-bottom: 8px !important;
  }
}
</style>
