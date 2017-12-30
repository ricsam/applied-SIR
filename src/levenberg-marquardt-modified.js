import { Matrix, inverse as inv } from 'ml-matrix';

const stepSize = 1e-3;

export default class LMm {
  damping = 1;
  gradientDifference = 1e-3;
  maxIterations = 10;
  errorTolerance = 1e-2 * 4;
  systemSize = 4;

  stepSize = stepSize;
  frameIterations = Math.round(1 / stepSize);
  s0 = 1;
  i0 = 0.005;
  r0 = 0.0001;
  d0 = 0.0001;

  alpha = 13;
  tau = 0.0045;
  mu = 5;
  omega = -0.7;

  curves = ['suceptible', 'infected', 'recovered', 'dead'];
  params = ['s', 'i', 'r', 'd'];
  args = ['alpha', 'tau', 'mu', 'omega'];

  ds(t, { s, i, r }) {
    return -this.alpha * s * i + r * (t - this.tau);
  }
  di(t, { s, i }) {
    return this.alpha * s * i - this.mu * i - this.omega * i;
  }
  dr(t, { i, r }) {
    return this.mu * i - r * (t - this.tau);
  }
  dd(t, { i }) {
    return this.omega * i;
  }

  // alpha
  nextAlphaDs(t, { s, i, r }) {
    return -this.nextAlpha * s * i + r * (t - this.tau);
  }
  nextAlphaDi(t, { s, i }) {
    return this.nextAlpha * s * i - this.mu * i - this.omega * i;
  }
  // dr same
  // dd same

  // tau
  nextTauDs(t, { s, i, r }) {
    return -this.alpha * s * i + r * (t - this.nextTau);
  }
  // di same
  nextTauDr(t, { i, r }) {
    return this.mu * i - r * (t - this.nextTau);
  }
  // dd same

  // mu
  // ds same
  nextMuDi(t, { s, i }) {
    return this.alpha * s * i - this.nextMu * i - this.omega * i;
  }
  nextMuDr(t, { i, r }) {
    return this.nextMu * i - r * (t - this.tau);
  }
  // dd same

  // omega
  // ds same
  nextOmegaDi(t, { s, i }) {
    return this.alpha * s * i - this.mu * i - this.nextOmega * i;
  }
  // dr same
  nextOmegaDd(t, { i }) {
    return this.nextOmega * i;
  }

  initialTargetEuler() {
    this.savedEuler = [];
    this.discreteSavedEuler = [];

    const s = this.s0 * this.ds(0, { s: this.s0, i: this.i0, r: this.r0 });
    const i = this.i0 * this.di(0, { s: this.s0, i: this.i0 });
    const r = this.r0 * this.dr(0, { i: this.i0, r: this.r0 });
    const d = this.d0 * this.dd(0, { i: this.i0 });

    if (
      Number.isNaN(s) ||
      s === Infinity ||
      Number.isNaN(i) ||
      i === Infinity ||
      Number.isNaN(r) ||
      r === Infinity ||
      Number.isNaN(d) ||
      d === Infinity
    ) {
      return false;
    }

    const initialIntegral = {
      s,
      i,
      r,
      d,
    };
    this.savedEuler[0] = initialIntegral;
    this.discreteSavedEuler[0] = initialIntegral;

    return true;
  }
  nextInitialTargetEuler() {
    this.nextSavedEuler = [];
    this.nextDiscreteSavedEuler = [];

    this.nextAlpha = this.alpha + this.gradientDifference;
    this.nextTau = this.tau + this.gradientDifference;
    this.nextMu = this.mu + this.gradientDifference;
    this.nextOmega = this.omega + this.gradientDifference;

    const initialData = { s: this.s0, i: this.i0, r: this.r0 };

    const s = this.s0 * this.ds(0, initialData);
    const i = this.i0 * this.di(0, initialData);
    const r = this.r0 * this.dr(0, initialData);
    const d = this.d0 * this.dd(0, initialData);

    const nextAlphaS = this.s0 * this.nextAlphaDs(0, initialData);
    const nextAlphaI = this.i0 * this.nextAlphaDi(0, initialData);

    const nextTauS = this.s0 * this.nextTauDs(0, initialData);
    const nextTauR = this.r0 * this.nextTauDr(0, initialData);

    const nextMuI = this.i0 * this.nextMuDi(0, initialData);
    const nextMuR = this.r0 * this.nextMuDr(0, initialData);

    const nextOmegaI = this.i0 * this.nextOmegaDi(0, initialData);
    const nextOmegaD = this.d0 * this.nextOmegaDd(0, initialData);

    if (
      Number.isNaN(s) ||
      s === Infinity ||
      Number.isNaN(i) ||
      i === Infinity ||
      Number.isNaN(r) ||
      r === Infinity ||
      Number.isNaN(d) ||
      d === Infinity ||
      Number.isNaN(nextAlphaS) ||
      nextAlphaS === Infinity ||
      Number.isNaN(nextAlphaI) ||
      nextAlphaI === Infinity ||
      Number.isNaN(nextTauS) ||
      nextTauS === Infinity ||
      Number.isNaN(nextTauR) ||
      nextTauR === Infinity ||
      Number.isNaN(nextMuI) ||
      nextMuI === Infinity ||
      Number.isNaN(nextMuR) ||
      nextMuR === Infinity ||
      Number.isNaN(nextOmegaI) ||
      nextOmegaI === Infinity ||
      Number.isNaN(nextOmegaD) ||
      nextOmegaD === Infinity
    ) {
      return false;
    }

    const initialIntegral = {
      alpha: {
        s: nextAlphaS,
        i: nextAlphaI,
        r,
        d,
      },
      tau: {
        s: nextTauS,
        i,
        r: nextTauR,
        d,
      },
      mu: {
        s,
        i: nextMuI,
        r: nextMuR,
        d,
      },
      omega: {
        s,
        i: nextOmegaI,
        r,
        d: nextOmegaD,
      },
    };

    this.nextSavedEuler[0] = initialIntegral;
    this.nextDiscreteSavedEuler[0] = initialIntegral;

    return true;
  }
  setupGradientAndMatrixAndError() {
    this.gradientValues = [[], [], [], []];
    this.matrixValues = [];
    this.error = 0;

    let matrixDiffSum = 0;
    for (let i = 0; i < 4; i += 1) {
      const paramKey = this.params[i];
      const dataKey = this.curves[i];
      const argKey = this.args[i];

      let innerGradientSum = 0;
      for (let ip = 0; ip < 4; ip += 1) {
        innerGradientSum += this.nextDiscreteSavedEuler[0][argKey][
          this.params[ip]
        ];
      }
      const gradientDiffSum =
        this.discreteSavedEuler[0][paramKey] - innerGradientSum / 4;

      this.gradientValues[i][0] = gradientDiffSum / 4; // average

      const matrixDiff =
        this.yData[0][dataKey] - this.discreteSavedEuler[0][paramKey];
      matrixDiffSum += matrixDiff;
      this.error += Math.abs(matrixDiff);
    }

    this.matrixValues[0] = matrixDiffSum / 4; // average
  }

