import moveRandomly from 'Util/moveRandomly';
export default class Person {
  constructor(position) {
    this.position = position;
  }
  move(occupiedSpots) {
    return moveRandomly(this.position);
  }
}
