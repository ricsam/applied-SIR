import Person from 'GameUnits/Person';

/* type EffectType = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1 */
export default class HealthyPerson extends Person {
  effect /*: EffectType */ = 0.1;
  /*
    Sannolikhet att agent smittar närliggande personer.
    0 0 0 0 0 0 0
    0 0 0 0 0 0 0
    0 0 0 0 0 0 0
    0 0 0 X 0 0 0
    0 0 0 0 0 0 0
    0 0 0 0 0 0 0
    0 0 0 0 0 0 0
  */
  immune = 300;
  susceptible = true;
}
