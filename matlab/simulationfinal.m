clear; clear all; clc;

global this_width this_height this_maxSpeed this_diseaseRadius this_baseInfectionDuration this_baseImmunityDuration this_personRadius this_numberOfPeople this_probabilityOfBecommingImmuneElseDie f initialNumberOfInfected; % Makes variables global.

this_width = 800; % Width of playfield.
this_height = 600; % Height of playfield.
this_maxSpeed = 1; % Maximum movement distance of agents per iteration.
this_diseaseRadius = 10; % Maximum distance of disease spread.
this_baseInfectionDuration = 15; % Duration of disease.
this_baseImmunityDuration = 15; % Duration of immunity.
this_personRadius = 3; % Size of agents.
this_numberOfPeople = 3000; % Amount of agents in simulation.
this_probabilityOfBecommingImmuneElseDie = 0.8; % Fairly self-explanatory.
initialNumberOfInfected = 5; % Initial amount of infected agents.

[newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = getInitialFrame(); % Initialises the simulation.

% Main program loop.
f = figure;
while true
  render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix);
  [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = update(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix);
  pause(1/60);
end

% Rendering function.
function ret = renderMatrix(matrix, newXPositions, newYPositions, c)

    xPositions = []; % Makes empty list for x-coordinates.
    yPositions = []; % Makes empty list for x-coordinates.
    for u=1:size(matrix, 2) % Iterates through matrix for the following frame.
        if matrix(1, u) > 0
          xPositions(end + 1) = newXPositions(1, u); % Sets every present person to 1.
          yPositions(end + 1) = newYPositions(1, u); % Sets every present person to 1.
        end
    end

    scatter(xPositions(:),yPositions(:),10,c,"filled"); % Plots the filtered coordinates as points.
    hold on;
    set(gca,'color','black'); % Makes background colour black for improved visibility.
end

% Function that makes the different groups of agents more friendly for rendering.
function ret = render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix)
    global f;
    clf(f); % Clear figure window.
    scatter(newXPositions(:), newYPositions(:), 10, 'yellow', 'filled'); % Plots susceptible agents.
    hold on;

    renderMatrix(newInfectionMatrix, newXPositions, newYPositions, 'red'); % Plots infected agents.
    renderMatrix(newDeathMatrix, newXPositions, newYPositions, 'white'); % Plots dead agents.
    renderMatrix(newImmunityMatrix, newXPositions, newYPositions, 'green'); % Plots immune agents.
end

% Initialisation function.
function [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = getInitialFrame()
  global this_width this_height this_maxSpeed this_diseaseRadius this_baseInfectionDuration this_baseImmunityDuration this_personRadius this_numberOfPeople this_probabilityOfBecommingImmuneElseDie initialNumberOfInfected;

  xPositions = []; % Initial x-position array.
  yPositions = []; % Initial y-position array.
  immunityMatrix = []; % Time ticking, of being immune.
  infectionMatrix = []; % Time ticking down, of infection.
  deathMatrix = [];

  for i = 1:this_numberOfPeople - initialNumberOfInfected
    xPositions(end + 1) = getRandomArbitrary(0, this_width);
    yPositions(end + 1) = getRandomArbitrary(0, this_height);
    immunityMatrix(end + 1) = 0;
    infectionMatrix(end + 1) = 0;
    deathMatrix(end + 1) = false;
  end

  for i = 1:initialNumberOfInfected
    % Push one infected.
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

% Calculates probability of disease spreading.
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

% Obtains positions and states of agents.
function [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix, newDeathMatrix] = update(xPositions, yPositions, infectionMatrix, immunityMatrix, deathMatrix)

  global this_width this_height this_maxSpeed this_diseaseRadius this_baseInfectionDuration this_baseImmunityDuration this_personRadius this_numberOfPeople this_probabilityOfBecommingImmuneElseDie;

  newXPositions = []; % Matrix for updated x-positions.
  newYPositions = []; % Matrix for updated y-positions.
  newDeathMatrix = [deathMatrix]; % Updated matrix of dead agents.

  xPositions_length = size(xPositions, 2); % Determines size of x-position matrix.
  % Determines if an agent is dead.
  for i = 1:xPositions_length
    if newDeathMatrix(i) 
      newXPositions(i) = xPositions(i);
      newYPositions(i) = yPositions(i);
      continue;
    end

    x = xPositions(i);
    y = yPositions(i);
    winkel = getRandomArbitrary(0, 2 * pi); % Determines angle of movement.
    speed = getRandomArbitrary(0, this_maxSpeed); % Determines distance of movement.
    newXPositions(i) = bindX(speed * cos(winkel) + x); 
    newYPositions(i) = bindY(speed * sin(winkel) + y);
  end

  newImmunityMatrix = []; % Matrix of immune agents.
  % Determines if an agent is immune.
  for i = 1:size(immunityMatrix, 2)
    if immunityMatrix(i) > 0
      newImmunityMatrix(i) = immunityMatrix(i) - 1;
    else
      newImmunityMatrix(i) = immunityMatrix(i);
    end
  end

  mightGetInfected = []; % Persons who are at risk of becoming infected.
  mightGetInfected_index = [];
  mightGetInfected_distances = [];
  newInfectionMatrix = [];

  for u = 1:size(infectionMatrix, 2)
    rootX = newXPositions(u);
    rootY = newYPositions(u);

    if infectionMatrix(u) == 1 % Checks if person at position is about to stop being infected.
      probability = getRandomArbitrary(0, 1); % Generates a random number for probability check.
      if probability <= this_probabilityOfBecommingImmuneElseDie % If the generated number is lower than death rate, person becomes immune.
        newImmunityMatrix(u) = this_baseImmunityDuration;
      else % Person dies.
        newDeathMatrix(u) = true;
      end
    end

    % Update the infection matrix.
    if infectionMatrix(u) > 0
      newInfectionMatrix(u) = infectionMatrix(u) - 1;
    else
      newInfectionMatrix(u) = infectionMatrix(u);
    end

    % Sort agents that are at risk of infection.
    if newInfectionMatrix(u) ~= 0 && newDeathMatrix(u) ~= true
      for i = 1:size(newXPositions, 2)
        if i == u || newImmunityMatrix(i) > 0 || newDeathMatrix(i)
          continue;
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

  % Checks if agent becomes infected.
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

% Function for random numbers.
function cb = getRandomArbitrary(min, max)
  bound = rand() * (max - min);
  cb = bound + min;
end
