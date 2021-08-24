<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2048 2048"
    class="ih-icon"
    focusable="false"
  >
    <path :d="path" />
  </svg>
</template>

<script>
import icons from "./ih-icons.json";

export default {
  name: "IhIcon",

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    path() {
      return icons[this.name];
    },
  },
};
</script>

<style scoped>
.ih-icon {
  display: inline-block;
  vertical-align: -0.125em;
  width: 1em;
  height: 1em;
}
</style>
