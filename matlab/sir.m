% Plots the SIR model.
clc, clear all, close all
alpha = 0.2; % Encounter rate
mu = 0.05; % Recovery rate
tmax = 50; % Last iteration
dt = 0.01; % Time step
tau = 2; % Time delay (immunity duration)
omega = 0.1; % Death rate

% Initial values
S0 = 0.99;
I0 = 0.01;
R0 = 0;
D0 = 0;

S = S0;
I = I0;
R = R0;
D = D0;

iterations = [0:dt:tmax];
t = 0;
pile = [];
nicePile = [];

% Equations
dS = @(t,S,I,R) - alpha * S * I + R - omega * I;
dI = @(t,S,I) alpha * S * I - mu * I;
dR = @(t,I,R) mu * I - R;
dD = @(t,S,I,R) 1 - S - I - R;
S = S0;
I = I0;
R = R0;
D = D0;

for i = 1:length(iterations) - 1
  t = [t (i * dt)];
  if i < tau / dt + 1
    S(i+1) = S(i) + dt * dS(0,S(i),I(i),R0,I(i));
    I(i+1) = I(i) + dt * dI(0,S(i),I(i),I(i));
    R(i+1) = R(i) + dt * dR(0,I(i),R0);
    D(i+1) = dD(0,S(i),I(i),R0);
    else
    S(i+1) = S(i) + dt * dS(0,S(i),I(i),R(i - tau / dt),I(i));
    I(i+1) = I(i) + dt * dI(0,S(i),I(i),I(i));
    R(i+1) = R(i) + dt * dR(0,I(i),R(i - tau / dt));
    D(i+1) = dD(0,S(i),I(i),R(i));
    if D(i+1) >= 1
      break
    end
  end
end

figure;
plot(t,S)
hold on
plot(t,I)
hold on
plot(t,R)
hold on
plot(t,D)
hold on
legend('S','I','R','D')
xlabel('t')
ylabel('Number of people')
