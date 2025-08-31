<template>
    <v-app class="mx-0 px-0">
        <div class="food-background">
            <div class="emoji-grid"></div>
            <v-main>
                <DishesSlider :title="'Recommended Dishes'" :item="'all'" />
                <v-divider class="mx-6 mb-8"></v-divider>
                <DishesSlider :title="'Shahi Biryani'" :item="'biryani'" />
                <v-divider class="mx-6 mb-8"></v-divider>
                <DishesSlider :title="'Popular Pizza'" :item="'pizza'" />
                <v-divider class="mx-6 mb-8"></v-divider>
            </v-main>
        </div>
    </v-app>
</template>

<script>
import DishesSlider from '../components/DishesSlider.vue';

export default {
    components: { DishesSlider },
    mounted() {
        const emojis = ["🍕", "🍔", "🍛", "🥗", "🍜", "🍩", "🍣"];
        const grid = document.querySelector(".emoji-grid");

        const rows = Math.ceil(window.innerHeight / 50);
        const cols = Math.ceil(window.innerWidth / 50);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const span = document.createElement("span");
                span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                span.classList.add("emoji");
                grid.appendChild(span);
            }
        }
    }
};
</script>

<style scoped>
.food-background {
    position: relative;
    min-height: 100vh;
    width: 100%;
    background-color: #fefcf5;
    overflow: hidden;
}

/* Emoji background behind everything */
.emoji-grid {
    position: fixed;
    /* absolute inside food-background */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 50px);
    grid-auto-rows: 50px;
    pointer-events: none;
    /* allow clicks through emojis */
    z-index: 0;
    /* behind content */
    opacity: 0.05;
}

.emoji {
    font-size: 24px;
    opacity: 0.1;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Content above emojis */
.content,
HomePage {
    position: relative;
    z-index: 1;
    /* ensures content is above emojis */
    padding: 2rem;
}
</style>
