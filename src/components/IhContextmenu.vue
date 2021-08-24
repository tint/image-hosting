<template>
  <div class="ih-contextmenu" @contextmenu.prevent.stop="">
    <ul>
      <li v-for="(menu, i) in menus" :key="i">
        <button
          type="button"
          v-if="menu != null"
          class="ih-contextmenu-command"
          @click.prevent.stop="$emit('click', menu.key, data)"
          ref="command"
        >
          <span class="ih-contextmenu-icon" v-if="hasIcon">
            <ih-icon :name="menu.icon" v-if="menu.icon" />
          </span>
          <span class="ih-contextmenu-text">{{ menu.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import IhIcon from "@/components/IhIcon";
import { alignPoint } from "dom-align";
import { getScrollContainer } from "@/components/helpers";

export default {
  name: "IhContextmenu",

  components: {
    IhIcon,
  },

  props: {
    menus: {
      type: Array,
      required: true,
      validator(menus) {
        return menus.every(
          (m) => m == null || (m.label != null && m.key != null)
        );
      },
    },
    points: {
      type: Object,
      required: true,
    },
    // 附加数据
    data: {},
  },

  computed: {
    hasIcon() {
      return this.menus.some((m) => m?.icon != null);
    },
  },

  methods: {
    requestLayout() {
      alignPoint(this.$el, this.points, {
        points: ["tl", "tr"],
        overflow: { adjustX: true, adjustY: true },
        useCssTransform: true,
      });
    },
    requestFocus() {
      const commands = this.$refs.command;
      if (!commands?.length) return;
      commands[0].focus();
    },
    bindKeyboardEvent() {
      const window = this.$el.ownerDocument.defaultView;
      const tabKeydownListener = (event) => {
        if (event.code === "Escape") {
          this.$emit("escape");
          this.$emit("close");
        }
      };
      window.addEventListener("keydown", tabKeydownListener, true);
      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("keydown", tabKeydownListener, true);
      });
    },
    bindScrollEvent() {
      const container =
        getScrollContainer(this.$el) ?? this.$el.ownerDocument.defaultView;
      const scrollListener = () => {
        // FIXME：利用设置 scrollTop 值来检测元素是否可滚动，导致的 BUG，有点莫名奇妙
        // 解决方法：忽略掉第一次触发的滚动事件。
        // 判断可滚动参考：https://segmentfault.com/a/1190000021934483
        if (this.closeByScroll) {
          this.$emit("close");
        } else {
          this.closeByScroll = true;
        }
      };
      container.addEventListener("scroll", scrollListener, true);
      this.$once("hook:beforeDestroy", () => {
        container.removeEventListener("scroll", scrollListener, true);
      });
    },
  },

  mounted() {
    this.requestLayout();
    this.requestFocus();
    this.bindKeyboardEvent();
    this.bindScrollEvent();
  },

  updated() {
    this.requestLayout();
  },
};
</script>

<style lang="scss" scoped>
.ih-contextmenu {
  z-index: 100;
  position: absolute;
  box-shadow: 0 0 4px rgb(0 0 0 / 15%);
  border: 1px solid #d7dcdf;
  outline: 0;
  background-color: #fff;
  color: #373a3c;
  text-shadow: 0 1px 0 #f3f3f3;
  font-size: 12.5px;
  user-select: none;
  box-sizing: border-box;
  padding: 0;
  border-radius: 8px;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 0;
    padding: 2px 2px;
    border: 0;
    outline: none;

    &:empty {
      padding: 1px 6px;

      &::before {
        display: block;
        content: "";
        width: 100%;
        height: 1px;
        background-color: #d7dcdf;
        transform: scaleY(0.5);
      }
    }
  }

  &-command {
    position: relative;
    display: flex;
    align-items: center;
    text-align: left;
    overflow: hidden;
    width: 100%;
    appearance: none;
    border: none;
    padding: 0;
    margin: 0;
    transition: background-color 0.2s;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 6px;
    outline: none;
    min-width: 8em;

    &:focus::before {
      z-index: 2;
      position: absolute;
      display: block;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-shadow: inset 0 0 0 2px #0a90eb;
      border-radius: inherit;
    }

    &:hover {
      background-color: #eee;
    }
  }

  .ih-contextmenu-icon {
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 32px;
  }

  .ih-contextmenu-text {
    z-index: 1;
    display: block;
    padding: 0 12px;
    color: initial;
    overflow: hidden;
    line-height: 32px;
    flex: 1;
  }
}
</style>
