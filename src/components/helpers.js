/**
 * 判断元素是否可以滚动
 *
 * @link https://segmentfault.com/a/1190000021934483
 *
 * @param {Node} el
 * @return {boolean}
 */
export function isScrollable(el) {
  if (!(el instanceof HTMLElement)) {
    console.log("fuck off");
    return false;
  }

  if (el.scrollTop > 0) {
    return true;
  }

  el.scrollTop++;
  // 元素不能滚动的话，scrollTop 设置不会生效，还会置为 0
  const top = el.scrollTop;
  // 重置滚动位置
  top && (el.scrollTop = 0);
  return top > 0;
}

/**
 * 获取滚动容器
 * @param el
 * @return {HTMLElement|null}
 */
export function getScrollContainer(el) {
  let container = el.parentNode;
  while (container) {
    if (isScrollable(container)) {
      return container;
    }
    container = container.parentNode;
  }
  return null;
}
