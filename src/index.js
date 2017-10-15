import 'DOM/setBuffer';
import Simulation from './Simulation';
import * as bufferSize from 'Config/bufferSize';

class Version1 extends Simulation {
  bh = 800;
  bw = 600;
  peopleSize = 1; /* in pixels */
  matrixNumRows = this.bh / this.peopleSize;
  matrixNumCols = this.bw / this.peopleSize;
  numberOfPeople = this.matrixNumCols * this.matrixNumRows;
  frames = [];
  frameBuffer = 2;

  initialNumberOfInfected = 1;

  constructor(props) {
    super(props);
    this.generateInitialFrame();
  }

  test() {}
}

const simulation = new Version1();

// setUpData(true);

// function update() {}

// function render() {}

// let t = 0;  days
// function tick() {
//   update();
//   render();
//   t++;
// }

// setInterval(tick, 500);
