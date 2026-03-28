declare module "nosleep.js" {
  // nosleep.js has no types in this project; provide a minimal declaration
  class NoSleep {
    enable(): void;
    disable(): void;
  }

  export default NoSleep;
}
