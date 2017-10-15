const util = require('./util.js');

describe('infect', () => {
  it('should not crash', () => {
    util.setUpData();
  });
});

describe('getRowColAt', () => {
  it('should return the correct col row', () => {
    expect(util.getIndexAt(util.getRowColAt(0))).toBe(0);
    expect(util.getIndexAt(util.getRowColAt(400))).toBe(400);
    expect(util.getIndexAt(util.getRowColAt(4800))).toBe(4800);
    expect(util.getRowColAt(window.numberOfPeople - 1).rowIndex).toBe(
      window.matrixNumRows - 1
    );
    expect(util.getRowColAt(window.numberOfPeople - 1).colIndex).toBe(
      window.matrixNumCols - 1
    );
  });
});
describe('getIndexAt', () => {
  it('should return the correct index', () => {
    expect(
      util.getIndexAt(window.matrixNumRows - 1, window.matrixNumCols - 1)
    ).toBe(numberOfPeople - 1);
    expect(util.getIndexAt(0, 0)).toBe(0);
    expect(util.getIndexAt(1, 0)).toBe(window.matrixNumCols);
    expect(util.getIndexAt(0, 1)).toBe(1);
  });
});

describe('disease.effect', () => {
  it('should be defined and work', () => {
    expect(window.disease.effect(0)).toBe(1);
    expect(window.disease.effect(0.25)).toBe(1); // < 1
    expect(typeof window.disease.effect(2)).toBe('number'); // < 1
    expect(window.disease.effect(3)).toBe(0.25);
    expect(window.disease.effect(3.1)).toBe(0);
  });
  it('should be defined', () => {});
});

describe('getAdjacentIndexes', () => {
  it(`
    ? ? ?
    k X k
    ? ? ?
    `, () => {
    const indices = util.getAdjacentIndexes(0);
    expect(indices[3]).toBe(-1);
    expect(indices[4]).toBe(1);
  });
  it(`
    ? k ?
    ? X ?
    ? ? ?
    `, () => {
    const index = numberOfPeople - 1;
    const indices = util.getAdjacentIndexes(index);
    expect(indices[3]).toBe(index - 1);
    expect(indices[4]).toBe(index + 1);

    // expect(indices[2]).toBe();

    // console.log(rowIndex, window.matrixNumRows);
  });
});
