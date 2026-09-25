export default defineContentScript({
  matches: ['*://*.geoguessr.com/*'],
  main() {
    console.log('Hello content.');
  },
});
