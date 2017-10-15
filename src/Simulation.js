import TimeInstance from './GameUnits/TimeInstance';
import HealthyPerson from './Config/HealthyPerson';
import InfectedPerson from './Config/InfectedPerson';

class Moment extends TimeInstance {
  constructor(props) {
    super(props);
    console.log(this);
  }
}

export default class Simulation {
  generateInitialFrame() {
    const { initialNumberOfInfected, numberOfPeople } = this;
    const now = new Moment({
      time: 0,
      Healthy: HealthyPerson,
      Infected: InfectedPerson,
    });

    now.randomlyGeneratePeople({
      numberOfPeople,
      numberOfInfected: initialNumberOfInfected,
    });

    this.frames[0] = [];
    this.frames[0].push();
  }

  calculateNextFrame() {}
}
