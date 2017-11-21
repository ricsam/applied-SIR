function cb = getRandomArbitrary(min, max)
  bound = rand() * (max - min);
  cb = bound + min;
end

this_width = 800;
this_height = 600;
this_maxSpeed = 3;
this_diseaseRadius = 10;
this_baseInfectionDuration = 5;
this_baseImmunityDuration = 360;
this_personRadius = 3;
this_numberOfPeople = 1200;
this_probabilityOfBecommingImmuneElseDie = 0.8;
this_trainDepartureInterval = 40;
this_subways_x = [200, 600];
this_subways_y = [300, 300];
this_subways_r = [100, 100];
this_subways = [1, 2];

function cb = getInitialFrame()
  xPositions = [];
  yPositions = [];
  immunityMatrix = []; # time ticking, of beeing immune
  infectionMatrix = []; # time ticking down, of infection
  deathMatrix = [];
  inversedPredetermied = [];

  for i = 1:this_numberOfPeople+1
    xPositions(end + 1) = getRandomArbitrary(0, this_width);
    yPositions(end + 1) = getRandomArbitrary(0, this_height);
    immunityMatrix(end + 1) = 0;
    infectionMatrix(end + 1) = 0;
    deathMatrix(end + 1) = false;
    inversedPredetermied(end + 1) = 0;
  end

  % push one infected
  xPositions(end + 1) = getRandomArbitrary(0, this_width);
  yPositions(end + 1) = getRandomArbitrary(0, this_height);
  immunityMatrix(end + 1) = 0;
  infectionMatrix(end + 1) = this.baseInfectionDuration;
  deathMatrix(end + 1) = false;
  inversedPredetermied(end + 1) = 0;

  % push two infected
  xPositions(end + 1) = getRandomArbitrary(0, this_width);
  yPositions(end + 1) = getRandomArbitrary(0, this_height);
  immunityMatrix(end + 1) = 0;
  infectionMatrix(end + 1) = this.baseInfectionDuration;
  deathMatrix(end + 1) = false;
  inversedPredetermied(end + 1) = 0;

  cb = [
    xPositions,
    yPositions,
    infectionMatrix,
    immunityMatrix,
    deathMatrix,
    this_trainDepartureInterval,
    inversedPredetermied,
  ];
end

function cb = effectFuntion(radius)
  if radius == 0 {
    cb = 0;
  } elseif (radius >= this_diseaseRadius + this_personRadius) {
    cb = 1;
  } else {
    cb = 1 * (radius / (this_diseaseRadius + this_personRadius));
  }
end

function cb = bindX(x)
  cb = min(max(x, 0), this_width);
end

function cb = bindY(y)
  cb = min(max(y, 0), this_height);
end

