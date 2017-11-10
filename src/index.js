/* timeframe = 1 minute */

const buffer = document.createElement('canvas');
const width = 800;
const height = 600;
const maxSpeed = 3;
const diseaseRadius = 10;
const baseInfectionDuration = 180;
const baseImmunityDuration = 360;
const personRadius = 3;
const numberOfPeople = 1200;

buffer.width = width;
buffer.height = height;
document.body.appendChild(buffer);


const ctx = buffer.getContext('2d');

function getInitialFrame() {
  const xPositions = [];
  const yPositions = [];
  const immunityMatrix = []; // time ticking, of beeing immune
  const infectionMatrix = []; // time ticking down, of infection

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

  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(baseInfectionDuration);

  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(baseInfectionDuration);

  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(baseInfectionDuration);

  const subwayPositions = [0, 1];


  return [xPositions, yPositions, infectionMatrix, immunityMatrix, subwayPositions];
}
const subways = [
  {
    x: 50,
    y: 50,
    r: 25
  },
  {
    x: 150,
    y: 150,
    r: 50
  }
];


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function effectFuntion(radius) {
  if (radius === 0) {
    return 0;
  }
  if (radius >= diseaseRadius + personRadius) {
    return 1;
  }

  return 0.1 * (radius / (diseaseRadius + personRadius));
}



const bindX = (x) => Math.min(Math.max(x, 0), width);
const bindY = (y) => Math.min(Math.max(y, 0), height);

function update(xPositions, yPositions, infectionMatrix, immunityMatrix, subways) {



  const newXPositions = [];
  const newYPositions = [];
  const randomMovementMatrix = [];

  for (let i = 0; i < xPositions.length; i++) {
    const x = xPositions[i];
    const y = yPositions[i];
    let isPredetermied = false;
    for (let k = 0; k < subways.length; k++) {
      const subway = subways[k];
      if (Math.sqrt((subway.x - x)**2 + (subway.y - y)**2) < subway.r + personRadius) {

        let angle = Math.atan2( Math.abs(subway.y - y),  Math.abs(subway.x - x) );
        if (y >= subway.y && x >= subway.x) angle += Math.PI; /* move in negative x, move negative y */
        if (y >= subway.y && x < subway.x) angle += Math.PI * 3/4; /* move in positive x, negative y*/
        if (y < subway.y && x < subway.x) angle += 0; /* positive x, positive y*/
        if (y < subway.y && x >= subway.x) angle += Math.PI / 2; /* negative x, positive y*/


        newXPositions[i] = bindX(maxSpeed * Math.cos(angle) + x);
        newYPositions[i] = bindY(maxSpeed * Math.sin(angle) + y);
        isPredetermied = true;
        // console.log(x, y);
      }
    }
    if ( ! isPredetermied ) {
      const angle = getRandomArbitrary(0, 2*Math.PI);
      const speed = getRandomArbitrary(0, maxSpeed);
      newXPositions[i] = bindX(speed * Math.cos(angle) + x);
      newYPositions[i] = bindY(speed * Math.sin(angle) + y);
    }
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
        const distance = Math.sqrt((x - rootX)**2 + (y - rootY)**2);

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

  return [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newSubways];

}
function render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix) {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < newXPositions.length; i++) {
    const x = newXPositions[i];
    const y = newYPositions[i];
    ctx.beginPath();
    ctx.arc(x, y, personRadius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    if (newInfectionMatrix[i]) {
      ctx.fillStyle = 'red';
      ctx.fill();
    }
    if (newImmunityMatrix[i]) {
      ctx.fillStyle = 'purple';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, diseaseRadius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'blue';
    ctx.stroke();

  }
  for (let k = 0; k < subways.length; k++) {
    const {x, y, r} = subways[k];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'green';
    ctx.stroke();
  }
}
// let time = new Date();
let args = getInitialFrame();
render(...args);

function tick() {
  args = update(...args);
  render(...args);
  // window.requestAnimationFrame(tick);
}

window.tick = tick;

