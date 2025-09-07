<template>
    <v-container fluid>
        <h3 class="text-left text_title">{{ title }}</h3>

        <!-- Dish slider -->
        <v-slide-group show-arrows class="my-4 " mandatory>
            <template v-slot:prev>
                <v-btn icon small class="arrow-btn">
                    <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
            </template>

            <div class="v-slide-group__wrapper"
                :style="dishes.length < 5 ? { display: 'flex', justifyContent: 'center', width: '100%' } : {}">

                <v-slide-item v-for="dish in dishes" :key="dish.id">
                    <v-card class="mx-2 mb-5 dish-card" max-width="240">
                        <!-- Skeleton loader until image is loaded -->
                        <div style="position: relative; height: 150px;">
                            <v-skeleton-loader v-if="!imgLoaded" type="image" height="150"></v-skeleton-loader>
                            <v-img :src="dish.img" height="150" @load="imgLoaded = true"
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></v-img>
                        </div>

                        <v-card-title class="pb-0 pt-2 dish-title">
                            {{ dish.name }}
                            <span>
                                <v-icon v-if="dish.type === 'veg'" small color="green" class="text-caption pb-3 pl-1">
                                    mdi-square-circle
                                </v-icon>
                                <v-icon v-else small color="red" class="text-caption pb-3 pl-1">
                                    mdi-format-wrap-square
                                </v-icon>
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <div class="dish-desc">{{ dish.des }}</div>
                        </v-card-text>
                        <v-divider class="mx-2"></v-divider>
                        <v-card-actions class="pt-2">
                            <span class="text-h6 ml-2">₹ {{ dish.price }}</span>
                            <v-spacer></v-spacer>
                            <v-btn style="width: 50%;" rounded elevation="1" color="primary" @click="orderPlace(dish)">
                                ADD+
                            </v-btn>
                        </v-card-actions>
                    </v-card>

                </v-slide-item>
            </div>
            <template v-slot:next>
                <v-btn icon small class="arrow-btn">
                    <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
            </template>
        </v-slide-group>

        <!-- Snackbar -->
        <v-snackbar color="#424242" v-model="snackbar" timeout="3000">
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn icon small v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>

        <!-- Dish dialog -->
        <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="400" max-height="500">
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
                    <div class="text-subtitle-1 pb-2 pt-2 pl-3 mb-2"
                        style="background-color: #f5f5f5; font-weight: 500;">
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
                    <div class="text-subtitle-1 pb-2 pt-2 pl-3 mb-2"
                        style="background-color: #f5f5f5; font-weight: 500;">
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
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: {
        title: String,
        item: String
    },
    data() {
        return {
            dialog: false,
            snackbar: false,
            snackbarText: '',
            imgLoaded: false,
        }
    },
    computed: {
        dishes() {
            if (!this.item || this.item === 'all') return this.$store.getters.dishes
            return this.$store.getters.dishes.filter(dish =>
                dish.name.toLowerCase().includes(this.item.toLowerCase())
            )
        },
        addOns() {
            return this.$store.getters.addOns
        },
        selectedDish() {
            return this.$store.getters.selectedDish
        },
        totalPrice() {
            if (!this.selectedDish) return 0
            const extrasTotal = this.selectedDish.extras
                .filter(e => e.selected)
                .reduce((acc, curr) => acc + curr.price, 0)
            const addOnsTotal = this.addOns
                .filter(a => a.selected)
                .reduce((acc, curr) => acc + curr.price, 0)
            return this.selectedDish.price + extrasTotal + addOnsTotal
        },
    },
    methods: {
        orderPlace(dish) {
            this.$store.dispatch('selectDish', dish)
            this.dialog = true
        },
        addToCart() {
            this.$store.dispatch('addToCart', this.selectedDish)
            this.dialog = false
            this.snackbarText = 'Added to cart, please visit cart'
            this.snackbar = true
        },
        closeDialog() {
            this.dialog = false
            this.$store.commit('SET_SELECTED_DISH', null)
        },
    },
    mounted() {
        this.imgLoaded = false
    }
}
</script>

<style>
.text_title {
    margin-left: 30px;
}

.arrow-btn {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: white;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
}
.dish-card {
    max-width: 240px;
}
@media (max-width: 500px) {
    .dish-card {
        max-width: 180px;
    }

    .dish-title {
        font-size: 17px;
    }

    .dish-desc {
        font-size: 15px;
    }

    .arrow-btn {
        display: none;
    }

    .v-slide-group__prev,
    .v-slide-group__next {
        display: none !important;
    }

    .dish-card {
        zoom: 0.7 !important;
    }

    .text_title {
        font-size: 18px !important;
        margin-left: 0px !important;
    }

    .bottom_action {
        zoom: 0.9;
    }
}
</style>
