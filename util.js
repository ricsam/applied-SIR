const makeSomeGuyInfected = index => {
  if (window.people[index].susceptible === true) {
    window.people[index].susceptible.false;
    window.people[
      index
    ].smittar = 0; /* ökar exponentiellt snabbt i början, sjunker exponentiellt långsamt sen */
  }
};

const getIndexAt = (rowIndex, colIndex) => {
  if (typeof colIndex === 'undefined') {
    var { colIndex, rowIndex } = rowIndex;
  }
  return rowIndex * window.matrixNumCols + colIndex;
};
const getRowColAt = index => {
  const colIndex = index % window.matrixNumCols;
  const rowIndex = (index - colIndex) / window.matrixNumCols;
  return {
    colIndex,
    rowIndex,
  };
};

const getAdjacentIndexes = index => {
  const { rowIndex, colIndex } = getRowColAt(index);

  const rows = [];
  for (let r = 1; r <= window.disease.radius; r++) {
    /*
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
          0 0 0 X 0 0 0
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
        */
    rows[0];
  }

  return [0, 0, 0, index - 1, index + 1, 0, 0, 0];
};

function setUpData(useBuffer = false) {
  if (useBuffer) {
    window.buffer = document.getElementById('buffer');
  }

  window.bh = 800;
  window.bw = 600;

  window.peopleSize = 10; /* in pixels */
  window.matrixNumRows = bh / peopleSize;
  window.matrixNumCols = bw / peopleSize;
  window.numberOfPeople = matrixNumCols * matrixNumRows;
  window.people = [];

  window.disease = {
    radius: 3,
    effectFunc: r => Math.pow(r, -1.262),
    effectMin: 0.25,
    effectMax: 1,
    effect: r => {
      if (r > window.disease.radius) return 0;
      if (r < 1) return 1;
      switch (r) {
        case window.disease.radius:
          return window.disease.effectMin;
        case 1:
          return window.disease.effectMax;
        default:
          return window.disease.effectFunc(r);
      }
    },
  };

  for (let i = 0; i < numberOfPeople; i++) {
    people.push({
      alive: true,
      effect: 0.1,
      /*
          values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
          Sannolikhet att agent smittar närliggande personer.
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
          0 0 0 X 0 0 0
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
          0 0 0 0 0 0 0
        */
      immune: 300,
      susceptible: true,
      /*
          immune: true <=> smittar: 0
          frisk: true <=> smittar: 0
          frisk: true <=> immune: true
        */
    });
  }
}

/* function infecting someone at position `index` */
function infect(index) {
  /*
    0 0 0
    k X k
    0 0 0 
*/

  makeSomeGuyInfected(index - 1);
  makeSomeGuyInfected(index + 1);
}

if (module.exports) {
  module.exports = {
    getAdjacentIndexes,
    setUpData,
    infect,
    getRowColAt,
    getIndexAt,
  };
}
