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
    if newDeathMatrix(i)
      newXPositions(i) = xPositions(i);
      newYPositions(i) = yPositions(i);
      continue;
    end

    x = xPositions(i);
    y = yPositions(i);
    isPredetermied = false;
    for k = 1:size(this_subways, 2)
      subway = this_subways(k);

      subway_r = this_subways_r(subway)
      subway_x = this_subways_x(subway)
      subway_y = this_subways_y(subway)

      if sqrt((subway_x - x)^2 + (subway_y - y)^2) < subway_r + this_personRadius
        if newTrainDepartureCountdown == 0
          % translate to next station

          if k < size(this_subways, 2)
            nextStationIndex = k + 1;
          else
            nextStationIndex = 1;
          end

          nextStation = this_subways(nextStationIndex);

          nextStation_x = this_subways_x(nextStation)
          nextStation_y = this_subways_y(nextStation)
          nextStation_r = this_subways_r(nextStation)

          translateX = nextStation_x - subway_x;
          translateY = nextStation_y - subway_y;


          newXPositions(i) = bindX(translateX + x);
          newYPositions(i) = bindY(translateY + y);
          isPredetermied = true;

          newInversedPredetermied(i) = 40;

          continue; % eslint-disable-line no-continue
        end


        winkel = atan(abs(subway.y - y) / abs(subway.x - x));

        % move in negative x, move negative y */
        if y >= subway_y && x >= subway_x
          winkel = winkel + pi;
        end
        % move in positive x, negative y */
        if y >= subway.y && x < subway.x
          winkel = winkel + pi + pi / 2;
        end

        % positive x, positive y */
        if y < subway.y && x < subway.x
          winkel = winkel + 0;
        end

        % negative x, positive y */
        if y < subway.y && x >= subway.x
          winkel = winkel + pi / 2;
        end

        if inversedPredetermied(i) > 0
          newInversedPredetermied(i) = inversedPredetermied(i) - 1;
          winkel = winkel + pi;
        end

        newXPositions(i) = bindX(this_maxSpeed * cos(winkel) + x);
        newYPositions(i) = bindY(this_maxSpeed * sin(winkel) + y);
        isPredetermied = true;
      end
    end
    if ~isPredetermied
      winkel = getRandomArbitrary(0, 2 * pi);
      speed = getRandomArbitrary(0, this_maxSpeed);
      newXPositions(i) = bindX(speed * cos(winkel) + x);
      newYPositions(i) = bindY(speed * sin(winkel) + y);
    end
  end

  newImmunityMatrix = [];
  for i = 1:size(immunityMatrix, 2)
    if immunityMatrix(i) > 0
      newImmunityMatrix(i) = immunityMatrix(i) - 1;
    else
      newImmunityMatrix(i) = immunityMatrix(i);
    end
  end

  if newTrainDepartureCountdown == 0
    newTrainDepartureCountdown = this_trainDepartureInterval
  end

  % console.log(newXPositions, newYPositions);

  mightGetInfected = [];
  mightGetInfected_index = [];
  mightGetInfected_distances = [];
  newInfectionMatrix = [];

  % copy death matrix */
  for u = 1:size(infectionMatrix, 2)
    rootX = newXPositions(u);
    rootY = newYPositions(u);

    % special case as someone will become non-infeced after this */
    if infectionMatrix(u) == 1
      probability = getRandomArbitrary(0, 1);
      if probability <= this_probabilityOfBecommingImmuneElseDie
        newImmunityMatrix(u) = this_baseImmunityDuration;
      else
        newDeathMatrix(u) = true;
      end
    end

    % update the infection matrix */
    if infectionMatrix(u) > 0
      newInfectionMatrix(u) = infectionMatrix(u) - 1;
    else
      newInfectionMatrix(u) = infectionMatrix(u);
    end

    if newInfectionMatrix[u] ~= 0 && newDeathMatrix[u] ~= true
      for i = 1:size(newXPositions, 2)
        if i == u || newImmunityMatrix(i) > 0 || newDeathMatrix(i)
          continue; % eslint-disable-line no-continue
        end

        x = newXPositions(i);
        y = newYPositions(i);
        distanze = sqrt((x - rootX)^2 + (y - rootY)^2);

        if distanze < this_diseaseRadius + this_personRadius
          alreadyMightInfected = false;
          for k = 1:mightGetInfected
            if mightGetInfected_index(k) == i
              mightGetInfected_distances(k) = [mightGetInfected_distances(k); distanze];
              alreadyMightInfected = true;
            end
          end
          if ~alreadyMightInfected
            mightGetInfected(end + 1) = size(mightGetInfected, 2) + 1
            mightGetInfected_index(end + 1) = i;
            mightGetInfected_distances(end + 1) = [distanze];
            mightGetInfected.push({
              index: i,
              distances: [distanze],
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
      this.ctx.arc(x, y, this_personRadius, 0, 2 * pi, false);
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
        this.ctx.arc(x, y, this_diseaseRadius, 0, 2 * pi, false);
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
      }
    }
    for (let k = 0; k < this.subways.length; k += 1) {
      const { x, y, r } = this.subways[k];
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * pi, false);
      this.ctx.strokeStyle = 'green';
      this.ctx.stroke();
    }
  }

  setContext(context) {
    this.ctx = context;
  }
}
