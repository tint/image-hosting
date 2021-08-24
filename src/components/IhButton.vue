<template>
  <button class="ih-button" :disabled="disabled">
    <ih-icon :name="icon" v-if="icon" />
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script>
import IhIcon from "@/components/IhIcon";
export default {
  name: "IhButton",

  components: {
    IhIcon,
  },

  props: {
    icon: String,
    text: String,
    disabled: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.ih-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  font-size: 12.5px;
  vertical-align: middle;
  line-height: 32px;
  height: 32px;
  cursor: pointer;
  appearance: none;
  user-select: none;
  text-shadow: 0 1px 0 #f3f3f3;
  color: #373a3c;
  background-color: #fff;
  border: 1px solid #d7dcdf;
  border-radius: 0.3125em;

  &:hover {
    background-color: #f7f8f9;
    border-color: #d7dcdf;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default !important;
    pointer-events: none;
  }

  .ih-icon {
    margin-right: 4px;
  }
}
</style>