function cb = update(xPositions, yPositions, infectionMatrix, immunityMatrix, deathMatrix, trainDepartureCountdown, inversedPredetermied)
  newXPositions = [];
  newYPositions = [];
  newDeathMatrix = [deathMatrix];
  newInversedPredetermied = [inversedPredetermied];

  newTrainDepartureCountdown = trainDepartureCountdown - 1;

  xPositions_length = size(xPositions, 2);
  for i = 1:xPositions_length
    if newDeathMatrix(i) {
      newXPositions[i] = xPositions[i];
      newYPositions[i] = yPositions[i];
      continue; # eslint-disable-line no-continue
    }

    const x = xPositions[i];
    const y = yPositions[i];
    let isPredetermied = false;
    for (let k = 0; k < this.subways.length; k += 1) {
      const subway = this.subways[k];
      if (
        Math.sqrt((subway.x - x) ** 2 + (subway.y - y) ** 2) <
        subway.r + this_personRadius
      ) {
        if (newTrainDepartureCountdown == 0) {
          # translate to next station

          const nextStationIndex = k < this.subways.length - 1 ? k + 1 : 0;
          const nextStation = this.subways[nextStationIndex];
          const translateX = nextStation.x - subway.x;
          const translateY = nextStation.y - subway.y;


          newXPositions[i] = this.bindX(translateX + x);
          newYPositions[i] = this.bindY(translateY + y);
          isPredetermied = true;

          newInversedPredetermied[i] = 40;

          continue; # eslint-disable-line no-continue
        }


        let angle = Math.atan2(
          Math.abs(subway.y - y),
          Math.abs(subway.x - x)
        );
        # move in negative x, move negative y */
        if (y >= subway.y && x >= subway.x) {
          angle += Math.PI;
        }
        # move in positive x, negative y */
        if (y >= subway.y && x < subway.x) {
          angle += Math.PI + Math.PI / 2;
        }
        if (y < subway.y && x < subway.x) {
          angle += 0;
        } # positive x, positive y */
        if (y < subway.y && x >= subway.x) {
          angle += Math.PI / 2;
        } # negative x, positive y */

        if (inversedPredetermied[i] > 0) {
          newInversedPredetermied[i] = inversedPredetermied[i] - 1;
          angle += Math.PI;
        }

        newXPositions[i] = this.bindX(this.maxSpeed * Math.cos(angle) + x);
        newYPositions[i] = this.bindY(this.maxSpeed * Math.sin(angle) + y);
        isPredetermied = true;
        # console.log(x, y);
      }
    }
    if (!isPredetermied) {
      const angle = getRandomArbitrary(0, 2 * Math.PI);
      const speed = getRandomArbitrary(0, this.maxSpeed);
      newXPositions[i] = this.bindX(speed * Math.cos(angle) + x);
      newYPositions[i] = this.bindY(speed * Math.sin(angle) + y);
    }
  end

  const newImmunityMatrix = [];
  for (let i = 0; i < immunityMatrix.length; i += 1) {
    if (immunityMatrix[i] > 0) {
      newImmunityMatrix[i] = immunityMatrix[i] - 1;
    } else {
      newImmunityMatrix[i] = immunityMatrix[i];
    }
  }

  if (newTrainDepartureCountdown == 0) {
    newTrainDepartureCountdown = this.trainDepartureInterval;
  }

  # console.log(newXPositions, newYPositions);

  const mightGetInfected = [];
  const newInfectionMatrix = [];
  # copy death matrix */

  for (let u = 0; u < infectionMatrix.length; u += 1) {
    const rootX = newXPositions[u];
    const rootY = newYPositions[u];

    # special case as someone will become non-infeced after this */
    if (infectionMatrix[u] == 1) {
      const probability = getRandomArbitrary(0, 1);
      if (probability <= this.probabilityOfBecommingImmuneElseDie) {
        newImmunityMatrix[u] = this.baseImmunityDuration;
      } else {
        newDeathMatrix[u] = true;
      }
    }

    # update the infection matrix */
    if (infectionMatrix[u] > 0) {
      newInfectionMatrix[u] = infectionMatrix[u] - 1;
    } else {
      newInfectionMatrix[u] = infectionMatrix[u];
    }

    if (newInfectionMatrix[u] !== 0 && newDeathMatrix[u] !== true) {
      for (let i = 0; i < newXPositions.length; i += 1) {
        if (i == u || newImmunityMatrix[i] > 0 || newDeathMatrix[i]) {
          continue; # eslint-disable-line no-continue
        }
        const x = newXPositions[i];
        const y = newYPositions[i];
        const distance = Math.sqrt((x - rootX) ** 2 + (y - rootY) ** 2);

        if (distance < this_diseaseRadius + this_personRadius) {
          let alreadyMightInfected = false;
          for (let k = 0; k < mightGetInfected.length; k += 1) {
            if (mightGetInfected[k].index == i) {
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
      # just got infected! */
      newInfectionMatrix[index] = this.baseInfectionDuration;
    } else {
      # it is the same */
      newInfectionMatrix[index] = infectionMatrix[index];
    }
  }

  cb = [
    newXPositions;
    newYPositions;
    newInfectionMatrix;
    newImmunityMatrix;
    newDeathMatrix;
    newTrainDepartureCountdown;
    newInversedPredetermied;
  ];
end

  render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix) {
    this.ctx.clearRect(0, 0, this_width, this_height);
    for (let i = 0; i < newXPositions.length; i += 1) {
      const x = newXPositions[i];
      const y = newYPositions[i];
      this.ctx.beginPath();
      this.ctx.arc(x, y, this_personRadius, 0, 2 * Math.PI, false);
      this.ctx.strokeStyle = 'black';
      this.ctx.stroke();

      if (newImmunityMatrix[i]) {
        this.ctx.fillStyle = 'purple';
        this.ctx.fill();
      }
      if (newDeathMatrix[i]) {
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
      }

      if (newInfectionMatrix[i]) {
        this.ctx.fillStyle = 'red';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(x, y, this_diseaseRadius, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
      }
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
