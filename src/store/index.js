import Vue from 'vue'
import Vuex from 'vuex'
import biryaniImg1 from '@/assets/biryani1.png'
import biryaniImg2 from '@/assets/biryani2.png'
import biryaniImg3 from '@/assets/biryani3.png'
import biryaniImg4 from '@/assets/biryani4.png'
import biryaniImg5 from '@/assets/biryani5.png'
import biryaniImg6 from '@/assets/biryani6.png'

import pizzaImg1 from '@/assets/pizza1.png'
import pizzaImg2 from '@/assets/pizza2.png'
import pizzaImg3 from '@/assets/pizza3.png'
import pizzaImg4 from '@/assets/pizza4.png'
import pizzaImg5 from '@/assets/pizza5.png'
import pizzaImg6 from '@/assets/pizza6.png'



Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        dishes: [
            // Pizza Items
            {
                id: 100,
                name: 'Chicken Pizza',
                img: pizzaImg1,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Tender chicken with mozzarella cheese",
                price: 150,
                type: 'non-veg',
                extras: [
                    { id: 1001, name: 'Extra Cheese', qnt: 50, price: 30, selected: false },
                    { id: 1002, name: 'Mushrooms', qnt: 50, price: 25, selected: false },
                    { id: 1003, name: 'Jalapeños', qnt: 30, price: 15, selected: false }
                ]
            },
            {
                id: 101,
                name: 'Veg Pizza',
                img: pizzaImg2,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Fresh vegetables with mozzarella cheese",
                price: 130,
                type: 'veg',
                extras: [
                    { id: 1011, name: 'Extra Cheese', qnt: 50, price: 30, selected: false },
                    { id: 1012, name: 'Mushrooms', qnt: 50, price: 25, selected: false },
                    { id: 1013, name: 'Jalapeños', qnt: 30, price: 15, selected: false }
                ]
            },
            {
                id: 102,
                name: 'Paneer Pizza',
                img: pizzaImg3,
                avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                des: "Rich Indian flavors with cottage cheese",
                price: 140,
                type: 'veg',
                extras: [
                    { id: 1021, name: 'Extra Cheese', qnt: 50, price: 30, selected: false },
                    { id: 1022, name: 'Mushrooms', qnt: 50, price: 25, selected: false },
                    { id: 1023, name: 'Jalapeños', qnt: 30, price: 15, selected: false }
                ]
            },
            {
                id: 103,
                name: 'Pepperoni Pizza',
                img: pizzaImg4,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Classic pepperoni with mozzarella cheese",
                price: 160,
                type: 'non-veg',
                extras: [
                    { id: 1031, name: 'Extra Cheese', qnt: 50, price: 30, selected: false },
                    { id: 1032, name: 'Mushrooms', qnt: 50, price: 25, selected: false },
                    { id: 1033, name: 'Jalapeños', qnt: 30, price: 15, selected: false }
                ]
            },
            {
                id: 104,
                name: 'Margherita Pizza',
                img: pizzaImg5,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Classic tomato, mozzarella and basil",
                price: 120,
                type: 'veg',
                extras: [
                    { id: 1041, name: 'Extra Cheese', qnt: 50, price: 30, selected: false },
                    { id: 1042, name: 'Mushrooms', qnt: 50, price: 25, selected: false },
                    { id: 1043, name: 'Jalapeños', qnt: 30, price: 15, selected: false }
                ]
            },
            {
                id: 105,
                name: 'BBQ Chicken Pizza',
                img: pizzaImg6,
                avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                des: "Tangy BBQ sauce with grilled chicken",
                price: 170,
                type: 'non-veg',
                extras: [
                    { id: 1051, name: 'Extra Cheese', qnt: 50, price: 30, selected: false },
                    { id: 1052, name: 'Mushrooms', qnt: 50, price: 25, selected: false },
                    { id: 1053, name: 'Jalapeños', qnt: 30, price: 15, selected: false }
                ]
            },

            // Biryani Items
            {
                id: 106,
                name: 'Chicken Biryani',
                img: biryaniImg1,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Aromatic basmati rice with tender chicken",
                price: 150,
                type: 'non-veg',
                extras: [
                    { id: 1061, name: 'Gravy', qnt: 80, price: 20, selected: false },
                    { id: 1062, name: 'Raita', qnt: 50, price: 15, selected: false },
                    { id: 1063, name: 'Salad', qnt: 100, price: 15, selected: false }
                ]
            },
            {
                id: 107,
                name: 'Veg Biryani',
                img: biryaniImg6,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Fragrant rice with mixed vegetables",
                price: 120,
                type: 'veg',
                extras: [
                    { id: 1071, name: 'Gravy', qnt: 80, price: 20, selected: false },
                    { id: 1072, name: 'Raita', qnt: 50, price: 15, selected: false },
                    { id: 1073, name: 'Salad', qnt: 100, price: 15, selected: false }
                ]
            },
            {
                id: 108,
                name: 'Paneer Biryani',
                img: biryaniImg5,
                avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                des: "Aromatic rice with cottage cheese cubes",
                price: 135,
                type: 'veg',
                extras: [
                    { id: 1081, name: 'Gravy', qnt: 80, price: 20, selected: false },
                    { id: 1082, name: 'Raita', qnt: 50, price: 15, selected: false },
                    { id: 1083, name: 'Salad', qnt: 100, price: 15, selected: false }
                ]
            },
            {
                id: 109,
                name: 'Mutton Biryani',
                img: biryaniImg3,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Slow-cooked rice with tender mutton pieces",
                price: 180,
                type: 'non-veg',
                extras: [
                    { id: 1091, name: 'Gravy', qnt: 80, price: 20, selected: false },
                    { id: 1092, name: 'Raita', qnt: 50, price: 15, selected: false },
                    { id: 1093, name: 'Salad', qnt: 100, price: 15, selected: false }
                ]
            },
            {
                id: 110,
                name: 'Hyderabadi Biryani',
                img: biryaniImg2,
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Authentic Hyderabadi style spicy biryani",
                price: 160,
                type: 'non-veg',
                extras: [
                    { id: 1101, name: 'Gravy', qnt: 80, price: 20, selected: false },
                    { id: 1102, name: 'Raita', qnt: 50, price: 15, selected: false },
                    { id: 1103, name: 'Salad', qnt: 100, price: 15, selected: false }
                ]
            },
            {
                id: 111,
                name: 'Egg Biryani',
                img: biryaniImg4,
                avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                des: "Flavorful rice with steamed boiled eggs",
                price: 130,
                type: 'non-veg',
                extras: [
                    { id: 1111, name: 'Gravy', qnt: 80, price: 20, selected: false },
                    { id: 1112, name: 'Raita', qnt: 50, price: 15, selected: false },
                    { id: 1113, name: 'Salad', qnt: 100, price: 15, selected: false }
                ]
            }

        ],
        add_ons: [
            { id: 200, name: 'Thums Up Can', qnt: 330, price: 60, type: 'beverage', selected: false },
            { id: 201, name: 'Masala Lemonade', qnt: 180, price: 30, type: 'beverage', selected: false },
            { id: 202, name: 'Ayran (Buttermilk)', qnt: 200, price: 60, type: 'beverage', selected: false },
            { id: 203, name: 'Coca-Cola Bottle', qnt: 475, price: 60, type: 'beverage', selected: false },
            { id: 204, name: 'Gulab Jamun', qnt: 2, price: 50, type: 'dessert', selected: false },
            { id: 205, name: 'Water Bottle (1L)', qnt: 1000, price: 20, type: 'beverage', selected: false }
        ],
        selectedDish: null,
        cart: [],
        currentUser: null
    },
    getters: {
        dishes: state => state.dishes,
        addOns: state => state.add_ons,
        selectedDish: state => state.selectedDish,
        cart: state => state.cart,
        currentUser: state => state.currentUser,
        isAuthenticated: state => !!state.currentUser
    },
    mutations: {
        SET_SELECTED_DISH(state, dish) {
            state.selectedDish = dish
            console.log('Selected dish:', dish)
        },
        TOGGLE_EXTRA(state, { dishId, extraId }) {
            const dish = state.dishes.find(d => d.id === dishId)
            const extra = dish.extras.find(e => e.id === extraId)
            extra.selected = !extra.selected
        },
        TOGGLE_ADDON(state, { addOnId }) {
            const addOn = state.add_ons.find(a => a.id === addOnId)
            addOn.selected = !addOn.selected
        },
        ADD_TO_CART(state, dish) {
            const cartItem = {
                ...dish,
                extras: dish.extras
                    .filter(e => e.selected)
                    .map(e => ({ ...e, quantity: 1 })),
                add_ons: state.add_ons
                    .filter(a => a.selected)
                    .map(a => ({ ...a, quantity: 1 })),
                pickupMenu: false,      // for v-menu open/close
                pickupDate: null,       // selected date
                pickupTime: null,       // selected time
                pickupDateTime: '',     // combined date + time for display
                quantity: 1
            }
            state.cart.push(cartItem)

            // Reset selected flags
            dish.extras.forEach(e => e.selected = false)
            state.add_ons.forEach(a => a.selected = false)
            state.selectedDish = null
        },
        REMOVE_FROM_CART(state, id) {
            state.cart.splice(id, 1)
        },
        INCREASE_EXTRA_QTY(state, { cartIndex, extraIndex }) {
            state.cart[cartIndex].extras[extraIndex].quantity++
        },
        DECREASE_EXTRA_QTY(state, { cartIndex, extraIndex }) {
            if (state.cart[cartIndex].extras[extraIndex].quantity > 1)
                state.cart[cartIndex].extras[extraIndex].quantity--
        },
        INCREASE_ADDON_QTY(state, { cartIndex, addOnIndex }) {
            state.cart[cartIndex].add_ons[addOnIndex].quantity++
        },
        DECREASE_ADDON_QTY(state, { cartIndex, addOnIndex }) {
            if (state.cart[cartIndex].add_ons[addOnIndex].quantity > 1)
                state.cart[cartIndex].add_ons[addOnIndex].quantity--
        },
        INCREASE_DISH_QTY(state, cartIndex) {
            state.cart[cartIndex].quantity++
        },
        DECREASE_DISH_QTY(state, cartIndex) {
            if (state.cart[cartIndex].quantity > 1)
                state.cart[cartIndex].quantity--
        },
        SET_USER(state, user) {
            state.currentUser = user;
        },
        CLEAR_USER(state) {
            state.currentUser = null;
            state.cart = [];
            state.orders = [];
        },
    },
    actions: {
        selectDish({ commit }, dish) {
            commit('SET_SELECTED_DISH', dish)
        },
        addToCart({ commit }, dish) {
            commit('ADD_TO_CART', dish)
        },
    }
})
