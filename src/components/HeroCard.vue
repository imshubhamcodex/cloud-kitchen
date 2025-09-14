<template>
    <v-container>
        <div class="carousel-wrapper">
            <v-carousel cycle height="200" hide-delimiters show-arrows-on-hover class="rounded-lg elevation-2">
                <v-carousel-item v-for="(dish, i) in dishes" :key="i">
                    <v-sheet height="100%" tile class="d-flex flex-column justify-end rounded-lg"
                        :style="`background-image: url(${dish.img}); background-size: cover; background-position: center;`">
                        <v-row class="pa-2" style="background-color: rgba(0,0,0,0.3);">
                            <v-col class="text-center" style="position: absolute; bottom: 30px;">
                                <h5 class="white--text des">{{ dish.name }} <span>
                                        <v-icon v-if="dish.type === 'veg'" small color="green"
                                            class="text-caption pb-3 pl-0">
                                            mdi-square-circle
                                        </v-icon>
                                        <v-icon v-else small color="red" class="text-caption pb-3 pl-0">
                                            mdi-format-wrap-square
                                        </v-icon>
                                    </span></h5>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>

            <!-- Button at bottom center -->
            <div class="carousel-btn">
                <v-btn fab dark color="primary" @click="onButtonClick(dishes[0])">
                    <v-icon dark>mdi-cart-plus</v-icon>
                </v-btn>
            </div>
        </div>

        <!-- Dish dialog -->
        <v-dialog v-model="dialog" persistent max-width="400">
            <v-card v-if="selectedDish">
                <v-card-title class="text-h5">
                    {{ selectedDish.name }}
                    <v-icon v-if="selectedDish.type === 'veg'" small color="green"
                        class="text-caption pb-3 pl-1">mdi-square-circle</v-icon>
                    <v-icon v-else small color="red" class="text-caption pb-3 pl-1">mdi-format-wrap-square</v-icon>
                    <v-spacer></v-spacer>
                    <span class="text-subtitle-1">₹ {{ selectedDish.price }}</span>
                </v-card-title>

                <v-divider></v-divider>

                <!-- Extras -->
                <div class="text-subtitle-1 pb-2 pt-2 pl-3 mb-2" style="background-color: #f5f5f5; font-weight: 500;">
                    Choose Extras
                </div>

                <div v-for="extra in selectedDish.extras" :key="extra.id"
                    class="extra-item d-flex align-center justify-space-between pl-6 pr-5 mb-2">
                    <v-checkbox :input-value="extra.selected"
                        @change="$store.commit('TOGGLE_EXTRA', { dishId: selectedDish.id, extraId: extra.id })"
                        :label="`${extra.name} (${extra.qnt}g)`" color="primary" hide-details
                        class="ma-0 pa-0"></v-checkbox>
                    <span style="color: grey; font-size: 16px;">₹ {{ extra.price }}</span>
                </div>

                <!-- Add-ons -->
                <div class="text-subtitle-1 pb-2 pt-2 pl-3 mb-2" style="background-color: #f5f5f5; font-weight: 500;">
                    Choose Dessert & Beverage
                </div>

                <div v-for="add_on in addOns" :key="add_on.id"
                    class="extra-item d-flex align-center justify-space-between pl-6 pr-5 mb-2">
                    <v-checkbox :input-value="add_on.selected"
                        @change="$store.commit('TOGGLE_ADDON', { addOnId: add_on.id })"
                        :label="`${add_on.name} (${add_on.qnt} ${add_on.type === 'beverage' ? 'ml' : 'pieces'})`"
                        color="primary" hide-details class="ma-0 pa-0"></v-checkbox>
                    <span style="color: grey; font-size: 16px;">₹ {{ add_on.price }}</span>
                </div>

                <v-divider></v-divider>

                <v-card-actions class="bottom_action">
                    <div class="text-subtitle-1 pb-2 pt-4 pl-3 mb-2" style="font-weight: 500;">
                        Total: ₹ {{ totalPrice }}
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="closeDialog">Cancel</v-btn>
                    <v-btn color="green darken-1" text @click="addToCart">Add Item</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            selectedDish: null
        };
    },
    computed: {
        dishes() {
            return [...this.$store.state.dishes].reverse();
        },
        addOns() {
            return this.$store.state.add_ons;
        },
        totalPrice() {
            if (!this.selectedDish) return 0;
            const extrasPrice = this.selectedDish.extras.reduce((sum, e) => (e.selected ? sum + e.price : sum), 0);
            const addOnsPrice = this.addOns.reduce((sum, a) => (a.selected ? sum + a.price : sum), 0);
            return this.selectedDish.price + extrasPrice + addOnsPrice;
        }
    },
    methods: {
        onButtonClick(dish) {
            this.selectedDish = dish; // full dish
            this.dialog = true;
            this.$store.commit('SET_SELECTED_DISH', dish);
        },
        closeDialog() {
            this.dialog = false;
            this.selectedDish = null;
        },
        addToCart() {
            this.$store.commit('ADD_TO_CART', this.selectedDish);
            this.closeDialog();
        }
    }
};
</script>

<style scoped>
.carousel-wrapper {
    position: relative;
    overflow: visible;
}

.carousel-btn {
    position: absolute;
    bottom: -13%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
}

.des {
    font-size: 14px;
}
</style>
