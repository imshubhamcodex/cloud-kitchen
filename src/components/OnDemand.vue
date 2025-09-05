<template>
    <v-container fluid class="pl-3 pr-3">
        <h3 class="text-left text_title">Dish On Demand</h3>

        <v-row justify="center" class="mx-auto">
            <v-col cols="12" md="6" class="text-center">

                <!-- Search and Quantity -->
                <v-row class="mt-6" align="center" dense>
                    <v-col cols="12" md="8">
                        <v-autocomplete v-model="values" :items="items" label="Search your favorite dish" outlined dense
                            clearable prepend-inner-icon="mdi-magnify" color="primary"></v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field v-model="quantity" :label="`Quantity (min ${minQuantity})`" type="number" outlined
                            dense :min="minQuantity"></v-text-field>
                    </v-col>
                </v-row>

                <!-- Order Type -->
                <v-row class="mt-0" align="center">
                    <v-col cols="12">
                        <v-radio-group v-model="orderType" row class="justify-center">
                            <v-radio label="Bulk Order" value="bulk" color="primary"></v-radio>
                            <v-radio label="Retail Order" value="retail" color="primary"></v-radio>
                        </v-radio-group>
                    </v-col>
                </v-row>

                <!-- Date & Time Pickers -->
                <v-row class="mt-6" dense justify="center">
                    <v-col cols="12" md="6">
                        <v-menu v-model="menuDate" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template #activator="{ on, attrs }">
                                <v-text-field v-model="date" label="Select Date" prepend-inner-icon="mdi-calendar"
                                    readonly v-bind="attrs" v-on="on" outlined dense></v-text-field>
                            </template>
                            <v-date-picker v-model="date" :min="today" @input="menuDate = false"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-menu v-model="menuTime" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template #activator="{ on, attrs }">
                                <v-text-field v-model="time" label="Select Time" prepend-inner-icon="mdi-clock" readonly
                                    v-bind="attrs" v-on="on" outlined dense></v-text-field>
                            </template>
                            <v-time-picker v-model="time" @input="menuTime = false" format="ampm"></v-time-picker>
                        </v-menu>
                    </v-col>
                </v-row>

                <!-- Send Request Button -->
                <v-btn :disabled="!date || !time || !values || quantity < minQuantity" color="primary" large rounded
                    class="mt-3 mb-10" @click="sendRequest">
                    Send Request
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
export default {
    data() {
        return {
            values: null,
            items: ['Pizza', 'Burger', 'Biryani', 'Salad', 'Sushi', 'Dessert', 'Drinks'],
            quantity: 10,
            orderType: 'bulk',
            date: null,
            time: null,
            menuDate: false,
            menuTime: false,
            today: new Date().toISOString().substr(0, 10)
        }
    },
    computed: {
        minQuantity() {
            return this.orderType === 'bulk' ? 10 : 1;
        }
    },
    watch: {
        orderType() {
            if (this.quantity < this.minQuantity) {
                this.quantity = this.minQuantity;
            }
        }
    },
    methods: {
        sendRequest() {
            alert(`Order Sent!\nDish: ${this.values}\nQuantity: ${this.quantity}\nType: ${this.orderType}\nDate: ${this.date}\nTime: ${this.time}`);
        }
    }
}

</script>
