// export const getIndexAt = (rowIndex, colIndex) => {
//   if (typeof colIndex === 'undefined') {
//     var { colIndex, rowIndex } = rowIndex;
//   }
//   return rowIndex * window.matrixNumCols + colIndex;
// };
// export const getRowColAt = index => {
//   const colIndex = index % window.matrixNumCols;
//   const rowIndex = (index - colIndex) / window.matrixNumCols;
//   return {
//     colIndex,
//     rowIndex,
//   };
// };

export function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// const directions = ['up', 'down', 'left', 'right', 'tr', 'tl', 'bl', 'br'];
// const makeSomeGuyInfected = index => {
//   if (window.people[index].susceptible === true) {
//     window.people[index].susceptible.false;
//     window.people[
//       index
//     ].smittar = 0; /* ökar exponentiellt snabbt i början, sjunker exponentiellt långsamt sen */
//   }
// };

// const getAdjacentIndexes = index => {
//   const { rowIndex, colIndex } = getRowColAt(index);

//   const rows = [];
//   for (let r = 1; r <= window.disease.radius; r++) {
//     /*
//           0 0 0 0 0 0 0
//           0 0 0 0 0 0 0
//           0 0 0 0 0 0 0
//           0 0 0 X 0 0 0
//           0 0 0 0 0 0 0
//           0 0 0 0 0 0 0
//           0 0 0 0 0 0 0
//         */
//     rows[0];
//   }

//   return [0, 0, 0, index - 1, index + 1, 0, 0, 0];
// };

// function getNextFrame(lastFrameIndex) {
//   console.log(lastFrameIndex);
//   const oframe = window.frames[lastFrameIndex];
//   const imap = oframe.map((guy, index) => {
//     const newIndex = window.nextPosition(index);
//     return [index, newIndex];
//   });
// }

// function setUpData(useBuffer = false) {
//   if (useBuffer) {
//     const buffer = (window.buffer = document.getElementById('buffer'));
//   }

//   const bh = (window.bh = 800);
//   const bw = (window.bw = 600);
//   const peopleSize = (window.peopleSize = 10); /* in pixels */
//   const matrixNumRows = (window.matrixNumRows = bh / peopleSize);
//   const matrixNumCols = (window.matrixNumCols = bw / peopleSize);
//   const numberOfPeople = (window.numberOfPeople =
//     matrixNumCols * matrixNumRows);
//   const frames = (window.frames = []);
//   const frameBuffer = (window.frameBuffer = 2);

//   const disease = (window.disease = {
//     radius: 3,
//     effectFunc: r => Math.pow(r, -1.262),
//     effectMin: 0.25,
//     effectMax: 1,
//     effect: r => {
//       if (r > window.disease.radius) return 0;
//       if (r < 1) return 1;
//       switch (r) {
//         case window.disease.radius:
//           return window.disease.effectMin;
//         case 1:
//           return window.disease.effectMax;
//         default:
//           return window.disease.effectFunc(r);
//       }
//     },
//   });

//   frames[0] = [];
//   frames[0].push({
//     alive: true,
//     effect: 0.1,
//     /*
//       values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
//       Sannolikhet att agent smittar närliggande personer.
//       0 0 0 0 0 0 0
//       0 0 0 0 0 0 0
//       0 0 0 0 0 0 0
//       0 0 0 X 0 0 0
//       0 0 0 0 0 0 0
//       0 0 0 0 0 0 0
//       0 0 0 0 0 0 0
//     */
//     immune: 300,
//     susceptible: true,
//     /*
//       immune: true <=> smittar: 0
//       frisk: true <=> smittar: 0
//       frisk: true <=> immune: true
//     */
//   });
//   // for (let _ = 1; _ < frameBuffer; _++) {
//   //   frames.push([]);
//   //   for (let i = 0; i < numberOfPeople; i++) {
//   //     getNextFrame(frames[_ - 1]);
//   //   }
//   // }
// }

// /* function infecting someone at position `index` */
// function infect(index) {
//   /*
//     0 0 0
//     k X k
//     0 0 0
// */

//   makeSomeGuyInfected(index - 1);
//   makeSomeGuyInfected(index + 1);
// }
