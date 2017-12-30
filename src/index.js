import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { GithubPicker } from 'react-color';
import OptimizedLevenbergMarqardt from './levenberg-marquardt-modified';
import Simulation from './Simulation';

const LM = new OptimizedLevenbergMarqardt();

const keys = ob => Object.keys(ob);

document.addEventListener('dragstart', ev => {
  ev.preventDefault();
});

document.body.style.margin = 0;

const bufferWidth = 800;
const bufferHeight = 600;

const simulation = new Simulation({
  width: bufferWidth,
  height: bufferHeight,
  maxSpeed: 3,
  diseaseRadius: 10,
  baseInfectionDuration: 15,
  baseImmunityDuration: 360,
  personRadius: 3,
  numberOfPeople: 1200,
  subways: [
    {
      x: 200,
      y: 300,
      r: 100,
    },
    {
      x: 600,
      y: 300,
      r: 100,
    },
  ],
});

const Rect = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border: 5px solid ${({ color }) => color};
  box-sizing: border-box;
  ${({ focus }) => focus && 'background: rgba(255, 255, 255, 0.5);'};
`;

// let time = new Date();

const Controls = styled.div`
  width: ${({ width }) => width}px;
  background: blue;
`;

const Button = styled.div`
  background: white;
  color: black;
  border: 1px solid black;
  width: 150px;
  text-align: center;
  font-family: sans-serif;
  padding: 0.5rem 0;
  margin: auto;
`;

const ControlerWrapper = styled.div`
  ${({ focus }) => focus && 'background: rgba(255, 255, 255, 0.5);'};
`;

class ControlRow extends React.PureComponent {
  static propTypes = {
    focus: PropTypes.bool,
    selectedAsReference: PropTypes.bool,
    viewColorPicker: PropTypes.func,
    changeSize: PropTypes.func,
    setAsReference: PropTypes.func,
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  };
  setAsReference = () => {
    this.props.setAsReference(this.props.id);
  };
  open = () => {
    this.props.viewColorPicker(this.props.id);
  };
  changeWidth = ev => {
    this.props.changeSize(this.props.id, {
      width: Number(ev.currentTarget.value),
      height: this.props.height,
    });
  };
  changeHeight = ev => {
    this.props.changeSize(this.props.id, {
      width: this.props.width,
      height: Number(ev.currentTarget.value),
    });
  };
  render() {
    return (
      <ControlerWrapper focus={this.props.focus}>
        <Button onClick={this.open}>Change color</Button>
        Width:{' '}
        <input
          type="number"
          onChange={this.changeWidth}
          value={this.props.width}
        />
        Height:{' '}
        <input
          type="number"
          onChange={this.changeHeight}
          value={this.props.height}
        />
        {!this.props.selectedAsReference && (
          <Button onClick={this.setAsReference}>Set this as reference</Button>
        )}
      </ControlerWrapper>
    );
  }
}

const AbsolutPsed = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 0;
  width: 0;
  ${({ focus }) => focus && 'z-index: 2;'};
`;

// eslint-disable-next-line
class DragableSIRSampleArea extends React.PureComponent {
  static propTypes = {
    onStop: PropTypes.func,
    onStart: PropTypes.func,
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    bounds: PropTypes.object,
    focus: PropTypes.bool,
    color: PropTypes.string,
  };
  onStop = (_, { x, y }) => {
    this.props.onStop(this.props.id, x, y);
  };
  onStart = () => {
    this.props.onStart(this.props.id);
  };
  render() {
    const { width: w, height: h, bounds, focus } = this.props;
    return (
      <AbsolutPsed focus={focus}>
        <Draggable
          onStart={this.onStart}
          onStop={this.onStop}
          defaultPosition={{ x: 0, y: 0 }}
          bounds={{
            left: 0,
            top: 0,
            right: bounds.x - w,
            bottom: bounds.y - h,
          }}
        >
          <Rect width={w} height={h} focus={focus} color={this.props.color} />
        </Draggable>
      </AbsolutPsed>
    );
  }
}

// eslint-disable-next-line
class App extends React.PureComponent {
  state = {
    width: bufferWidth,
    height: bufferHeight,
    sirGraphWidth: 800,
    sirGraphHeight: 300,
    sirReferenceID: 'initialid',
    sirs: {
      initialid: {
        width: bufferWidth,
        height: bufferHeight,
        x: 0,
        y: 0,
        color: 'cyan',
      },
    },
    sirSquareFocus: null,
    playLive: false,
    colorPicker: false,
  };

