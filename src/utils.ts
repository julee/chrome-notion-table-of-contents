export const waitFor = (selector: string): Promise<NodeListOf<HTMLElement>> => {
  return new Promise(resolve => {
    const getElements = (cb = () => {}) => {
      const elems = document.querySelectorAll<HTMLElement>(selector);
      if (elems.length > 0) {
        cb();
        resolve(elems);
      }
    };
    getElements();

    const id = setInterval(() => {
      getElements(() => {
        clearInterval(id);
      });
    }, 300);
  });
};