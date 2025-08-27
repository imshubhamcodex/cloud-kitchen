<template>
    <v-container fluid>
        <h3 class="text-left ml-3">Popular Dishes</h3>

        <v-slide-group show-arrows class="my-4" mandatory>
            <!-- Prev -->
            <template v-slot:prev>
                <v-btn icon small class="arrow-btn">
                    <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
            </template>

            <!-- Dish cards -->
            <v-slide-item v-for="(dish, index) in dishes" :key="index">
                <v-card class="mx-2 mb-5 dish-card" max-width="240">
                    <v-img height="150" :src="dish.img"></v-img>

                    <v-card-title class="pb-0 pt-2 dish-title">
                        {{ dish.name }}
                    </v-card-title>

                    <v-card-text>
                        <div class="dish-desc">{{ dish.des }}</div>
                    </v-card-text>

                    <v-divider class="mx-2"></v-divider>


                    <v-card-actions class="pt-2">
                        <v-btn style="width: 100%;" outlined rounded color="primary" text @click="orderPlace(dish)">
                            Pickup at
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-slide-item>

            <!-- Next -->
            <template v-slot:next>
                <v-btn icon small class="arrow-btn">
                    <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
            </template>
        </v-slide-group>

        <!-- Snackbar -->
        <v-snackbar color="primary" v-model="snackbar" timeout="3000">
            {{ text }}
            <template v-slot:action="{ attrs }">
                <v-btn icon small v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
        <v-divider class="mx-2"></v-divider>
    </v-container>

</template>

<script>
export default {
    data() {
        return {
            snackbar: false,
            text: '',
            dishes: [
                {
                    name: 'Chicken Biryani',
                    img: 'https://picsum.photos/id/1015/200/120',
                    avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                    des: "Small plates, salads & sandwiches",
                    selected: []
                },
                {
                    name: 'Veg Biryani',
                    img: 'https://picsum.photos/id/1016/200/120',
                    avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                    des: "Small plates, salads & sandwiches",
                    selected: []
                },
                {
                    name: 'Paneer Biryani',
                    img: 'https://picsum.photos/id/1018/200/120',
                    avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                    des: "Rich Indian flavors with cottage cheese",
                    selected: []
                },
                {
                    name: 'Chicken Biryani',
                    img: 'https://picsum.photos/id/1015/200/120',
                    avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                    des: "Small plates, salads & sandwiches",
                    selected: []
                },
                {
                    name: 'Veg Biryani',
                    img: 'https://picsum.photos/id/1016/200/120',
                    avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                    des: "Small plates, salads & sandwiches",
                    selected: []
                },
                {
                    name: 'Paneer Biryani',
                    img: 'https://picsum.photos/id/1018/200/120',
                    avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                    des: "Rich Indian flavors with cream",
                    selected: []
                }
            ]
        }
    },
    methods: {
        orderPlace(dish) {
            if (dish.selected.length === 0) {
                this.text = `Please select at least one time for ${dish.name}!`
            } else {
                this.text = `${dish.name} added for pickup at: ${dish.selected.join(', ')}`
                dish.selected = []
            }
            this.snackbar = true
        }
    }
}
</script>

<style scoped>
.arrow-btn {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: white;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
}

/* Card responsive */
.dish-card {
    max-width: 240px;
}

@media (max-width: 600px) {
    .dish-card {
        max-width: 180px;
    }

    .dish-title {
        font-size: 14px;
    }

    .dish-desc {
        font-size: 12px;
    }

    .pickup-title {
        font-size: 13px;
    }

    .arrow-btn {
        height: 28px;
        width: 28px;
    }
}
</style>