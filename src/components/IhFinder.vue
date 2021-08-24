<template>
  <div>
    <div
      class="ih-finder"
      @click="closeContextmenu"
      @contextmenu.prevent="closeContextmenu"
    >
      <header class="ih-finder-header">
        <ih-button icon="upload" text="上传" />
        <ih-button icon="folder-plus" text="新建文件夹" />
      </header>
      <div class="ih-finder-body">
        <aside class="ih-finder-sidebar">
          <ih-menu
            :menus="ensuredMenus"
            :focused="menuData.focused"
            @click="onMenuClick"
            @contextmenu="onShowMenuContextmenu"
          />
          <transition name="fade">
            <ih-contextmenu
              v-if="menuData.contextmenu"
              style="position: absolute"
              :menus="menuData.contextmenu.menus"
              :points="menuData.contextmenu.points"
              @click="onMenuContextmenuCommand"
              @close="closeMenuContextmenu"
            />
          </transition>
        </aside>
        <main class="ih-finder-content">
          <ih-thumb
            v-for="f in files"
            :key="f.id"
            :name="f.name"
            :url="f.path"
            :time="f.created_at"
            :size="f.size"
            :selected="isSelectedThumb(f)"
            :class="{ 'is-focused': isFocusedThumb(f) }"
            @click="onClickThumb(f)"
            @contextmenu="onShowThumbContextmenu(f, $event)"
          />
          <transition name="fade">
            <ih-contextmenu
              v-if="thumbData.contextmenu"
              :menus="thumbData.contextmenu.menus"
              :points="thumbData.contextmenu.points"
              @click="onThumbContextmenuCommand"
              @close="closeThumbContextmenu"
            />
          </transition>
        </main>
      </div>
      <footer class="ih-finder-footer" />
    </div>
  </div>
</template>

<script>
import IhMenu from "@/components/IhMenu";
import IhButton from "@/components/IhButton";
import IhThumb from "@/components/IhThumb";
import IhContextmenu from "@/components/IhContextmenu";

export default {
  name: "IhFinder",
  components: { IhContextmenu, IhThumb, IhButton, IhMenu },
  props: {
    menus: Array,
  },
  data() {
    return {
      ensuredMenus: this.menus,
      thumbData: {
        selected: [],
        focused: null,
        contextmenu: null,
      },
      menuData: {
        focused: null, // menu.value
        selected: null, // [parentMenu, childMenu, ...]
        contextmenu: null,
      },
    };
  },
  computed: {
    files() {
      let current = this.menuData.selected ?? [];
      current = current[current.length - 1];
      if (current == null) return [];
      return current.source.files ?? [];
    },
  },
  methods: {
    isSelectedThumb(file) {
      return this.thumbData.selected.includes(file.id);
    },
    isFocusedThumb(file) {
      return this.thumbData.focused === file.id;
    },
    isSelectedMenu(menu) {
      let current = this.menuData.selected ?? [];
      current = current[current.length - 1];
      if (current.length == null) return false;
      return current.value === menu.value;
    },
    isFocusedMenu(menu) {
      return this.menuData.focused === menu.value;
    },

    onMenuClick(path) {
      this.closeContextmenu();
      this.menuData.selected = path;
      this.menuData.focused = path[path.length - 1].value;
    },
    onShowMenuContextmenu({ event, path }) {
      this.closeThumbContextmenu();
      this.menuData.contextmenu = {
        menus: [
          { label: "创建子文件夹", key: "new folder" },
          { label: "重命名", key: "rename" },
          { label: "删除", key: "delete" },
        ],
        points: {
          clientX: event.clientX,
          clientY: event.clientY,
        },
      };
      console.log({ event, path });
    },
    onMenuContextmenuCommand(key) {
      this.closeMenuContextmenu();
      console.log({ key });
    },
    closeMenuContextmenu() {
      this.menuData.contextmenu = null;
    },
    clearFocusedMenu() {
      this.menuData.focused = null;
    },

    onClickThumb(e) {
      this.closeContextmenu();
      const { selected } = this.thumbData;
      const index = selected.indexOf(e.id);
      if (index >= 0) {
        this.thumbData.focused = null;
        selected.splice(index, 1);
      } else {
        this.thumbData.focused = e.id;
        selected.push(e.id);
      }
    },
    onShowThumbContextmenu(file, event) {
      this.closeMenuContextmenu();
      this.thumbData.focused = file.id;
      this.thumbData.contextmenu = {
        menus: [
          { label: "查看", key: "lookup" },
          { label: "下载", key: "download" },
          null,
          { label: "编辑", key: "edit" },
          { label: "重命名", key: "rename" },
          null,
          { label: "删除", key: "delete" },
        ],
        points: {
          clientX: event.clientX,
          clientY: event.clientY,
        },
      };
    },
    onThumbContextmenuCommand(key) {
      this.closeThumbContextmenu();
      console.log({ key });
    },
    closeThumbContextmenu() {
      this.thumbData.contextmenu = null;
    },
    clearFocusedThumb() {
      this.thumbData.focused = null;
    },

    closeContextmenu() {
      this.clearFocusedThumb();
      this.closeThumbContextmenu();
      this.closeMenuContextmenu();
    },
  },
};
</script>

<style lang="scss" scoped>
.ih-finder {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  font-size: 14px;
  height: 100%;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  &-header {
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: #f7f8f9;
    border: 1px solid #d7dcdf;
    color: #373a3c;
    text-shadow: 0 1px 0 #eee;
    font-weight: bold;
    box-sizing: border-box;

    > :not(:first-child) {
      margin-left: 12px;
    }
  }

  &-body {
    flex: 1;
    display: flex;
    box-sizing: border-box;
    height: calc(100% - 58px - 28px);
  }

  &-sidebar {
    width: 14em;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f7f8f9;
    border-left: 1px solid #d7dcdf;
    border-right: 1px solid #d7dcdf;
    box-sizing: border-box;
  }

  &-content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
    border-right: 1px solid #d7dcdf;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    color: #373a3c;
    text-shadow: 0 1px 0 #f3f3f3;
    padding: 5px;
  }

  &-footer {
    height: 28px;
    border: 1px solid #d7dcdf;
    background-color: #f7f8f9;
    box-sizing: border-box;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
