/* timeframe = 1 minute */

const buffer = document.createElement('canvas');
const width = 800;
const height = 600;
const maxSpeed = 3;
const diseaseRadius = 3;
const baseInfectionDuration = 180;
const baseImmunityDuration = 360;

buffer.width = width;
buffer.height = height;
document.body.appendChild(buffer);


const ctx = buffer.getContext('2d');

const xPositions = [];
const yPositions = [];
const immunityMatrix = []; // time ticking, of beeing immune
const infectionMatrix = []; // time ticking down, of infection
const personRadius = 3;

const numberOfPeople = 1200;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const infectionTimeRange = [];

for (let i = 0; i <= numberOfPeople; i++) {
  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(0);
}

/* push one infected */
xPositions.push(getRandomArbitrary(0, width));
yPositions.push(getRandomArbitrary(0, height));
immunityMatrix.push(0);
infectionMatrix.push(baseInfectionDuration);


function effectFuntion(radius) {
  if (radius === 0) {
    return 0;
  }
  if (radius >= diseaseRadius + personRadius) {
    return 1;
  }

  return radius / (diseaseRadius + personRadius);
}

const subways = [
  {
    x: 50,
    y: 50,
    r: 25
  }
];

const bindX = (x) => Math.min(Math.max(x, 0), width);
const bindY = (y) => Math.min(Math.max(y, 0), height);

function update() {

  const newXPositions = [];
  const newYPositions = [];
  const randomMovementMatrix = [];

  for (let i = 0; i < xPositions.length; i++) {
    const x = xPositions[i];
    const y = yPositions[i];
    for (let k = 0; k < subways.length; k++) {
      const subway = subways[k];
      if (Math.sqrt((subway.x - x)**2 + (subway.y - y)**2) < subway.r + personRadius) {

        let angle = Math.atan2( Math.abs(subway.y - y), Math.abs(subway.x - x) );
        if (y >= subway.y && x >= subway.x) angle += Math.PI / 2; /* move in negative x, move positive y */
        if (y >= subway.y && x < subway.x) angle += 0; /* move in positive x, positive y*/
        if (y < subway.y && x < subway.x) angle += Math.PI * 3/4; /* positive x, negative y*/
        if (y < subway.y && x >= subway.x) angle += Math.PI; /* negative x, negative y*/

        newXPositions[i] = bindX(maxSpeed * Math.cos(angle) + xPositions[i]);
        newYPositions[i] = bindY(maxSpeed * Math.sin(angle) + yPositions[i]);
      } else {
        randomMovementMatrix.push(i);
      }
    }
  }

  for (let i = 0; i < randomMovementMatrix.length; i++) {
    const angle = getRandomArbitrary(0, 2 * Math.PI);
    const speed = getRandomArbitrary(0, maxSpeed);
    const index = randomMovementMatrix[i];
    newXPositions[index] = bindX(speed * Math.cos(angle) + xPositions[i]);
    newYPositions[index] = bindY(speed * Math.sin(angle) + yPositions[i]);
  }

  const newImmunityMatrix = [];
  for (let i = 0; i < immunityMatrix.length; i++) {
    if (immunityMatrix[i] > 0) {
      newImmunityMatrix[i] = immunityMatrix[i] - 1;
    } else {
      newImmunityMatrix[i] = immunityMatrix[i];
    }
  }


  // console.log(newXPositions, newYPositions);

  const mightGetInfected = [];
  const newInfectionMatrix = [];

  for (let u = 0; u < infectionMatrix.length; u++) {
    const rootX = newXPositions[u];
    const rootY = newYPositions[u];

    /* special case as someone will become non-infeced after this*/
    if (infectionMatrix[u] === 1) {
      newImmunityMatrix[u] = baseImmunityDuration;
    }

    /* update the infection matrix */
    if (infectionMatrix[u] > 0) {
      newInfectionMatrix[u] = infectionMatrix[u] - 1;
    } else {
      newInfectionMatrix[u] = infectionMatrix[u];
    }

    if (newInfectionMatrix[u] !== 0) {
      inner:
      for (let i = 0; i < newXPositions.length; i++) {
        if (i === u || newImmunityMatrix[i] > 0) {
          continue inner;
        }
        const x = newXPositions[i];
        const y = newYPositions[i];
        const distance = Math.sqrt((x - rootX)**2, (y - rootY)**2);

        if (distance < diseaseRadius + personRadius) {
          let alreadyMightInfected = false;
          for (let k = 0; k < mightGetInfected.length; k++) {
            if (mightGetInfected[k].index === i) {
              mightGetInfected[k].distances.push(distance);
              alreadyMightInfected = true;
            }
          }
          if ( ! alreadyMightInfected ) {
            mightGetInfected.push({
              index: i,
              distances: [distance]
            });
          }
        }
      }
    }
  }

  console.log(mightGetInfected);
  for (let i = 0; i < mightGetInfected.length; i++) {
    const { index, distances } = mightGetInfected[i];
    const negativeProbs = distances.map(effectFuntion).map(o => 1 - o);
    const probability = 1 - negativeProbs.reduce((o, n) => o * n, 1);
    const infected = getRandomArbitrary(0, 1) <= probability;
    if (infected) {
      /* just got infected! */
      newInfectionMatrix[index] = baseInfectionDuration;
    } else {
      /* it is the same */
      newInfectionMatrix[index] = infectionMatrix[index];
    }
  }

  console.log(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix);

}
function render() {

}
tick();
// let time = new Date();
function tick() {
  update();
  render();
  // window.requestAnimationFrame(tick);
}

