/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* timeframe = 1 minute */

var button = document.createElement('button');
button.innerText = 'Next frame';
button.addEventListener('click', tick);

document.body.appendChild(button);

var buffer = document.createElement('canvas');
var width = 800;
var height = 600;
var maxSpeed = 3;
var diseaseRadius = 10;
var baseInfectionDuration = 180;
var baseImmunityDuration = 360;
var personRadius = 3;
var numberOfPeople = 1200;

buffer.width = width;
buffer.height = height;
document.body.appendChild(buffer);

var ctx = buffer.getContext('2d');

function getInitialFrame() {
  var xPositions = [];
  var yPositions = [];
  var immunityMatrix = []; // time ticking, of beeing immune
  var infectionMatrix = []; // time ticking down, of infection

  for (var i = 0; i <= numberOfPeople; i++) {
    xPositions.push(getRandomArbitrary(0, width));
    yPositions.push(getRandomArbitrary(0, height));
    immunityMatrix.push(0);
    infectionMatrix.push(0);
  }

  /* push one infected */
  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(baseInfectionDuration);

  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(baseInfectionDuration);

  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(baseInfectionDuration);

  xPositions.push(getRandomArbitrary(0, width));
  yPositions.push(getRandomArbitrary(0, height));
  immunityMatrix.push(0);
  infectionMatrix.push(baseInfectionDuration);

  var subwayPositions = [0, 1];

  return [xPositions, yPositions, infectionMatrix, immunityMatrix, subwayPositions];
}
var subways = [{
  x: 50,
  y: 50,
  r: 25
}, {
  x: 150,
  y: 150,
  r: 50
}];

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function effectFuntion(radius) {
  if (radius === 0) {
    return 0;
  }
  if (radius >= diseaseRadius + personRadius) {
    return 1;
  }

  return 0.1 * (radius / (diseaseRadius + personRadius));
}

var bindX = function bindX(x) {
  return Math.min(Math.max(x, 0), width);
};
var bindY = function bindY(y) {
  return Math.min(Math.max(y, 0), height);
};

