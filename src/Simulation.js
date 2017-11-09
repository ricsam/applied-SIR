import TimeInstance from 'GameUnits/TimeInstance';
import HealthyPerson from 'Config/HealthyPerson';
import InfectedPerson from 'Config/InfectedPerson';
import {randomInt} from 'Util/util';


export default class Simulation { /* TimeInstance collection */

  frames = [];

  /* defaults */
  bh = 0;
  bw = 0;
  peopleSize = 0; /* in pixels */
  matrixNumRows = 0;
  matrixNumCols = 0;
  numberOfPeople = 0;
  frameBuffer = 0;
  initialNumberOfInfected = 0;

  randomlyGenerateInitialPeople() {
    const infectedIndices = [];
    const people = [];
    while (infectedIndices.length < this.initialNumberOfInfected) {
      let random = randomInt(0, this.numberOfPeople - 1);
      if (infectedIndices.indexOf(random) === -1) {
        infectedIndices.push(random);
      }
    }
    for (let i = 0; i < this.numberOfPeople; i++) {
      if (infectedIndices.indexOf(i) === i) {
        /* infected */
        people.push({
          suseptible: false,
          immunne: false,
          effect: 1
        });
      } else {
        /* healthy */
        people.push({
          suseptible: true,
          immunne: false,
          effect: 0
        });
      }
    }
  }
  generateInitialFrame() {

    const people = this.randomlyGenerateInitialPeople();
    this.frames.push(new TimeInstance(this.people, ['suseptible', 'immunne', 'effect']));
  }

  getLatestFrame() {
    return this.frames[this.frames.length - 1];
  }

  calculateNextFrame() {
    const lastFrame = this.getLatestFrame();
    this.frames.push(
      lastFrame.next()
    );
  }
}


/* What is the plan */
