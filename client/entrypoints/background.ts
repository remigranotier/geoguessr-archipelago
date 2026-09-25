export default defineBackground(() => {
  console.log('Hello background2!', { id: browser.runtime.id });
});