  componentDidMount() {
    this.frames[0] = simulation.getInitialFrame();
    this.renderCanvas(...this.frames[0]);
    this.initializeTicks();
  }

  frames = [];
  tick() {
    this.frames[this.frames.length] = simulation.update(
      ...this.frames[this.frames.length - 1]
    );
    this.renderCanvas();
    this.renderSIR();
  }

  addSIR = () => {
    const id = uuid();
    this.setState(prevState => ({
      sirs: {
        ...prevState.sirs,
        [id]: {
          color: '#000000',
          width: 300,
          height: 300,
          x: 0,
          y: 0,
        },
      },
      sirSquareFocus: id,
    }));
  };

  updateSIR = (id, x, y) => {
    this.setState(prevState => ({
      sirs: {
        ...prevState.sirs,
        [id]: {
          ...prevState.sirs[id],
          x,
          y,
        },
      },
      sirSquareFocus: id,
    }));
  };
  focus = id => {
    this.setState({
      sirSquareFocus: id,
    });
  };
  togglePlay = () => {
    this.setState(prevState => ({
      playLive: !prevState.playLive,
    }));
  };

  openColorPicker = id => {
    this.setState({
      colorPicker: id,
    });
  };
  closeColorPicker = color => {
    this.setState(prevState => ({
      sirs: {
        ...prevState.sirs,
        [prevState.colorPicker]: {
          ...prevState.sirs[prevState.colorPicker],
          color: color.hex,
        },
      },
      colorPicker: false,
    }));
  };

  changeRectSize = (id, { height, width }) => {
    this.setState({
      sirs: {
        ...this.state.sirs,
        [id]: {
          ...this.state.sirs[id],
          width,
          height,
        },
      },
    });
  };

  setSirReference = id => {
    this.setState({
      sirReferenceID: id,
    });
  };

  initializeTicks = () => {
    if (this.state.playLive) {
      this.tick();
    }
    window.requestAnimationFrame(this.initializeTicks);
  };

  SIR = {
    alpha: 0.1,
    tau: 20,
    mu: 0.1,
    omega: 0.1,
    starts: {
      S: 1200,
      I: 3,
      R: 0,
      D: 0,
    },
  };

