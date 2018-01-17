import { Matrix, inverse as inv } from 'ml-matrix';

const stepSize = 0.5;

export default class LMm {
  damping = 0.8;
  gradientDifference = 1e-2;
  maxIterations = 5;
  errorTolerance = 1e-4 * 4;
  systemSize = 4;

  stepSize = stepSize;
  frameIterations = Math.round(1 / stepSize);

  alpha = false;

  dS = (t, { S, I, R, D }, { alpha, tau, mu, omega }) => -alpha * S * I + (tau - t) * R;
  dS0 = (t, { S, I, R, D }, { alpha, tau, mu, omega }) => -alpha * S * I + R;
  dI = (t, { S, I, R, D }, { alpha, tau, mu, omega }) => alpha * S * I - omega * I - mu * I;
  dR = (t, { S, I, R, D }, { alpha, tau, mu, omega }) => mu * I - (tau - t) * R;
  dR0 = (t, { S, I, R, D }, { alpha, tau, mu, omega }) => mu * I - R;
  dD = (t, { S, I, R, D }, { alpha, tau, mu, omega }) => omega * I;
  euler(alpha, tau, mu, omega) {
    let totalDistance = 0;
    let S = this.yData[0].suceptible;
    let I = this.yData[0].infected;
    let R = this.yData[0].immune;
    let D = this.yData[0].dead;

    for (let t = 0; t < this.yData.length; t += 1) {
      for (let s = 0; s < this.frameIterations; s += 1) {
        const args = [t + s * this.stepSize, { S, I, R, D }, { alpha, tau, mu, omega }];
        I += this.stepSize * this.dI(...args);
        D += this.stepSize * this.dD(...args);
        if (t >= tau) {
          R += this.stepSize * this.dR(...args);
          S += this.stepSize * this.dS(...args);
        } else {
          R += this.stepSize * this.dR0(t + s * this.stepSize, { S, I, R: this.yData[0].immune, D }, { alpha, tau, mu, omega });
          S += this.stepSize * this.dS0(t + s * this.stepSize, { S, I, R: this.yData[0].immune, D }, { alpha, tau, mu, omega });
        }
        if (S < 0 || S > 1 || I < 0 || I > 1 || R < 0 || R > 1 || D < 0 || D > 1) {
          return false;
        }
      }

      totalDistance += Math.abs(this.yData[t].suceptible - S);
      totalDistance += Math.abs(this.yData[t].infected - I);
      totalDistance += Math.abs(this.yData[t].immune - R);
      totalDistance += Math.abs(this.yData[t].dead - D);
    }

    return totalDistance;
  }
  gradientFunction() {
    const range = 10;
    const gradient = 0.5;

    const len = this.yData.length;

    const alphaMid = 0;
    const tauMid = 0;
    const muMid = 0;
    const omegaMid = 0;

    const distances = [];
    for (let alpha = -range + alphaMid; alpha <= range + alphaMid; alpha += gradient) {
      for (let tau = -range + tauMid; tau <= range + tauMid; tau += gradient) {
        for (let mu = -range + muMid; mu <= range + muMid; mu += gradient) {
          for (let omega = -range + omegaMid; omega <= range + omegaMid; omega += gradient) {
            const distance = this.euler(alpha, tau, mu, omega);
            if (distance !== false) {
              distances.push(
                {distance,
                  alpha, tau, mu, omega}
              );
            }
          }
        }
      }
    }
    if ( ! distances.length ) {
      return;
    }
    const ld = distances.sort((a, b) => a.distance - b.distance)[0];
    console.log(ld);
    this.alpha = ld.alpha;
    this.tau = ld.tau;
    this.mu = ld.mu;
    this.omega = ld.omega;
    // console.log(distances);
  }
  setData(yData, size) {
    this.yData = yData;
    this.dataSetLength = size;
    this.s0 = this.yData[0].suceptible;
    this.i0 = this.yData[0].infected;
    this.p0 = this.yData[0].immune;
    this.d0 = this.yData[0].dead;
  }
  calculate() {
    this.alpha = false;
    this.gradientFunction();
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  plot({ context: c, width, height, elapsedTime }) {
    if ( ! this.alpha ) return;

    let S = this.yData[0].suceptible;
    let I = this.yData[0].infected;
    let R = this.yData[0].immune;
    let D = this.yData[0].dead;
    const discreteValues = [[S], [I], [R], [D]];

    const { alpha, tau, mu, omega } = this;

    for (let t = 0; t < this.yData.length; t += 1) {
      for (let s = 0; s < this.frameIterations; s += 1) {
        const args = [t + s * this.stepSize, { S, I, R, D }, { alpha, tau, mu, omega }];
        S += this.stepSize * this.dS(...args);
        I += this.stepSize * this.dI(...args);
        R += this.stepSize * this.dR(...args);
        D += this.stepSize * this.dD(...args);
      }
      discreteValues[0].push(S);
      discreteValues[1].push(I);
      discreteValues[2].push(R);
      discreteValues[3].push(D);
    }
    for (let k = 0; k < 4; k += 1) {
      c.strokeStyle = 'orange';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(0, height * (1 - discreteValues[k][0]));

      for (let t = 1; t < this.yData.length; t += 1) {
        const yVal = discreteValues[k][t];
        const vX = t * width / elapsedTime;
        const vY = height * (1 - yVal);
        c.lineTo(vX, vY);
      }
      c.stroke();
      c.closePath();
    }
  }
}
