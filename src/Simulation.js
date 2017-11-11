function getRandomArbitrary(min, max) {
  const bound = Math.random() * (max - min);
  return bound + min;
}

export default class Simulation {
  constructor(_config) {
    this.width = _config.width;
    this.height = _config.height;
    this.maxSpeed = _config.maxSpeed;
    this.diseaseRadius = _config.diseaseRadius;
    this.baseInfectionDuration = _config.baseInfectionDuration;
    this.baseImmunityDuration = _config.baseImmunityDuration;
    this.personRadius = _config.personRadius;
    this.numberOfPeople = _config.numberOfPeople;
    this.subways = _config.subways;

    this.probabilityOfBecommingImmuneElseDie = 0.8;
    this.trainDepartureInterval = 40;
  }

  getInitialFrame = () => {
    const xPositions = [];
    const yPositions = [];
    const immunityMatrix = []; // time ticking, of beeing immune
    const infectionMatrix = []; // time ticking down, of infection
    const deathMatrix = [];
    const inversedPredetermied = [];

    for (let i = 0; i <= this.numberOfPeople; i += 1) {
      xPositions.push(getRandomArbitrary(0, this.width));
      yPositions.push(getRandomArbitrary(0, this.height));
      immunityMatrix.push(0);
      infectionMatrix.push(0);
      deathMatrix.push(false);
      inversedPredetermied.push(0);
    }

    /* push one infected */
    xPositions.push(getRandomArbitrary(0, this.width));
    yPositions.push(getRandomArbitrary(0, this.height));
    immunityMatrix.push(0);
    infectionMatrix.push(this.baseInfectionDuration);
    deathMatrix.push(false);
    inversedPredetermied.push(0);

    xPositions.push(getRandomArbitrary(0, this.width));
    yPositions.push(getRandomArbitrary(0, this.height));
    immunityMatrix.push(0);
    infectionMatrix.push(this.baseInfectionDuration);
    deathMatrix.push(false);
    inversedPredetermied.push(0);

    xPositions.push(getRandomArbitrary(0, this.width));
    yPositions.push(getRandomArbitrary(0, this.height));
    immunityMatrix.push(0);
    infectionMatrix.push(this.baseInfectionDuration);
    deathMatrix.push(false);
    inversedPredetermied.push(0);

    xPositions.push(getRandomArbitrary(0, this.width));
    yPositions.push(getRandomArbitrary(0, this.height));
    immunityMatrix.push(0);
    infectionMatrix.push(this.baseInfectionDuration);
    deathMatrix.push(false);
    inversedPredetermied.push(0);

    return [
      xPositions,
      yPositions,
      infectionMatrix,
      immunityMatrix,
      deathMatrix,
      this.trainDepartureInterval,
      inversedPredetermied,
    ];
  }

  effectFuntion = radius => {
    if (radius === 0) {
      return 0;
    }
    if (radius >= this.diseaseRadius + this.personRadius) {
      return 1;
    }

    return 1 * (radius / (this.diseaseRadius + this.personRadius));
  };

  bindX = x => Math.min(Math.max(x, 0), this.width);
  bindY = y => Math.min(Math.max(y, 0), this.height);