function update(xPositions, yPositions, infectionMatrix, immunityMatrix) {

  var newXPositions = [];
  var newYPositions = [];
  var randomMovementMatrix = [];

  for (var i = 0; i < xPositions.length; i++) {
    var x = xPositions[i];
    var y = yPositions[i];
    var isPredetermied = false;
    for (var k = 0; k < subways.length; k++) {
      var subway = subways[k];
      if (Math.sqrt(Math.pow(subway.x - x, 2) + Math.pow(subway.y - y, 2)) < subway.r + personRadius) {

        var angle = Math.atan2(Math.abs(subway.y - y), Math.abs(subway.x - x));
        if (y >= subway.y && x >= subway.x) angle += Math.PI; /* move in negative x, move negative y */
        if (y >= subway.y && x < subway.x) angle += Math.PI * 3 / 4; /* move in positive x, negative y*/
        if (y < subway.y && x < subway.x) angle += 0; /* positive x, positive y*/
        if (y < subway.y && x >= subway.x) angle += Math.PI / 2; /* negative x, positive y*/

        newXPositions[i] = bindX(maxSpeed * Math.cos(angle) + x);
        newYPositions[i] = bindY(maxSpeed * Math.sin(angle) + y);
        isPredetermied = true;
        // console.log(x, y);
      }
    }
    if (!isPredetermied) {
      var _angle = getRandomArbitrary(0, 2 * Math.PI);
      var speed = getRandomArbitrary(0, maxSpeed);
      newXPositions[i] = bindX(speed * Math.cos(_angle) + x);
      newYPositions[i] = bindY(speed * Math.sin(_angle) + y);
    }
  }

  var newImmunityMatrix = [];
  for (var _i = 0; _i < immunityMatrix.length; _i++) {
    if (immunityMatrix[_i] > 0) {
      newImmunityMatrix[_i] = immunityMatrix[_i] - 1;
    } else {
      newImmunityMatrix[_i] = immunityMatrix[_i];
    }
  }

  // console.log(newXPositions, newYPositions);

  var mightGetInfected = [];
  var newInfectionMatrix = [];

  for (var u = 0; u < infectionMatrix.length; u++) {
    var rootX = newXPositions[u];
    var rootY = newYPositions[u];

    /* special case as someone will become non-infeced after this*/
    if (infectionMatrix[u] === 1) {
      newImmunityMatrix[u] = baseImmunityDuration;
    }

    /* update the infection matrix */
    if (infectionMatrix[u] > 0) {
      newInfectionMatrix[u] = infectionMatrix[u] - 1;
    } else {
      newInfectionMatrix[u] = infectionMatrix[u];
    }

    if (newInfectionMatrix[u] !== 0) {
      inner: for (var _i2 = 0; _i2 < newXPositions.length; _i2++) {
        if (_i2 === u || newImmunityMatrix[_i2] > 0) {
          continue inner;
        }
        var _x = newXPositions[_i2];
        var _y = newYPositions[_i2];
        var distance = Math.sqrt(Math.pow(_x - rootX, 2) + Math.pow(_y - rootY, 2));

        if (distance < diseaseRadius + personRadius) {
          var alreadyMightInfected = false;
          for (var _k = 0; _k < mightGetInfected.length; _k++) {
            if (mightGetInfected[_k].index === _i2) {
              mightGetInfected[_k].distances.push(distance);
              alreadyMightInfected = true;
            }
          }
          if (!alreadyMightInfected) {
            mightGetInfected.push({
              index: _i2,
              distances: [distance]
            });
          }
        }
      }
    }
  }

  for (var _i3 = 0; _i3 < mightGetInfected.length; _i3++) {
    var _mightGetInfected$_i = mightGetInfected[_i3],
        index = _mightGetInfected$_i.index,
        distances = _mightGetInfected$_i.distances;

    var negativeProbs = distances.map(effectFuntion).map(function (o) {
      return 1 - o;
    });
    var probability = 1 - negativeProbs.reduce(function (o, n) {
      return o * n;
    }, 1);
    var infected = getRandomArbitrary(0, 1) <= probability;
    if (infected) {
      /* just got infected! */
      newInfectionMatrix[index] = baseInfectionDuration;
    } else {
      /* it is the same */
      newInfectionMatrix[index] = infectionMatrix[index];
    }
  }

  return [newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix];
}
function render(newXPositions, newYPositions, newInfectionMatrix, newImmunityMatrix) {
  ctx.clearRect(0, 0, width, height);
  for (var i = 0; i < newXPositions.length; i++) {
    var x = newXPositions[i];
    var y = newYPositions[i];
    ctx.beginPath();
    ctx.arc(x, y, personRadius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    if (newInfectionMatrix[i]) {
      ctx.fillStyle = 'red';
      ctx.fill();
    }
    if (newImmunityMatrix[i]) {
      ctx.fillStyle = 'purple';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, diseaseRadius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  }
  for (var k = 0; k < subways.length; k++) {
    var _subways$k = subways[k],
        _x2 = _subways$k.x,
        _y2 = _subways$k.y,
        r = _subways$k.r;

    ctx.beginPath();
    ctx.arc(_x2, _y2, r, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'green';
    ctx.stroke();
  }
}
// let time = new Date();
var args = getInitialFrame();
render.apply(undefined, _toConsumableArray(args));

function tick() {
  args = update.apply(undefined, _toConsumableArray(args));
  render.apply(undefined, _toConsumableArray(args));
  // window.requestAnimationFrame(tick);
}

window.tick = tick;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGE5M2NhNzUyOTgxNDMwNjkyZTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImJ1dHRvbiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVyVGV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0aWNrIiwiYm9keSIsImFwcGVuZENoaWxkIiwiYnVmZmVyIiwid2lkdGgiLCJoZWlnaHQiLCJtYXhTcGVlZCIsImRpc2Vhc2VSYWRpdXMiLCJiYXNlSW5mZWN0aW9uRHVyYXRpb24iLCJiYXNlSW1tdW5pdHlEdXJhdGlvbiIsInBlcnNvblJhZGl1cyIsIm51bWJlck9mUGVvcGxlIiwiY3R4IiwiZ2V0Q29udGV4dCIsImdldEluaXRpYWxGcmFtZSIsInhQb3NpdGlvbnMiLCJ5UG9zaXRpb25zIiwiaW1tdW5pdHlNYXRyaXgiLCJpbmZlY3Rpb25NYXRyaXgiLCJpIiwicHVzaCIsImdldFJhbmRvbUFyYml0cmFyeSIsInN1YndheVBvc2l0aW9ucyIsInN1YndheXMiLCJ4IiwieSIsInIiLCJtaW4iLCJtYXgiLCJNYXRoIiwicmFuZG9tIiwiZWZmZWN0RnVudGlvbiIsInJhZGl1cyIsImJpbmRYIiwiYmluZFkiLCJ1cGRhdGUiLCJuZXdYUG9zaXRpb25zIiwibmV3WVBvc2l0aW9ucyIsInJhbmRvbU1vdmVtZW50TWF0cml4IiwibGVuZ3RoIiwiaXNQcmVkZXRlcm1pZWQiLCJrIiwic3Vid2F5Iiwic3FydCIsImFuZ2xlIiwiYXRhbjIiLCJhYnMiLCJQSSIsImNvcyIsInNpbiIsInNwZWVkIiwibmV3SW1tdW5pdHlNYXRyaXgiLCJtaWdodEdldEluZmVjdGVkIiwibmV3SW5mZWN0aW9uTWF0cml4IiwidSIsInJvb3RYIiwicm9vdFkiLCJpbm5lciIsImRpc3RhbmNlIiwiYWxyZWFkeU1pZ2h0SW5mZWN0ZWQiLCJpbmRleCIsImRpc3RhbmNlcyIsIm5lZ2F0aXZlUHJvYnMiLCJtYXAiLCJvIiwicHJvYmFiaWxpdHkiLCJyZWR1Y2UiLCJuIiwiaW5mZWN0ZWQiLCJyZW5kZXIiLCJjbGVhclJlY3QiLCJiZWdpblBhdGgiLCJhcmMiLCJzdHJva2VTdHlsZSIsInN0cm9rZSIsImZpbGxTdHlsZSIsImZpbGwiLCJhcmdzIiwid2luZG93Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdEQTs7QUFFQSxJQUFNQSxTQUFTQyxTQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQUYsT0FBT0csU0FBUCxHQUFtQixZQUFuQjtBQUNBSCxPQUFPSSxnQkFBUCxDQUF3QixPQUF4QixFQUFpQ0MsSUFBakM7O0FBRUFKLFNBQVNLLElBQVQsQ0FBY0MsV0FBZCxDQUEwQlAsTUFBMUI7O0FBRUEsSUFBTVEsU0FBU1AsU0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFmO0FBQ0EsSUFBTU8sUUFBUSxHQUFkO0FBQ0EsSUFBTUMsU0FBUyxHQUFmO0FBQ0EsSUFBTUMsV0FBVyxDQUFqQjtBQUNBLElBQU1DLGdCQUFnQixFQUF0QjtBQUNBLElBQU1DLHdCQUF3QixHQUE5QjtBQUNBLElBQU1DLHVCQUF1QixHQUE3QjtBQUNBLElBQU1DLGVBQWUsQ0FBckI7QUFDQSxJQUFNQyxpQkFBaUIsSUFBdkI7O0FBRUFSLE9BQU9DLEtBQVAsR0FBZUEsS0FBZjtB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VVEsSUFBVjs7QUFFQSxTQUFTN0UsSUFBVCxHQUFnQjtBQUNkNkUsU0FBTzFDLDJDQUFVMEMsSUFBVixFQUFQO0FBQ0FSLDZDQUFVUSxJQUFWO0FBQ0E7QUFDRDs7QUFFREMsT0FBTzlFLElBQVAsR0FBY0EsSUFBZCxDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGRhOTNjYTc1Mjk4MTQzMDY5MmU4IiwiLyogdGltZWZyYW1lID0gMSBtaW51dGUgKi9cblxuY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5idXR0b24uaW5uZXJUZXh0ID0gJ05leHQgZnJhbWUnO1xuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGljayk7XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuY29uc3QgYnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5jb25zdCB3aWR0aCA9IDgwMDtcbmNvbnN0IGhlaWdodCA9IDYwMDtcbmNvbnN0IG1heFNwZWVkID0gMztcbmNvbnN0IGRpc2Vhc2VSYWRpdXMgPSAxMDtcbmNvbnN0IGJhc2VJbmZlY3Rpb25EdXJhdGlvbiA9IDE4MDtcbmNvbnN0IGJhc2VJbW11bml0eUR1cmF0aW9uID0gMzYwO1xuY29uc3QgcGVyc29uUmFkaXVzID0gMztcbmNvbnN0IG51bWJlck9mUGVvcGxlID0gMTIwMDtcblxuYnVmZmVyLndpZHRoID0gd2lkdGg7XG5idWZmZXIuaGVpZ2h0ID0gaGVpZ2h0O1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidWZmZXIpO1xuXG5cbmNvbnN0IGN0eCA9IGJ1ZmZlci5nZXRDb250ZXh0KCcyZCcpO1xuXG5mdW5jdGlvbiBnZXRJbml0aWFsRnJhbWUoKSB7XG4gIGNvbnN0IHhQb3NpdGlvbnMgPSBbXTtcbiAgY29uc3QgeVBvc2l0aW9ucyA9IFtdO1xuICBjb25zdCBpbW11bml0eU1hdHJpeCA9IFtdOyAvLyB0aW1lIHRpY2tpbmcsIG9mIGJlZWluZyBpbW11bmVcbiAgY29uc3QgaW5mZWN0aW9uTWF0cml4ID0gW107IC8vIHRpbWUgdGlja2luZyBkb3duLCBvZiBpbmZlY3Rpb25cblxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBudW1iZXJPZlBlb3BsZTsgaSsrKSB7XG4gICAgeFBvc2l0aW9ucy5wdXNoKGdldFJhbmRvbUFyYml0cmFyeSgwLCB3aWR0aCkpO1xuICAgIHlQb3NpdGlvbnMucHVzaChnZXRSYW5kb21BcmJpdHJhcnkoMCwgaGVpZ2h0KSk7XG4gICAgaW1tdW5pdHlNYXRyaXgucHVzaCgwKTtcbiAgICBpbmZlY3Rpb25NYXRyaXgucHVzaCgwKTtcbiAgfVxuXG4gIC8qIHB1c2ggb25lIGluZmVjdGVkICovXG4gIHhQb3NpdGlvbnMucHVzaChnZXRSYW5kb21BcmJpdHJhcnkoMCwgd2lkdGgpKTtcbiAgeVBvc2l0aW9ucy5wdXNoKGdldFJhbmRvbUFyYml0cmFyeSgwLCBoZWlnaHQpKTtcbiAgaW1tdW5pdHlNYXRyaXgucHVzaCgwKTtcbiAgaW5mZWN0aW9uTWF0cml4LnB1c2goYmFzZUluZmVjdGlvbkR1cmF0aW9uKTtcblxuICB4UG9zaXRpb25zLnB1c2goZ2V0UmFuZG9tQXJiaXRyYXJ5KDAsIHdpZHRoKSk7XG4gIHlQb3NpdGlvbnMucHVzaChnZXRSYW5kb21BcmJpdHJhcnkoMCwgaGVpZ2h0KSk7XG4gIGltbXVuaXR5TWF0cml4LnB1c2goMCk7XG4gIGluZmVjdGlvbk1hdHJpeC5wdXNoKGJhc2VJbmZlY3Rpb25EdXJhdGlvbik7XG5cbiAgeFBvc2l0aW9ucy5wdXNoKGdldFJhbmRvbUFyYml0cmFyeSgwLCB3aWR0aCkpO1xuICB5UG9zaXRpb25zLnB1c2goZ2V0UmFuZG9tQXJiaXRyYXJ5KDAsIGhlaWdodCkpO1xuICBpbW11bml0eU1hdHJpeC5wdXNoKDApO1xuICBpbmZlY3Rpb25NYXRyaXgucHVzaChiYXNlSW5mZWN0aW9uRHVyYXRpb24pO1xuXG4gIHhQb3NpdGlvbnMucHVzaChnZXRSYW5kb21BcmJpdHJhcnkoMCwgd2lkdGgpKTtcbiAgeVBvc2l0aW9ucy5wdXNoKGdldFJhbmRvbUFyYml0cmFyeSgwLCBoZWlnaHQpKTtcbiAgaW1tdW5pdHlNYXRyaXgucHVzaCgwKTtcbiAgaW5mZWN0aW9uTWF0cml4LnB1c2goYmFzZUluZmVjdGlvbkR1cmF0aW9uKTtcblxuICBjb25zdCBzdWJ3YXlQb3NpdGlvbnMgPSBbMCwgMV07XG5cblxuICByZXR1cm4gW3hQb3NpdGlvbnMsIHlQb3NpdGlvbnMsIGluZmVjdGlvbk1hdHJpeCwgaW1tdW5pdHlNYXRyaXgsIHN1YndheVBvc2l0aW9uc107XG59XG5jb25zdCBzdWJ3YXlzID0gW1xuICB7XG4gICAgeDogNTAsXG4gICAgeTogNTAsXG4gICAgcjogMjVcbiAgfSxcbiAge1xuICAgIHg6IDE1MCxcbiAgICB5OiAxNTAsXG4gICAgcjogNTBcbiAgfVxuXTtcblxuXG5mdW5jdGlvbiBnZXRSYW5kb21BcmJpdHJhcnkobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcbn1cblxuZnVuY3Rpb24gZWZmZWN0RnVudGlvbihyYWRpdXMpIHtcbiAgaWYgKHJhZGl1cyA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmIChyYWRpdXMgPj0gZGlzZWFzZVJhZGl1cyArIHBlcnNvblJhZGl1cykge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgcmV0dXJuIDAuMSAqIChyYWRpdXMgLyAoZGlzZWFzZVJhZGl1cyArIHBlcnNvblJhZGl1cykpO1xufVxuXG5cblxuY29uc3QgYmluZFggPSAoeCkgPT4gTWF0aC5taW4oTWF0aC5tYXgoeCwgMCksIHdpZHRoKTtcbmNvbnN0IGJpbmRZID0gKHkpID0+IE1hdGgubWluKE1hdGgubWF4KHksIDApLCBoZWlnaHQpO1xuXG5mdW5jdGlvbiB1cGRhdGUoeFBvc2l0aW9ucywgeVBvc2l0aW9ucywgaW5mZWN0aW9uTWF0cml4LCBpbW11bml0eU1hdHJpeCkge1xuXG5cblxuICBjb25zdCBuZXdYUG9zaXRpb25zID0gW107XG4gIGNvbnN0IG5ld1lQb3NpdGlvbnMgPSBbXTtcbiAgY29uc3QgcmFuZG9tTW92ZW1lbnRNYXRyaXggPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHhQb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB4ID0geFBvc2l0aW9uc1tpXTtcbiAgICBjb25zdCB5ID0geVBvc2l0aW9uc1tpXTtcbiAgICBsZXQgaXNQcmVkZXRlcm1pZWQgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IHN1YndheXMubGVuZ3RoOyBrKyspIHtcbiAgICAgIGNvbnN0IHN1YndheSA9IHN1YndheXNba107XG4gICAgICBpZiAoTWF0aC5zcXJ0KChzdWJ3YXkueCAtIHgpKioyICsgKHN1YndheS55IC0geSkqKjIpIDwgc3Vid2F5LnIgKyBwZXJzb25SYWRpdXMpIHtcblxuICAgICAgICBsZXQgYW5nbGUgPSBNYXRoLmF0YW4yKCBNYXRoLmFicyhzdWJ3YXkueSAtIHkpLCAgTWF0aC5hYnMoc3Vid2F5LnggLSB4KSApO1xuICAgICAgICBpZiAoeSA+PSBzdWJ3YXkueSAmJiB4ID49IHN1YndheS54KSBhbmdsZSArPSBNYXRoLlBJOyAvKiBtb3ZlIGluIG5lZ2F0aXZlIHgsIG1vdmUgbmVnYXRpdmUgeSAqL1xuICAgICAgICBpZiAoeSA+PSBzdWJ3YXkueSAmJiB4IDwgc3Vid2F5LngpIGFuZ2xlICs9IE1hdGguUEkgKiAzLzQ7IC8qIG1vdmUgaW4gcG9zaXRpdmUgeCwgbmVnYXRpdmUgeSovXG4gICAgICAgIGlmICh5IDwgc3Vid2F5LnkgJiYgeCA8IHN1YndheS54KSBhbmdsZSArPSAwOyAvKiBwb3NpdGl2ZSB4LCBwb3NpdGl2ZSB5Ki9cbiAgICAgICAgaWYgKHkgPCBzdWJ3YXkueSAmJiB4ID49IHN1YndheS54KSBhbmdsZSArPSBNYXRoLlBJIC8gMjsgLyogbmVnYXRpdmUgeCwgcG9zaXRpdmUgeSovXG5cblxuICAgICAgICBuZXdYUG9zaXRpb25zW2ldID0gYmluZFgobWF4U3BlZWQgKiBNYXRoLmNvcyhhbmdsZSkgKyB4KTtcbiAgICAgICAgbmV3WVBvc2l0aW9uc1tpXSA9IGJpbmRZKG1heFNwZWVkICogTWF0aC5zaW4oYW5nbGUpICsgeSk7XG4gICAgICAgIGlzUHJlZGV0ZXJtaWVkID0gdHJ1ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coeCwgeSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICggISBpc1ByZWRldGVybWllZCApIHtcbiAgICAgIGNvbnN0IGFuZ2xlID0gZ2V0UmFuZG9tQXJiaXRyYXJ5KDAsIDIqTWF0aC5QSSk7XG4gICAgICBjb25zdCBzcGVlZCA9IGdldFJhbmRvbUFyYml0cmFyeSgwLCBtYXhTcGVlZCk7XG4gICAgICBuZXdYUG9zaXRpb25zW2ldID0gYmluZFgoc3BlZWQgKiBNYXRoLmNvcyhhbmdsZSkgKyB4KTtcbiAgICAgIG5ld1lQb3NpdGlvbnNbaV0gPSBiaW5kWShzcGVlZCAqIE1hdGguc2luKGFuZ2xlKSArIHkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5ld0ltbXVuaXR5TWF0cml4ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW1tdW5pdHlNYXRyaXgubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaW1tdW5pdHlNYXRyaXhbaV0gPiAwKSB7XG4gICAgICBuZXdJbW11bml0eU1hdHJpeFtpXSA9IGltbXVuaXR5TWF0cml4W2ldIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3SW1tdW5pdHlNYXRyaXhbaV0gPSBpbW11bml0eU1hdHJpeFtpXTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIGNvbnNvbGUubG9nKG5ld1hQb3NpdGlvbnMsIG5ld1lQb3NpdGlvbnMpO1xuXG4gIGNvbnN0IG1pZ2h0R2V0SW5mZWN0ZWQgPSBbXTtcbiAgY29uc3QgbmV3SW5mZWN0aW9uTWF0cml4ID0gW107XG5cbiAgZm9yIChsZXQgdSA9IDA7IHUgPCBpbmZlY3Rpb25NYXRyaXgubGVuZ3RoOyB1KyspIHtcbiAgICBjb25zdCByb290WCA9IG5ld1hQb3NpdGlvbnNbdV07XG4gICAgY29uc3Qgcm9vdFkgPSBuZXdZUG9zaXRpb25zW3VdO1xuXG4gICAgLyogc3BlY2lhbCBjYXNlIGFzIHNvbWVvbmUgd2lsbCBiZWNvbWUgbm9uLWluZmVjZWQgYWZ0ZXIgdGhpcyovXG4gICAgaWYgKGluZmVjdGlvbk1hdHJpeFt1XSA9PT0gMSkge1xuICAgICAgbmV3SW1tdW5pdHlNYXRyaXhbdV0gPSBiYXNlSW1tdW5pdHlEdXJhdGlvbjtcbiAgICB9XG5cbiAgICAvKiB1cGRhdGUgdGhlIGluZmVjdGlvbiBtYXRyaXggKi9cbiAgICBpZiAoaW5mZWN0aW9uTWF0cml4W3VdID4gMCkge1xuICAgICAgbmV3SW5mZWN0aW9uTWF0cml4W3VdID0gaW5mZWN0aW9uTWF0cml4W3VdIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3SW5mZWN0aW9uTWF0cml4W3VdID0gaW5mZWN0aW9uTWF0cml4W3VdO1xuICAgIH1cblxuICAgIGlmIChuZXdJbmZlY3Rpb25NYXRyaXhbdV0gIT09IDApIHtcbiAgICAgIGlubmVyOlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdYUG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpID09PSB1IHx8IG5ld0ltbXVuaXR5TWF0cml4W2ldID4gMCkge1xuICAgICAgICAgIGNvbnRpbnVlIGlubmVyO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHggPSBuZXdYUG9zaXRpb25zW2ldO1xuICAgICAgICBjb25zdCB5ID0gbmV3WVBvc2l0aW9uc1tpXTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoKHggLSByb290WCkqKjIgKyAoeSAtIHJvb3RZKSoqMik7XG5cbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgZGlzZWFzZVJhZGl1cyArIHBlcnNvblJhZGl1cykge1xuICAgICAgICAgIGxldCBhbHJlYWR5TWlnaHRJbmZlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbWlnaHRHZXRJbmZlY3RlZC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgaWYgKG1pZ2h0R2V0SW5mZWN0ZWRba10uaW5kZXggPT09IGkpIHtcbiAgICAgICAgICAgICAgbWlnaHRHZXRJbmZlY3RlZFtrXS5kaXN0YW5jZXMucHVzaChkaXN0YW5jZSk7XG4gICAgICAgICAgICAgIGFscmVhZHlNaWdodEluZmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCAhIGFscmVhZHlNaWdodEluZmVjdGVkICkge1xuICAgICAgICAgICAgbWlnaHRHZXRJbmZlY3RlZC5wdXNoKHtcbiAgICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICAgIGRpc3RhbmNlczogW2Rpc3RhbmNlXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaWdodEdldEluZmVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgeyBpbmRleCwgZGlzdGFuY2VzIH0gPSBtaWdodEdldEluZmVjdGVkW2ldO1xuICAgIGNvbnN0IG5lZ2F0aXZlUHJvYnMgPSBkaXN0YW5jZXMubWFwKGVmZmVjdEZ1bnRpb24pLm1hcChvID0+IDEgLSBvKTtcbiAgICBjb25zdCBwcm9iYWJpbGl0eSA9IDEgLSBuZWdhdGl2ZVByb2JzLnJlZHVjZSgobywgbikgPT4gbyAqIG4sIDEpO1xuICAgIGNvbnN0IGluZmVjdGVkID0gZ2V0UmFuZG9tQXJiaXRyYXJ5KDAsIDEpIDw9IHByb2JhYmlsaXR5O1xuICAgIGlmIChpbmZlY3RlZCkge1xuICAgICAgLyoganVzdCBnb3QgaW5mZWN0ZWQhICovXG4gICAgICBuZXdJbmZlY3Rpb25NYXRyaXhbaW5kZXhdID0gYmFzZUluZmVjdGlvbkR1cmF0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKiBpdCBpcyB0aGUgc2FtZSAqL1xuICAgICAgbmV3SW5mZWN0aW9uTWF0cml4W2luZGV4XSA9IGluZmVjdGlvbk1hdHJpeFtpbmRleF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFtuZXdYUG9zaXRpb25zLCBuZXdZUG9zaXRpb25zLCBuZXdJbmZlY3Rpb25NYXRyaXgsIG5ld0ltbXVuaXR5TWF0cml4XTtcblxufVxuZnVuY3Rpb24gcmVuZGVyKG5ld1hQb3NpdGlvbnMsIG5ld1lQb3NpdGlvbnMsIG5ld0luZmVjdGlvbk1hdHJpeCwgbmV3SW1tdW5pdHlNYXRyaXgpIHtcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdYUG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgeCA9IG5ld1hQb3NpdGlvbnNbaV07XG4gICAgY29uc3QgeSA9IG5ld1lQb3NpdGlvbnNbaV07XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgcGVyc29uUmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgaWYgKG5ld0luZmVjdGlvbk1hdHJpeFtpXSkge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgaWYgKG5ld0ltbXVuaXR5TWF0cml4W2ldKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gJ3B1cnBsZSc7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH1cblxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKHgsIHksIGRpc2Vhc2VSYWRpdXMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJ2JsdWUnO1xuICAgIGN0eC5zdHJva2UoKTtcblxuICB9XG4gIGZvciAobGV0IGsgPSAwOyBrIDwgc3Vid2F5cy5sZW5ndGg7IGsrKykge1xuICAgIGNvbnN0IHt4LCB5LCByfSA9IHN1YndheXNba107XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgciwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnZ3JlZW4nO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfVxufVxuLy8gbGV0IHRpbWUgPSBuZXcgRGF0ZSgpO1xubGV0IGFyZ3MgPSBnZXRJbml0aWFsRnJhbWUoKTtcbnJlbmRlciguLi5hcmdzKTtcblxuZnVuY3Rpb24gdGljaygpIHtcbiAgYXJncyA9IHVwZGF0ZSguLi5hcmdzKTtcbiAgcmVuZGVyKC4uLmFyZ3MpO1xuICAvLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xufVxuXG53aW5kb3cudGljayA9IHRpY2s7XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=