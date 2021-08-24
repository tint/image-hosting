<template>
  <ul class="ih-menus" v-if="menus.length">
    <li v-for="menu in ensuredMenus" :key="menu.value">
      <button
        type="button"
        class="ih-menus-button"
        :class="{ 'is-focused': menu.value === focused }"
        :style="`padding-left: ${deep}em`"
        @click.prevent.stop="handleButtonClick(menu)"
        @contextmenu.prevent.stop="handleContextmenu(menu, $event)"
      >
        <slot v-bind="{ menu, unfoldValues }">
          <ih-icon :name="iconName(menu)" />
          <span>{{ menu.label }}</span>
          <ih-icon
            v-if="hasSubMenus(menu)"
            :name="indicatorName(menu)"
            :class="{ 'is-loading': menu.loading }"
            class="ih-submenus-indicator"
          />
        </slot>
      </button>
      <ih-menu
        class="ih-submenus"
        :class="isUnfold(menu) ? 'is-unfold' : 'is-fold'"
        :deep="deep + 1"
        :menus="menu.children"
        :focused="focused"
        @click="handleSubmenuClick(menu, $event)"
        @contextmenu="handleSubmenuContextmenu(menu, $event)"
        v-if="hasSubMenus(menu, false)"
      />
    </li>
  </ul>
</template>

<script>
import IhIcon from "@/components/IhIcon";

const normalize = (source) => {
  const { label, value, children: submenus, loading = false, loader } = source;
  const children = submenus?.map(normalize);
  return { label, value, children, loading, loader, source };
};

export default {
  name: "IhMenu",

  components: {
    IhIcon,
  },

  props: {
    deep: {
      type: Number,
      default: 1,
    },
    focused: {
      // for menu.value
    },
    menus: {
      type: Array,
      required: true,
      validator(menus) {
        return menus.every((menu) => {
          if (menu == null || typeof menu !== "object") return false;
          if (menu.label == null || menu.value == null) return false;
          if (!menu.children && !menu.loader) return true;
          if (menu.children != null) return Array.isArray(menu.children);
          if (menu.loader != null) return typeof menu.loader === "function";
          return true;
        });
      },
    },
  },

  data() {
    return {
      ensuredMenus: this.menus.map(normalize),
      unfoldValues: [],
      currentValue: null,
    };
  },

  methods: {
    isUnfold(menu) {
      return this.unfoldValues.includes(menu.value);
    },
    hasSubMenus(menu, asLoader = true) {
      if ((menu.children?.length ?? 0) > 0) return true;
      return asLoader && menu.loader != null;
    },
    iconName(menu) {
      const isUnfold = this.isUnfold(menu);
      return isUnfold ? "folder-open" : "folder";
    },
    indicatorName(menu) {
      if (menu.loading) return "refresh";
      const isUnfold = this.isUnfold(menu);
      return isUnfold ? "chevron-down" : "chevron-right";
    },
    async loadSubmenus(menu) {
      let list;
      try {
        menu.loading = true;
        list = await menu.loader();
        if (!Array.isArray(list)) {
          list = [];
        }
      } catch (e) {
        list = [];
      } finally {
        menu.children = list;
        menu.loading = false;
      }
    },
    handleButtonClick(menu) {
      this.$emit("click", [menu]);
      if (!this.hasSubMenus(menu)) {
        this.currentValue = menu.value;
        return;
      }
      const index = this.unfoldValues.indexOf(menu.value);
      if (index === -1) {
        this.unfoldValues.push(menu.value);
        this.$emit("unfold", menu);
        if (!this.hasSubMenus(menu, false) && !menu.loading) {
          this.loadSubmenus(menu);
        }
      } else {
        this.unfoldValues.splice(index, 1);
        this.$emit("fold", menu);
      }
    },
    handleContextmenu(menu, event) {
      this.$emit("contextmenu", { event, path: [menu] });
    },
    handleSubmenuClick(menu, path) {
      this.$emit("click", [menu, ...path]);
    },
    handleSubmenuContextmenu(menu, { event, path }) {
      this.$emit("contextmenu", { event, path: [menu, ...path] });
    },
  },
};
</script>

<style lang="scss" scoped>
.ih-menus {
  list-style: none;
  padding: 0;
  margin: 0;

  &.is-fold {
    display: none;
  }

  &-button {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    appearance: none;
    user-select: none;
    border: none;
    outline: none;
    line-height: 32px;
    background-color: transparent;
    cursor: pointer;

    &:focus {
      box-shadow: inset 0 0 0 2px #0a90eb;
    }

    &.is-focused {
      background-color: #fff;
    }

    > span {
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: left;
    }

    .ih-icon {
      &:first-child {
        margin-right: 8px;
        font-size: 1.2em;
      }

      &:last-child {
        margin-left: 8px;
      }

      &.ih-submenus-indicator {
        font-size: 0.8em;
        opacity: 0.75;

        &.is-loading {
          animation: rotating 0.618s infinite linear;
        }
      }
    }

    &:hover {
      background-color: #f2f2f2;
    }
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
