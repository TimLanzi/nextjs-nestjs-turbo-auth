export abstract class BaseEvent<T> {
  constructor(public readonly data: T) {}

  toString() {
    return JSON.stringify(this.data);
  }
}
