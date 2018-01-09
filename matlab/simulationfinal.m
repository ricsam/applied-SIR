clear; clear all; clc;

global this_width this_height this_maxSpeed this_diseaseRadius this_baseInfectionDuration this_baseImmunityDuration this_personRadius this_numberOfPeople this_probabilityOfBecommingImmuneElseDie f initialNumberOfInfected;

this_width = 800;
this_height = 600;
this_maxSpeed = 1;
this_diseaseRadius = 10;
this_baseInfectionDuration = 15;
this_baseImmunityDuration = 360;
this_personRadius = 3;
this_numberOfPeople = 1200;
this_probabilityOfBecommingImmuneElseDie = 0.8;
initialNumberOfInfected = 5;

[newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = getInitialFrame();

f = figure;
while true
  render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix);
  [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = update(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix);
  pause(1/60);
end

function ret = renderMatrix(matrix, newXPositions, newYPositions, c)

    xPositions = []; % Make empty list for x-coordinates.
    yPositions = []; % Make empty list for x-coordinates.
    for u=1:size(matrix, 2) % Iterates through matrix for the following frame.
        if matrix(1, u) > 0
          xPositions(end + 1) = newXPositions(1, u); % Sets every present person to 1.
          yPositions(end + 1) = newYPositions(1, u); % Sets every present person to 1.
        end
    end

    scatter(xPositions(:),yPositions(:),10,c,"filled"); % Plots the filtered coordinates as points.
    hold on;
    set(gca,'color','black');
end

function ret = render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix)
    global f;
    clf(f);
    scatter(newXPositions(:), newYPositions(:), 10, 'yellow', 'filled');
    hold on;

    renderMatrix(newInfectionMatrix, newXPositions, newYPositions, 'red');
    renderMatrix(newDeathMatrix, newXPositions, newYPositions, 'white');
    renderMatrix(newImmunityMatrix, newXPositions, newYPositions, 'green');

    %scatter(recovered(:,1),recovered(:,2),10,'b',"filled");
    %hold on
    %scatter(infected(:,1),infected(:,2),10,'g',"filled");
    %hold on
end





function [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = getInitialFrame()
  global this_width this_height this_maxSpeed this_diseaseRadius this_baseInfectionDuration this_baseImmunityDuration this_personRadius this_numberOfPeople this_probabilityOfBecommingImmuneElseDie initialNumberOfInfected;

  xPositions = [];
  yPositions = [];
  immunityMatrix = []; % time ticking, of beeing immune
  infectionMatrix = []; % time ticking down, of infection
  deathMatrix = [];

  for i = 1:this_numberOfPeople - initialNumberOfInfected
    xPositions(end + 1) = getRandomArbitrary(0, this_width);
    yPositions(end + 1) = getRandomArbitrary(0, this_height);
    immunityMatrix(end + 1) = 0;
    infectionMatrix(end + 1) = 0;
    deathMatrix(end + 1) = false;
  end

  for i = 1:initialNumberOfInfected
    % push one infected
    xPositions(end + 1) = getRandomArbitrary(0, this_width);
    yPositions(end + 1) = getRandomArbitrary(0, this_height);
    immunityMatrix(end + 1) = 0;
    infectionMatrix(end + 1) = this_baseInfectionDuration;
    deathMatrix(end + 1) = false;
  end

  newXPositions = xPositions;
  newYPositions = yPositions;
  newInfectionMatrix = infectionMatrix;
  newImmunityMatrix = immunityMatrix;
  newDeathMatrix = deathMatrix;
end

function cb = effectFuntion(radius)
  global this_diseaseRadius this_personRadius;
  if radius == 0
    cb = 0;
  elseif radius >= this_diseaseRadius + this_personRadius
    cb = 1;
  else
    cb = 1 * (radius / (this_diseaseRadius + this_personRadius));
  end
end

function cb = bindX(x)
  global this_width;
  cb = min(max(x, 0), this_width);
end

function cb = bindY(y)
  global this_height;
  cb = min(max(y, 0), this_height);
end

function [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = update(xPositions, yPositions, infectionMatrix, immunityMatrix, deathMatrix)

  global this_width this_height this_maxSpeed this_diseaseRadius this_baseInfectionDuration this_baseImmunityDuration this_personRadius this_numberOfPeople this_probabilityOfBecommingImmuneElseDie;

  newXPositions = [];
  newYPositions = [];
  newDeathMatrix = [deathMatrix];

  xPositions_length = size(xPositions, 2);
  for i = 1:xPositions_length
    if newDeathMatrix(i)
      newXPositions(i) = xPositions(i);
      newYPositions(i) = yPositions(i);
      continue;
    end

    x = xPositions(i);
    y = yPositions(i);
    winkel = getRandomArbitrary(0, 2 * pi);
    speed = getRandomArbitrary(0, this_maxSpeed);
    newXPositions(i) = bindX(speed * cos(winkel) + x);
    newYPositions(i) = bindY(speed * sin(winkel) + y);
  end

  newImmunityMatrix = [];
  for i = 1:size(immunityMatrix, 2)
    if immunityMatrix(i) > 0
      newImmunityMatrix(i) = immunityMatrix(i) - 1;
    else
      newImmunityMatrix(i) = immunityMatrix(i);
    end
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

    if newInfectionMatrix(u) ~= 0 && newDeathMatrix(u) ~= true
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
              height = this_numberOfPeople;
              col = mightGetInfected_distances(:, k);
              while col(height) == 0 && height > 1
                height = height - 1;
              end
              newCol = mightGetInfected_distances(:, k);
              newCol(height + 1) = distanze;
              mightGetInfected_distances(:, k) = newCol;
              alreadyMightInfected = true;
            end
          end
          if ~alreadyMightInfected
            mightGetInfected(end + 1) = size(mightGetInfected, 2) + 1;
            mightGetInfected_index(end + 1) = i;

            zeroes = zeros(this_numberOfPeople, 1);
            zeroes(1) = distanze; % Set the distance!
            mightGetInfected_distances(1:this_numberOfPeople, end + 1) = zeroes;
          end
        end
      end
    end
  end

  for i = 1:size(mightGetInfected, 2)
    distances = mightGetInfected_distances(:, i);
    distances = distances(distances'~=0)';
    index = mightGetInfected_index(i);

    negativeProbs = [];

    for d = 1:size(distances, 2)
      negativeProbs(end + 1) = 1 - effectFuntion(distances(d));
    end


    probability = 1;
    for d = 1:size(negativeProbs, 2)
      probability = negativeProbs(d) * probability;
    end
    probability = 1 - probability;


    infected = getRandomArbitrary(0, 1) <= probability;


    if infected
      % just got infected!
      newInfectionMatrix(index) = this_baseInfectionDuration;
    end
  end

end

function cb = getRandomArbitrary(min, max)
  bound = rand() * (max - min);
  cb = bound + min;
end
