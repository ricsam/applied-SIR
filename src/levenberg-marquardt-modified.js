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

  alpha = 0.2;
  beta = 0.15;
  gamma = 0.15;
  v = 0.01;

  resetArgs = false;

  curves = ['suceptible', 'infected', 'immune', 'dead'];
  params = ['s', 'i', 'p', 'd'];
  args = ['beta', 'gamma', 'v', 'alpha'];

  ds(t, { s, i, p }, beta, gamma, v, alpha) {
    return -beta * s * i + gamma * p;
  }
  di(t, { s, i }, beta, gamma, v, alpha) {
    return beta * s * i - alpha * i - v * i;
  }
  dp(t, { i, p }, beta, gamma, v, alpha) {
    return v * i - gamma * p;
  }
  dd(t, { i }, beta, gamma, v, alpha) {
    return alpha * i;
  }

  // beta
  nextBetaDs(t, { s, i, p }) {
    return -this.nextBeta * s * i + this.gamma * p;
  }
  nextBetaDi(t, { s, i }) {
    return this.nextBeta * s * i - this.alpha * i - this.v * i;
  }
  // dp same
  // dd same

  // gamma
  nextGammaDs(t, { s, i, p }) {
    return -this.beta * s * i + this.nextGamma * p;
  }
  // di same
  nextGammaDp(t, { i, p }) {
    return this.v * i - this.nextGamma * p;
  }
  // dd same

  // alpha
  // ds same
  nextAlphaDi(t, { s, i }) {
    return this.beta * s * i - this.nextAlpha * i - this.v * i;
  }
  // dp same
  nextAlphaDd(t, { i }) {
    return this.nextAlpha * i;
  }

  // v
  // ds same
  nextVDi(t, { s, i }) {
    return this.beta * s * i - this.alpha * i - this.nextV * i;
  }
  nextVDp(t, { i, p }) {
    return this.nextV * i - this.gamma * p;
  }
  // dd same

  initialTargetEuler() {
    this.savedEuler = [];
    this.discreteSavedEuler = [];

    const initialData = {
      s: this.s0,
      i: this.i0,
      p: this.p0,
      d: this.d0,
    };

    const s = this.s0 + this.stepSize * this.ds(0, initialData);
    const i = this.i0 + this.stepSize * this.di(0, initialData);
    const p = this.p0 + this.stepSize * this.dp(0, initialData);
    const d = this.d0 + this.stepSize * this.dd(0, initialData);

    if (s < 0 || i < 0 || p < 0 || d < 0) {
      debugger;
    }

    if (
      Number.isNaN(s) ||
      s === Infinity ||
      Number.isNaN(i) ||
      i === Infinity ||
      Number.isNaN(p) ||
      p === Infinity ||
      Number.isNaN(d) ||
      d === Infinity
    ) {
      return false;
    }

    const initialIntegral = {
      s,
      i,
      p,
      d,
    };
    this.savedEuler[0] = initialIntegral;
    this.discreteSavedEuler[0] = initialIntegral;

    return true;
  }
  nextInitialTargetEuler() {
    this.nextSavedEuler = [];
    this.nextDiscreteSavedEuler = [];

    this.nextBeta = this.beta + this.gradientDifference;
    this.nextGamma = this.gamma + this.gradientDifference;
    this.nextAlpha = this.alpha + this.gradientDifference;
    this.nextV = this.v + this.gradientDifference;

    const initialData = {
      s: this.s0,
      i: this.i0,
      p: this.p0,
      d: this.d0,
    };

    const s = this.s0 + this.stepSize * this.ds(0, initialData, this.beta, this.gamma, this.v, this.alpha);
    const i = this.i0 + this.stepSize * this.di(0, initialData, this.beta, this.gamma, this.v, this.alpha);
    const p = this.p0 + this.stepSize * this.dp(0, initialData, this.beta, this.gamma, this.v, this.alpha);
    const d = this.d0 + this.stepSize * this.dd(0, initialData, this.beta, this.gamma, this.v, this.alpha);

    const nextBetaS = this.s0 + this.stepSize * this.nextBetaDs(0, initialData);
    const nextBetaI = this.i0 + this.stepSize * this.nextBetaDi(0, initialData);

    const nextGammaS =
      this.s0 + this.stepSize * this.nextGammaDs(0, initialData);
    const nextGammaP =
      this.p0 + this.stepSize * this.nextGammaDp(0, initialData);

    const nextAlphaI =
      this.i0 + this.stepSize * this.nextAlphaDi(0, initialData);
    const nextAlphaD =
      this.d0 + this.stepSize * this.nextAlphaDd(0, initialData);

    const nextVI = this.i0 + this.stepSize * this.nextVDi(0, initialData);
    const nextVP = this.p0 + this.stepSize * this.nextVDp(0, initialData);

    if (
      nextBetaS < 0 ||
      nextBetaI < 0 ||
      nextGammaS < 0 ||
      nextGammaP < 0 ||
      nextAlphaI < 0 ||
      nextAlphaD < 0 ||
      nextVI < 0 ||
      nextVP < 0
    ) {
      debugger;
    }

    if (
      Number.isNaN(s) ||
      s === Infinity ||
      Number.isNaN(i) ||
      i === Infinity ||
      Number.isNaN(p) ||
      p === Infinity ||
      Number.isNaN(d) ||
      d === Infinity ||
      Number.isNaN(nextBetaS) ||
      nextBetaS === Infinity ||
      Number.isNaN(nextBetaI) ||
      nextBetaI === Infinity ||
      Number.isNaN(nextGammaS) ||
      nextGammaS === Infinity ||
      Number.isNaN(nextGammaP) ||
      nextGammaP === Infinity ||
      Number.isNaN(nextAlphaI) ||
      nextAlphaI === Infinity ||
      Number.isNaN(nextAlphaD) ||
      nextAlphaD === Infinity ||
      Number.isNaN(nextVI) ||
      nextVI === Infinity ||
      Number.isNaN(nextVP) ||
      nextVP === Infinity
    ) {
      return false;
    }

    const initialIntegral = {
      beta: {
        s: nextBetaS,
        i: nextBetaI,
        p,
        d,
      },
      gamma: {
        s: nextGammaS,
        i,
        p: nextGammaP,
        d,
      },
      alpha: {
        s,
        i: nextAlphaI,
        p,
        d: nextAlphaD,
      },
      v: {
        s,
        i: nextVI,
        p: nextVP,
        d,
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

      this.gradientValues[i][0] = gradientDiffSum; // average

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
        const p = prevValues.p + this.stepSize * this.dp(ts, prevValues);
        const d = prevValues.d + this.stepSize * this.dd(ts, prevValues);

        const nextBetaS =
          nextPrevValues.beta.s +
          this.stepSize * this.nextBetaDs(ts, nextPrevValues.beta);
        const nextBetaI =
          nextPrevValues.beta.i +
          this.stepSize * this.nextBetaDi(ts, nextPrevValues.beta);

        const nextGammaS =
          nextPrevValues.gamma.s +
          this.stepSize * this.nextGammaDs(ts, nextPrevValues.gamma);
        const nextGammaP =
          nextPrevValues.gamma.p +
          this.stepSize * this.nextGammaDp(ts, nextPrevValues.gamma);

        const nextAlphaI =
          nextPrevValues.alpha.i +
          this.stepSize * this.nextAlphaDi(ts, nextPrevValues.alpha);
        const nextAlphaD =
          nextPrevValues.alpha.d +
          this.stepSize * this.nextAlphaDd(ts, nextPrevValues.alpha);

        const nextVI =
          nextPrevValues.v.i +
          this.stepSize * this.nextVDi(ts, nextPrevValues.v);
        const nextVP =
          nextPrevValues.v.p +
          this.stepSize * this.nextVDp(ts, nextPrevValues.v);

        if (
          s < 0 ||
          i < 0 ||
          p < 0 ||
          d < 0 ||
          nextBetaS < 0 ||
          nextBetaI < 0 ||
          nextGammaS < 0 ||
          nextGammaP < 0 ||
          nextAlphaI < 0 ||
          nextAlphaD < 0 ||
          nextVI < 0 ||
          nextVP < 0
        ) {
          debugger;
        }
        if (
          Number.isNaN(s) ||
          s === Infinity ||
          Number.isNaN(i) ||
          i === Infinity ||
          Number.isNaN(p) ||
          p === Infinity ||
          Number.isNaN(d) ||
          d === Infinity ||
          Number.isNaN(nextBetaS) ||
          nextBetaS === Infinity ||
          Number.isNaN(nextBetaI) ||
          nextBetaI === Infinity ||
          Number.isNaN(nextGammaS) ||
          nextGammaS === Infinity ||
          Number.isNaN(nextGammaP) ||
          nextGammaP === Infinity ||
          Number.isNaN(nextAlphaI) ||
          nextAlphaI === Infinity ||
          Number.isNaN(nextAlphaD) ||
          nextAlphaD === Infinity ||
          Number.isNaN(nextVI) ||
          nextVI === Infinity ||
          Number.isNaN(nextVP) ||
          nextVP === Infinity
        ) {
          return false;
        }

        this.savedEuler[savedLen] = {
          s,
          i,
          p,
          d,
        };

        this.nextSavedEuler[savedLen] = {
          beta: {
            s: nextBetaS,
            i: nextBetaI,
            p,
            d,
          },
          gamma: {
            s: nextGammaS,
            i,
            p: nextGammaP,
            d,
          },
          alpha: {
            s,
            i: nextAlphaI,
            p,
            d: nextAlphaD,
          },
          v: {
            s,
            i: nextVI,
            p: nextVP,
            d,
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

      this.gradientValues[i][time] = gradientDiffSum; // average

      const matrixDiff = this.yData[time][curveKey] - result[paramKey];
      matrixDiffSum += matrixDiff;
      this.error += Math.abs(matrixDiff);
    }

    this.matrixValues[time] = matrixDiffSum / 4; // average

    return true;
  }
  euler(alpha, tau, mu, omega) {
    for (let t = 0; t < this.yData.length; t += 1) {
      for (let _ = stepOffset; _ < this.frameIterations; _ += 1) {

      }
    }
  }
  gradientFunction() {
    const distances = [];
    for (let alpha = -10; alpha <= 10; alpha += 1) {
      for (let tau = -10; tau <= 10; tau += 1) {
        for (let mu = -10; mu <= 10; mu += 1) {
          for (let omega = -10; omega <= 10; omega += 1) {
            distances.push(
              this.euler(alpha, tau, mu, omega)
            );
          }
        }
      }
    }
  }
  matrixFunction() {
    return new Matrix([this.matrixValues]);
  }
  setData(yData, size) {
    this.yData = yData;
    this.dataSetLength = size;
    if (this.resetArgs) {
      this.resultingArgs = [this.beta, this.gamma, this.alpha, this.v];
      this.alpha = alpha;
      this.beta = beta;
      this.gamma = gamma;
      this.v = v;
    }
    this.s0 = this.yData[0].suceptible;
    this.i0 = this.yData[0].infected;
    this.p0 = this.yData[0].immune;
    this.d0 = this.yData[0].dead;
  }
  step() {
    const identity = Matrix.eye(4).mul(
      this.damping * this.gradientDifference ** 2
    );

    const gradientFunc = this.gradientFunction();

    const matrixFunc = this.matrixFunction().transposeView();
    const inverse = inv(
      identity.add(gradientFunc.mmul(gradientFunc.transposeView()))
    );

    let params = new Matrix([[this.beta, this.gamma, this.alpha, this.v]]);
    params = params.sub(
      inverse
        .mmul(gradientFunc)
        .mmul(matrixFunc)
        .mul(this.gradientDifference)
        .transposeView()
    );

    const arr = params.to1DArray();

    // console.log(this.gradientValues, this.matrixValues);

    [this.beta, this.gamma, this.alpha, this.v] = arr;
  }
  interate() {
    this.error = 0;
    const res1 = this.initialTargetEuler();
    const res2 = this.nextInitialTargetEuler();
    if (!res1 || !res2) {
      return false;
    }
    this.setupGradientAndMatrixAndError();
    const res = this.mainLoop();
    if (!res) {
      return false;
    }
    return true;
  }
  calculate() {
    if (this.damping <= 0) {
      throw new Error('The damping option must be a positive number');
    } else if (!Array.isArray(this.yData) || this.dataSetLength < 2) {
      throw new Error(
        'The data parameter elements must be an array with more than 2 points'
      );
    }

    // let res = this.interate();
    // let converged = this.error <= this.errorTolerance || !res;

    // let iteration;
    // for (
    //   iteration = 0;
    //   iteration < this.maxIterations && !converged;
    //   iteration += 1
    // ) {
    //   this.step();
    //   res = this.interate();
    //   converged = this.error <= this.errorTolerance || !res;
    // }
    function pad(n, width) {
      const z = '0';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }


    // console.log(this.error, iteration);
    // console.log(
    //   JSON.stringify(
    //     {
    //       iterations: iteration,
    //       error: this.error,
    //       args: [this.beta, this.gamma, this.alpha, this.v],
    //     },
    //     true,
    //     2
    //   )
    // );

    return {
      parameterValues: [this.beta, this.gamma, this.alpha, this.v],
      parameterError: this.error,
    };
  }
  mainLoop() {
    for (let i = 1; i < this.dataSetLength; i += 1) {
      const res = this.targetEuler(i);
      if (!res) {
        return false;
      }
    }
    return true;
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  plot({ context: c, width, height, elapsedTime }) {
    if (!this.discreteSavedEuler || !this.discreteSavedEuler.length) return;
    for (let k = 0; k < 4; k += 1) {
      c.strokeStyle = 'orange';
      c.lineWidth = 3;

      const initialValue =
        height * (1 - this.discreteSavedEuler[0][this.params[k]]);

      c.beginPath();
      c.moveTo(0, initialValue);

      for (let i = 1; i < this.discreteSavedEuler.length; i += 1) {
        const yVal = this.discreteSavedEuler[i][this.params[k]];
        const vX = i * width / elapsedTime;
        const vY = height * (1 - yVal);
        c.lineTo(vX, vY);
      }
      c.stroke();
      c.closePath();
    }
  }
}
