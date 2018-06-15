class Counter {
  counter: number;

  constructor(counter: number = 0) {
    this.counter = counter;
  }

  generate = () => this.counter++;
}

export default Counter;
