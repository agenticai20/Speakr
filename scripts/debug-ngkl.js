const { GlobalKeyboardListener } = require('node-global-key-listener');

console.log('Press any keys — watching event names. Ctrl+C to quit.\n');

const listener = new GlobalKeyboardListener();

listener.addListener((event) => {
  console.log(`${event.state.padEnd(5)} | name: "${event.name}" | vKey: ${event.vKey}`);
});

process.on('SIGINT', () => { listener.kill(); process.exit(0); });
