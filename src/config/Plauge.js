import Disease from 'GameUnits/Disease';

export default class Plauge extends Disease {
  radius = 3;
  effectMin = 0.25;
  effectMax = 1;

  effectFunc(r) {
    return Math.pow(r, -1.262);
  }

  effect(r) {
    if (r > this.radius) return 0;
    if (r < 1) return 1;
    switch (r) {
      case this.radius:
        return this.effectMin;
      case 1:
        return this.effectMax;
      default:
        return this.effectFunc(r);
    }
  }
}