  update(xPositions, yPositions, infectionMatrix, immunityMatrix, deathMatrix, trainDepartureCountdown, inversedPredetermied) {
    const newXPositions = [];
    const newYPositions = [];
    const newDeathMatrix = deathMatrix.slice(0);
    const newInversedPredetermied = inversedPredetermied.slice(0);

    let newTrainDepartureCountdown = trainDepartureCountdown - 1;

    for (let i = 0; i < xPositions.length; i += 1) {
      if (newDeathMatrix[i]) {
        newXPositions[i] = xPositions[i];
        newYPositions[i] = yPositions[i];
        continue; // eslint-disable-line no-continue
      }

      const x = xPositions[i];
      const y = yPositions[i];
      let isPredetermied = false;
      for (let k = 0; k < this.subways.length; k += 1) {
        const subway = this.subways[k];
        if (
          Math.sqrt((subway.x - x) ** 2 + (subway.y - y) ** 2) <
          subway.r + this.personRadius
        ) {

          if (newTrainDepartureCountdown === 0) {
            // translate to next station

            const nextStationIndex = k < this.subways.length - 1 ? k + 1 : 0;
            const nextStation = this.subways[nextStationIndex];
            const translateX = nextStation.x - subway.x;
            const translateY = nextStation.y - subway.y;


            newXPositions[i] = this.bindX(translateX + x);
            newYPositions[i] = this.bindY(translateY + y);
            isPredetermied = true;

            newInversedPredetermied[i] = 40;

            continue; // eslint-disable-line no-continue
          }


          let angle = Math.atan2(
            Math.abs(subway.y - y),
            Math.abs(subway.x - x)
          );
          /* move in negative x, move negative y */
          if (y >= subway.y && x >= subway.x) {
            angle += Math.PI;
          }
          /* move in positive x, negative y */
          if (y >= subway.y && x < subway.x) {
            angle += Math.PI + Math.PI / 2;
          }
          if (y < subway.y && x < subway.x) {
            angle += 0;
          } /* positive x, positive y */
          if (y < subway.y && x >= subway.x) {
            angle += Math.PI / 2;
          } /* negative x, positive y */

          if (inversedPredetermied[i] > 0) {
            newInversedPredetermied[i] = inversedPredetermied[i] - 1;
            angle += Math.PI;
          }

          newXPositions[i] = this.bindX(this.maxSpeed * Math.cos(angle) + x);
          newYPositions[i] = this.bindY(this.maxSpeed * Math.sin(angle) + y);
          isPredetermied = true;
          // console.log(x, y);
        }
      }
      if (!isPredetermied) {
        const angle = getRandomArbitrary(0, 2 * Math.PI);
        const speed = getRandomArbitrary(0, this.maxSpeed);
        newXPositions[i] = this.bindX(speed * Math.cos(angle) + x);
        newYPositions[i] = this.bindY(speed * Math.sin(angle) + y);
      }
    }

    const newImmunityMatrix = [];
    for (let i = 0; i < immunityMatrix.length; i += 1) {
      if (immunityMatrix[i] > 0) {
        newImmunityMatrix[i] = immunityMatrix[i] - 1;
      } else {
        newImmunityMatrix[i] = immunityMatrix[i];
      }
    }

    if (newTrainDepartureCountdown === 0) {
      newTrainDepartureCountdown = this.trainDepartureInterval;
    }

    // console.log(newXPositions, newYPositions);

    const mightGetInfected = [];
    const newInfectionMatrix = [];
    /* copy death matrix */

    for (let u = 0; u < infectionMatrix.length; u += 1) {
      const rootX = newXPositions[u];
      const rootY = newYPositions[u];

      /* special case as someone will become non-infeced after this */
      if (infectionMatrix[u] === 1) {
        const probability = getRandomArbitrary(0, 1);
        if (probability <= this.probabilityOfBecommingImmuneElseDie) {
          newImmunityMatrix[u] = this.baseImmunityDuration;
        } else {
          newDeathMatrix[u] = true;
        }
      }

      /* update the infection matrix */
      if (infectionMatrix[u] > 0) {
        newInfectionMatrix[u] = infectionMatrix[u] - 1;
      } else {
        newInfectionMatrix[u] = infectionMatrix[u];
      }

      if (newInfectionMatrix[u] !== 0 && newDeathMatrix[u] !== true) {
        for (let i = 0; i < newXPositions.length; i += 1) {
          if (i === u || newImmunityMatrix[i] > 0 || newDeathMatrix[i]) {
            continue; // eslint-disable-line no-continue
          }
          const x = newXPositions[i];
          const y = newYPositions[i];
          const distance = Math.sqrt((x - rootX) ** 2 + (y - rootY) ** 2);

          if (distance < this.diseaseRadius + this.personRadius) {
            let alreadyMightInfected = false;
            for (let k = 0; k < mightGetInfected.length; k += 1) {
              if (mightGetInfected[k].index === i) {
                mightGetInfected[k].distances.push(distance);
                alreadyMightInfected = true;
              }
            }
            if (!alreadyMightInfected) {
              mightGetInfected.push({
                index: i,
                distances: [distance],
              });
            }
          }
        }
      }
    }

    for (let i = 0; i < mightGetInfected.length; i += 1) {
      const { index, distances } = mightGetInfected[i];
      const negativeProbs = distances.map(this.effectFuntion).map(o => 1 - o);
      const probability = 1 - negativeProbs.reduce((o, n) => o * n, 1);
      const infected = getRandomArbitrary(0, 1) <= probability;
      if (infected) {
        /* just got infected! */
        newInfectionMatrix[index] = this.baseInfectionDuration;
      } else {
        /* it is the same */
        newInfectionMatrix[index] = infectionMatrix[index];
      }
    }

    return [
      newXPositions,
      newYPositions,
      newInfectionMatrix,
      newImmunityMatrix,
      newDeathMatrix,
      newTrainDepartureCountdown,
      newInversedPredetermied,
    ];
  }

  render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < newXPositions.length; i += 1) {
      const x = newXPositions[i];
      const y = newYPositions[i];
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.personRadius, 0, 2 * Math.PI, false);
      this.ctx.strokeStyle = 'black';
      this.ctx.stroke();

      if (newInfectionMatrix[i]) {
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
      }
      if (newImmunityMatrix[i]) {
        this.ctx.fillStyle = 'purple';
        this.ctx.fill();
      }
      if (newDeathMatrix[i]) {
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
      }

      this.ctx.beginPath();
      this.ctx.arc(x, y, this.diseaseRadius, 0, 2 * Math.PI, false);
      this.ctx.strokeStyle = 'blue';
      this.ctx.stroke();
    }
    for (let k = 0; k < this.subways.length; k += 1) {
      const { x, y, r } = this.subways[k];
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      this.ctx.strokeStyle = 'green';
      this.ctx.stroke();
    }
  }

  setContext(context) {
    this.ctx = context;
  }
}
