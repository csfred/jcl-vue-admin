let timer = null;
export default (fn, time = 200) => {
  clearTimeout(timer);
  setTimeout(() => {
    timer = setTimeout(() => {
      fn();
    }, time);
  });
};