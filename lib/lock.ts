class Lock {
  private promise: Promise<void>;

  private resolve: (() => void) | undefined;

  constructor() {
    this.promise = Promise.resolve();
    this.resolve = undefined;
  }

  await() {
    return this.promise;
  }

  acquire() {
    this.promise = new Promise<void>((resolve) => (this.resolve = resolve));
  }

  release() {
    if (this.resolve) {
      this.resolve();
    }
  }
}

export default Lock;
