export default (selector: string): Promise<Element> => {
  return new Promise(resolve => {
    const id = setInterval(() => {
      const elem = document.querySelector(selector);
      if (elem) {
        clearInterval(id);
        resolve(elem);
      }
    }, 300);
  });
};