  targetEuler(time) {
    let stepOffset = 0;
    if (this.savedEuler.length === 1) {
      stepOffset = 1;
    }
    for (let t = this.discreteSavedEuler.length - 1; t < time; t += 1) {
      for (let _ = stepOffset; _ < this.frameIterations; _ += 1) {
        const savedLen = this.savedEuler.length;
        const prevValues = this.savedEuler[savedLen - 1];
        const nextPrevValues = this.nextSavedEuler[savedLen - 1];

        const ts = t + this.stepSize;

        const s = prevValues.s + this.stepSize * this.ds(ts, prevValues);
        const i = prevValues.i + this.stepSize * this.di(ts, prevValues);
        const r = prevValues.r + this.stepSize * this.dr(ts, prevValues);
        const d = prevValues.d + this.stepSize * this.dd(ts, prevValues);

        const nextAlphaS =
          nextPrevValues.alpha.s +
          this.stepSize * this.nextAlphaDs(0, nextPrevValues.alpha);
        const nextAlphaI =
          nextPrevValues.alpha.i +
          this.stepSize * this.nextAlphaDi(0, nextPrevValues.alpha);


        if (
          Number.isNaN(s) ||
          s === Infinity ||
          Number.isNaN(i) ||
          i === Infinity ||
          Number.isNaN(r) ||
          r === Infinity ||
          Number.isNaN(d) ||
          d === Infinity ||
          Number.isNaN(nextAlphaS) ||
          nextAlphaS === Infinity ||
          Number.isNaN(nextAlphaI) ||
          nextAlphaI === Infinity ||
          Number.isNaN(nextTauS) ||
          nextTauS === Infinity ||
          Number.isNaN(nextTauR) ||
          nextTauR === Infinity ||
          Number.isNaN(nextMuI) ||
          nextMuI === Infinity ||
          Number.isNaN(nextMuR) ||
          nextMuR === Infinity ||
          Number.isNaN(nextOmegaI) ||
          nextOmegaI === Infinity ||
          Number.isNaN(nextOmegaD) ||
          nextOmegaD === Infinity
        ) {
          return false;
        }

        const nextTauS =
          nextPrevValues.tau.s +
          this.stepSize * this.nextTauDs(0, nextPrevValues.tau);
        const nextTauR =
          nextPrevValues.tau.r +
          this.stepSize * this.nextTauDr(0, nextPrevValues.tau);

        const nextMuI =
          nextPrevValues.mu.i +
          this.stepSize * this.nextMuDi(0, nextPrevValues.mu);
        const nextMuR =
          nextPrevValues.mu.r +
          this.stepSize * this.nextMuDr(0, nextPrevValues.mu);

        const nextOmegaI =
          nextPrevValues.omega.i +
          this.stepSize * this.nextOmegaDi(0, nextPrevValues.omega);
        const nextOmegaD =
          nextPrevValues.omega.d +
          this.stepSize * this.nextOmegaDd(0, nextPrevValues.omega);

        this.savedEuler[savedLen] = {
          s,
          i,
          r,
          d,
        };

        this.nextSavedEuler[savedLen] = {
          alpha: {
            s: nextAlphaS,
            i: nextAlphaI,
            r,
            d,
          },
          tau: {
            s: nextTauS,
            i,
            r: nextTauR,
            d,
          },
          mu: {
            s,
            i: nextMuI,
            r: nextMuR,
            d,
          },
          omega: {
            s,
            i: nextOmegaI,
            r,
            d: nextOmegaD,
          },
        };
      }
    }

    const lastIndex = this.savedEuler.length - 1;

    const result = this.savedEuler[lastIndex];
    this.discreteSavedEuler[time] = result;

    const nextResult = this.nextSavedEuler[lastIndex];
    this.nextDiscreteSavedEuler[time] = nextResult;

    let matrixDiffSum = 0;
    for (let i = 0; i < 4; i += 1) {
      const paramKey = this.params[i];
      const curveKey = this.curves[i];
      const argKey = this.args[i];
      let innerGradientSum = 0;
      for (let ip = 0; ip < 4; ip += 1) {
        innerGradientSum += nextResult[argKey][this.params[ip]];
      }
      const gradientDiffSum = result[paramKey] - innerGradientSum / 4;

      this.gradientValues[i][time] = gradientDiffSum / 4; // average

      const matrixDiff = this.yData[time][curveKey] - result[paramKey];
      matrixDiffSum += matrixDiff;
      this.error += Math.abs(matrixDiff);
    }

    this.matrixValues[time] = matrixDiffSum / 4; // average

    return true;
  }
  gradientFunction() {
    return new Matrix(this.gradientValues);
  }
  matrixFunction() {
    return new Matrix([this.matrixValues]);
  }
  setData(yData, size) {
    this.yData = yData;
    this.dataSetLength = size;
  }
  step() {
    const identity = Matrix.eye(4).mul(this.damping * this.gradientDifference ** 2);

    const gradientFunc = this.gradientFunction();

    const matrixFunc = this.matrixFunction().transposeView();
    const inverse = inv(identity.add(gradientFunc.mmul(gradientFunc.transposeView())));

    let params = new Matrix([[this.alpha, this.tau, this.mu, this.omega]]);
    params = params.sub(inverse
      .mmul(gradientFunc)
      .mmul(matrixFunc)
      .mul(this.gradientDifference)
      .transposeView());

    const arr = params.to1DArray();

    [this.alpha, this.tau, this.mu, this.omega] = arr;
  }
  interate() {
    const res1 = this.initialTargetEuler();
    const res2 = this.nextInitialTargetEuler();
    if (!res1 || !res2) {
      return false;
    }
    this.setupGradientAndMatrixAndError();
    const res = this.mainLoop();
    if (! res) {
      return false;
    }
    return true;
  }
  calculate() {
    if (this.damping <= 0) {
      throw new Error('The damping option must be a positive number');
    } else if (!Array.isArray(this.yData) || this.dataSetLength < 2) {
      throw new Error('The data parameter elements must be an array with more than 2 points');
    }

    let res = this.interate();
    let converged = this.error <= this.errorTolerance || !res;

    let iteration;
    for (
      iteration = 0;
      iteration < this.maxIterations && !converged;
      iteration += 1
    ) {
      this.step();
      res = this.interate();
      converged = this.error <= this.errorTolerance || !res;
    }

    // console.log(this.error, iteration);
    console.log([this.alpha, this.tau, this.mu, this.omega]);

    return {
      parameterValues: [this.alpha, this.tau, this.mu, this.omega],
      parameterError: this.error,
      iterations: iteration,
    };
  }
  mainLoop() {
    for (let i = 1; i < this.dataSetLength; i += 1) {
      const res = this.targetEuler(i);
      if (! res) {
        return false;
      }
    }
    return true;
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  plot({
    context: c, elapsedTime, width, height,
  }) {
    console.log(this.discreteSavedEuler);
    //   for (let k = 0; k < 4; k += 1) {
    //     for (let i = 0; i < this.dataSetLength; i += 1) {
    //       const yVal = this.discreteSavedEuler[i][this.params[k]];
    //       c.strokeStyle = 'orange';
    //       c.lineWidth = 1;
    //       const initialValue = height * (1 - solution(0)[index]);
    //       c.beginPath();
    //       c.moveTo(0, initialValue);
    //       for (let k = 1; k < this.frames.length; k += 1) {
    //         const vX = k * xSpacing;
    //         const vY = this.state.sirGraphHeight * (1 - solution(k)[index]);
    //         c.lineTo(vX, vY);
    //       }
    //       c.stroke();
    //       c.strokeStyle = color;
    //       c.lineWidth = 5;
    //       c.stroke();
    //       c.closePath();

    //     }

    //   }
  }
}