  renderSIR = () => {
    const c = this.graphBuffer;
    c.clearRect(0, 0, this.state.sirGraphWidth, this.state.sirGraphHeight);
    const sirKeys = keys(this.state.sirs);
    if (!sirKeys.length) return;

    const graphs = {};
    for (let u = 0; u < sirKeys.length; u += 1) {
      graphs[sirKeys[u]] = [];
      const { x, y, width, height, color } = this.state.sirs[sirKeys[u]];

      c.strokeStyle = color;

      for (let k = 0; k < this.frames.length; k += 1) {
        const frame = this.frames[k];
        const numberOfPeople = frame[0].length;

        let suceptible = 0;
        let infected = 0;
        let dead = 0;
        let recovered = 0;
        let people = 0;

        const [
          xPositions,
          yPositions,
          infectionMatrix,
          immunityMatrix,
          deathMatrix,
        ] = frame;

        for (let i = 0; i < numberOfPeople; i += 1) {
          // loop people
          const pX = xPositions[i];
          const pY = yPositions[i];

          if (pX >= x && pX <= x + width && pY >= y && pY <= y + height) {
            people += 1;
            if (deathMatrix[i]) {
              dead += 1;
            } else if (infectionMatrix[i]) {
              infected += 1;
            } else if (immunityMatrix[i]) {
              recovered += 1;
            } else {
              suceptible += 1;
            }
          }
        }
        graphs[sirKeys[u]][k] = {
          dead: dead / people,
          infected: infected / people,
          recovered: recovered / people,
          suceptible: suceptible / people,
        };
      }
    }

    // const stepSize = Math.min(1 / this.frames.length, 0.01);


    const xSpacing = this.state.sirGraphWidth / this.frames.length;

    sirKeys.forEach(graphKey => {
      const { color: rectColor } = this.state.sirs[graphKey];
      const curves = [
        { key: 'suceptible', color: 'rgba(0, 0, 255, 0.1)' },
        { key: 'infected', color: 'rgba(255, 0, 0, 0.1)' },
        { key: 'recovered', color: 'rgba(0, 255, 0, 0.1)' },
        { key: 'dead', color: 'rgba(255, 255, 255, 0.1)' },
      ];
      curves.forEach(({ key, color }) => {
        c.strokeStyle = rectColor;
        c.lineWidth = 1;

        const initialValue =
          this.state.sirGraphHeight * (1 - graphs[graphKey][0].infected);

        c.beginPath();
        c.moveTo(0, initialValue);

        for (let k = 1; k < this.frames.length; k += 1) {
          const vX = k * xSpacing;
          const vY = this.state.sirGraphHeight * (1 - graphs[graphKey][k][key]);
          c.lineTo(vX, vY);
        }
        c.stroke();
        c.strokeStyle = color;
        c.lineWidth = 5;
        c.stroke();
        c.closePath();
      });

      if (graphKey === this.state.sirReferenceID) {
        // if (this.frames.length % 100 === 0) {
        //   LM.setData(graphs[graphKey], this.frames.length);
        //   LM.calculate();
        //   LM.plot({
        //     context: c,
        //     elapsedTime: this.frames.length,
        //     width: this.state.sirGraphWidth,
        //     height: this.state.sirGraphHeight,
        //   });
        // }


        // curves.forEach(({ color }, index) => {
        //   c.strokeStyle = 'orange';
        //   c.lineWidth = 1;
        //   const initialValue =
        //     this.state.sirGraphHeight * (1 - solution(0)[index]);
        //   c.beginPath();
        //   c.moveTo(0, initialValue);
        //   for (let k = 1; k < this.frames.length; k += 1) {
        //     const vX = k * xSpacing;
        //     const vY = this.state.sirGraphHeight * (1 - solution(k)[index]);
        //     c.lineTo(vX, vY);
        //   }
        //   c.stroke();
        //   c.strokeStyle = color;
        //   c.lineWidth = 5;
        //   c.stroke();
        //   c.closePath();
        // });

      }
    });
  };

  renderCanvas() {
    simulation.render(...this.frames[this.frames.length - 1]);
  }
  renderNextFrame = () => {
    this.tick();
  };

  render() {
    return (
      <div>
        <canvas
          ref={el => {
            if (!this.simulationBuffer) {
              this.simulationBuffer = el.getContext('2d');
            }
            simulation.setContext(this.simulationBuffer);
          }}
          width={this.state.width}
          height={this.state.height}
        />
        <button onClick={this.togglePlay}>
          {this.state.playLive ? 'pause' : 'play'}
        </button>
        <button onClick={this.renderNextFrame}>Next frame</button>
        {this.state.colorPicker && (
          <GithubPicker
            color={this.state.sirs[this.state.colorPicker].color}
            onChangeComplete={this.closeColorPicker}
          />
        )}
        <Controls width={this.state.width}>
          {Object.keys(this.state.sirs).map(id => (
            <ControlRow
              key={id}
              id={id}
              focus={this.state.sirSquareFocus === id}
              viewColorPicker={this.openColorPicker}
              changeSize={this.changeRectSize}
              width={this.state.sirs[id].width}
              height={this.state.sirs[id].height}
              selectedAsReference={id === this.state.sirReferenceID}
              setAsReference={this.setSirReference}
            />
          ))}
          <div>
            <Button onClick={this.addSIR}>Add SIR graph</Button>
          </div>
        </Controls>
        <canvas
          style={{ backgroundColor: '#1a1a1a' }}
          ref={el => {
            if (!this.graphBuffer) this.graphBuffer = el.getContext('2d');
          }}
          width={this.state.sirGraphWidth}
          height={this.state.sirGraphHeight}
        />
        {Object.keys(this.state.sirs).map(id => (
          <DragableSIRSampleArea
            onStop={this.updateSIR}
            key={id}
            id={id}
            width={this.state.sirs[id].width}
            height={this.state.sirs[id].height}
            bounds={{ x: this.state.width, y: this.state.height }}
            focus={this.state.sirSquareFocus === id}
            onStart={this.focus}
            color={this.state.sirs[id].color}
          />
        ))}
      </div>
    );
  }
}

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(<App />, mountNode);
