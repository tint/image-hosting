<template>
  <div id="app">
    <div class="image-hosting">
      <ih-finder :menus="folders" style="height: 100%" />
    </div>
  </div>
</template>

<script>
import IhFinder from "@/components/IhFinder";

let id = 0;

const rand = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

const newLoader = (label, deep) => () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.floor(rand(6, 30));
      resolve(
        new Array(random).fill(null).map((_, i) => {
          return createFolder(`${label}-${deep}-${i + 1}`, deep);
        })
      );
    }, rand(1500, 3500));
  });
};

function createFolder(label, deep = 1) {
  const info = { value: ++id, label };
  if (deep < 5) info.loader = newLoader(label, deep + 1);
  const random = Math.floor(rand(1, 300));
  info.files = new Array(random).fill(null).map((_, i) => ({
    id: ++id,
    name: `random ride ${i + 1}.jpg`,
    path: "https://ckeditor.com/apps/ckfinder/3.5.2/core/connector/php/connector.php?command=Thumbnail&lang=zh-cn&langCode=zh-cn&type=Images&currentFolder=%2FAnimals%2F&hash=f635e3acdc080f11&fileName=goat.jpg&date=20210823063001&fileSize=226&size=150x150",
    created_at: "2021年8月23日 6:30 上午",
    size: `${(rand(1, 20) * 96.0).toString().split(".").shift()} KB`,
  }));
  // info.chosen = 0;
  return info;
}

export default {
  name: "App",
  components: { IhFinder },
  data() {
    return {
      folders: [
        createFolder("Files"),
        createFolder("Images"),
        createFolder("Videos"),
      ],
    };
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  background-color: #eee;
  box-sizing: border-box;
  padding: 40px 60px;

  &::after {
    display: block;
    content: "";
    clear: both;
  }
}

.image-hosting {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
