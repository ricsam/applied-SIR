import { getIndexAt, getRowColAt, getRandomInt } from './util.js';

export default function ApplyRandomMovement(index, oframe) {
  /*
      0 1 2
      7 X 3
      6 5 4
    */
  const parseMovementRint = rMovement => {
    if (rMovement < 3) {
      return getIndexAt(rowIndex - 1, colIndex - 1 + rMovement);
    } else if (rMovement === 3) {
      return index + 1;
    } else if (rMovement < 7) {
      return getIndexAt(rowIndex + 1, colIndex - 1 + rMovement);
    } else if (rMovement === 7) {
      return index - 1;
    }
  };
  /* stay one time out of 9 */
  if (getRandomInt(0, 8) === 0) {
    return index;
  }
  const { rowIndex, colIndex } = getRowColAt(index);
  let min = 0;
  let max = 0;
  /* guy is in the tl corner */
  if (colIndex === 0 && rowIndex === 0) {
    min = 3;
    max = 5;
    return parseMovementRint(getRandomInt(3, 5));
  } else if (
    colIndex === window.matrixNumCols - 1 &&
    rowIndex === window.matrixNumRows - 1
  ) {
    /* br */
    return parseMovementRint([0, 1, 7][getRandomInt(0, 2)]);
  } else if (colIndex === 0 && rowIndex === window.matrixNumRows - 1) {
    /* bl */
    return parseMovementRint([1, 2, 3][getRandomInt(0, 2)]);
  } else if (colIndex === 0) {
    /* left wall */
    return parseMovementRint(getRandomInt(1, 5));
  } else if (colIndex === window.matrixNumCols - 1) {
    /* right wall */
    return parseMovementRint([0, 1, 5, 6, 7][getRandomInt(0, 4)]);
  } else if (rowIndex === 0) {
    /* top wall */
    return parseMovementRint(getRandomInt(3, 7));
  } else if (rowIndex === window.matrixNumRows - 1) {
    /* bottom wall */
    return parseMovementRint([0, 1, 2, 3, 7][getRandomInt(0, 4)]);
  }

  return parseMovementRint(getRandomInt(0, 7));
}
