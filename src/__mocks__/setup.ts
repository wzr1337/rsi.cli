global.console = Object.assign(console, {
  log: jest.fn(),
});