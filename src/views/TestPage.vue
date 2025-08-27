<template>
  <v-app class="mx-0 px-0">
    <div class="food-background">
      <div class="emoji-grid"></div>
      <v-main>
        <HomePage />
      </v-main>

      
    </div>
  </v-app>
</template>

<script>
import HomePage from './HomePage.vue';

export default {
  components: { HomePage },
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
  position: absolute; /* absolute inside food-background */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 50px);
  grid-auto-rows: 50px;
  pointer-events: none; /* allow clicks through emojis */
  z-index: 0; /* behind content */
  opacity: 0.035;
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
  z-index: 1; /* ensures content is above emojis */
  padding: 2rem;
}
</style>
