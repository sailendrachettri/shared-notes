export const getMenuPosition = (x, y) => {
  const menuWidth = 180; // same as w-44
  const menuHeight = 160; // approximate height of menu

  const padding = 8;

  const maxX = window.innerWidth - menuWidth - padding;
  const maxY = window.innerHeight - menuHeight - padding;

  return {
    x: Math.min(x, maxX),
    y: Math.min(y, maxY),
  };
};
