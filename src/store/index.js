import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        dishes: [
            {
                id: 100,
                name: 'Chicken Pizza',
                img: 'https://picsum.photos/id/1015/200/120',
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Small plates, salads & sandwiches",
                price: 150,
                type: 'non-veg',
                extras: [
                    { id: 1001, name: 'Gravy', qnt: 80, price: 10, selected: false },
                    { id: 1002, name: 'Raita', qnt: 50, price: 15, selected: false },
                    { id: 1003, name: 'Salad', qnt: 100, price: 15, selected: false }
                ]
            },
            {
                id: 101,
                name: 'Veg Biryani',
                img: 'https://picsum.photos/id/1016/200/120',
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Small plates, salads & sandwiches",
                price: 110,
                type: 'veg',
                extras: [
                    { id: 1011, name: 'Gravy', qnt: 80, price: 10 },
                    { id: 1012, name: 'Raita', qnt: 50, price: 15 },
                    { id: 1013, name: 'Salad', qnt: 100, price: 15 }
                ]
            },
            {
                id: 102,
                name: 'Paneer Biryani',
                img: 'https://picsum.photos/id/1018/200/120',
                avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                des: "Rich Indian flavors with cottage cheese",
                price: 135,
                type: 'veg',
                extras: [
                    { id: 1021, name: 'Gravy', qnt: 80, price: 10 },
                    { id: 1022, name: 'Raita', qnt: 50, price: 15 },
                    { id: 1023, name: 'Salad', qnt: 100, price: 15 }
                ]
            },
            {
                id: 103,
                name: 'Chicken Biryani',
                img: 'https://picsum.photos/id/1015/200/120',
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Small plates, salads & sandwiches",
                price: 150,
                type: 'non-veg',
                extras: [
                    { id: 1031, name: 'Gravy', qnt: 80, price: 10 },
                    { id: 1032, name: 'Raita', qnt: 50, price: 15 },
                    { id: 1033, name: 'Salad', qnt: 100, price: 15 }
                ]
            },
            {
                id: 104,
                name: 'Veg Pizza',
                img: 'https://picsum.photos/id/1016/200/120',
                avail: ['12:00PM - 01:30PM', '02:00PM - 05:00PM'],
                des: "Small plates, salads & sandwiches",
                price: 130,
                type: 'veg',
                extras: [
                    { id: 1041, name: 'Gravy', qnt: 80, price: 10 },
                    { id: 1042, name: 'Raita', qnt: 50, price: 15 },
                    { id: 1043, name: 'Salad', qnt: 100, price: 15 }
                ]
            },
            {
                id: 105,
                name: 'Paneer Pizza',
                img: 'https://picsum.photos/id/1018/200/120',
                avail: ['01:00PM - 02:30PM', '06:00PM - 08:00PM'],
                des: "Rich Indian flavors with cream and butter",
                price: 110,
                type: 'veg',
                extras: [
                    { id: 1051, name: 'Gravy', qnt: 80, price: 10 },
                    { id: 1052, name: 'Raita', qnt: 50, price: 15 },
                    { id: 1053, name: 'Salad', qnt: 100, price: 15 }
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
        cart: []
    },
    getters: {
        dishes: state => state.dishes,
        addOns: state => state.add_ons,
        selectedDish: state => state.selectedDish,
        cart: state => state.cart
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
        }

    },
    actions: {
        selectDish({ commit }, dish) {
            commit('SET_SELECTED_DISH', dish)
        },
        addToCart({ commit }, dish) {
            commit('ADD_TO_CART', dish)
        }
    }
})
