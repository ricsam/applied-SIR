import { randomInt } from 'Util/util.js';

export default class TimeInstance {
  people = [];
  /*
    type props = {
      people: Array,
      Healthy: Interface,
      Infected: Interface,
      time: number
    };
  */
  constructor(props) {
    Object.assign(this, props);
  }
  randomlyGeneratePeople({ numberOfInfected, numberOfPeople }) {
    const infectedIndices = [];
    while (infectedIndices.length < numberOfInfected) {
      let random = randomInt(0, numberOfPeople - 1);
      if (infectedIndices.indexOf(random) === -1) {
        infectedIndices.push(random);
      }
    }
    for (let i = 0; i < numberOfPeople; i++) {
      if (infectedIndices.indexOf(i) === i) {
        this.people.push(new this.Infected());
      } else {
        this.people.push(new this.Healthy());
      }
    }
  }
}
