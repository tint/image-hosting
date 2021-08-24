<template>
  <div
    class="ih-thumb"
    :class="{ 'is-selected': selected }"
    draggable="true"
    @click.stop="$emit('click', $event)"
    @contextmenu.prevent.stop="$emit('contextmenu', $event)"
  >
    <img :src="url" :alt="name" draggable="true" />
    <div class="ih-thumb-info">
      <h2 :title="name" dir="auto">{{ name }}</h2>
      <p>
        <small>{{ time }}</small>
        <br />
        <small>{{ size }}</small>
      </p>
    </div>
    <div class="ih-thumb-check" />
  </div>
</template>

<script>
export default {
  name: "IhThumb",
  props: {
    selected: Boolean,
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.ih-thumb {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  overflow: hidden;
  margin: 5px;
  background-color: #f7f8f9;
  cursor: pointer;
  box-sizing: border-box;

  &::before {
    z-index: 4;
    position: absolute;
    display: block;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  img {
    z-index: 0;
    width: 100%;
    height: auto;
  }

  &-info {
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 1;
    padding: 8px !important;
    margin: 0;
    height: 54px;
    background-color: #f7f8f9;
    font-size: 14px !important;
    color: #373a3c;
    opacity: 1;
    box-sizing: border-box;
    transition: padding 200ms ease-in-out;

    h2,
    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: inherit;
    }

    h2 {
      margin: 0 auto 3px;
      font-size: 0.85em;
      font-weight: 400;
    }

    p {
      font-size: 0.62em;
      color: #687982;
      margin: 0;
    }
  }

  &-check {
    pointer-events: none;
    z-index: 3;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 48px;
    height: 64px;
    background-color: #0a90eb;
    transform: rotate(45deg) translate(33px, 5px);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;

    &::before,
    &::after {
      position: absolute;
      display: block;
      content: "";
      width: 20%;
      height: 30%;
      top: 35%;
      left: 8%;
    }

    &::before {
      z-index: 2;
      background-color: #0a90eb;
      transform: translate3d(-2px, -2px, 0);
    }

    &::after {
      background-color: white;
      z-index: 1;
    }
  }

  &.is-focused::before,
  &.is-selected::before {
    border-color: #0a90eb;
  }

  &.is-selected &-check {
    visibility: visible;
    opacity: 1;
  }
}
</style>
