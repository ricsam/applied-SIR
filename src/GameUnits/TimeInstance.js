import { randomInt } from 'Util/util.js';


/* Generate position for each frame
  1: [1, 2, 3, 4] // length of number of people
  2: [2, 1, 4, 3] // length of number of people
*/
/* Generate change in effect
  1: [0, 0, 0, 1] // length of number of people
  2: [0, 0, 1, 1] // length of number of people
*/
/* Generate suceptible
  1: [true, true, true, true] // length of number of people
  2: [true, true, false, true] // length of number of people
*/


export default class TimeInstance {
  people = []
  /*
    type props = {
      people: Array,
      Healthy: Interface,
      Infected: Interface,
      time: number
    };
  */

  generateNext() {
    const occupiedSpots = [];
    const moveRandomly = [];
    for (let i = 0, len = this.people.length; i < len; i++) {
      const guy = this.people[i];
      if(guy.hasPredefinedMovement) {
        occupiedSpots.push(
          guy.move()
        );
      } else {
        moveRandomly.push(i);
      }
    }
    for (let i = 0, len = moveRandomly.length; i < len; i++) {
      const guy = this.people[moveRandomly[i]];
      guy.move({
        avoid: occupiedSpots
      });
    }
  }
}
