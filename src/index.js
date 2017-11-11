import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { GithubPicker } from 'react-color';
import Simulation from './Simulation';

document.addEventListener('dragstart', ev => {
  ev.preventDefault();
});

document.body.style.margin = 0;

const width = 800;
const height = 600;

const simulation = new Simulation({
  width: 800,
  height: 600,
  maxSpeed: 3,
  diseaseRadius: 10,
  baseInfectionDuration: 5,
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
  width: ${({ width: w }) => w}px;
  height: ${({ height: h }) => h}px;
  border: 5px solid ${({ color }) => color};
  box-sizing: border-box;
  ${({ focus }) => focus && 'background: rgba(255, 255, 255, 0.5);'};
`;

// let time = new Date();

const Controls = styled.div`
  width: ${({ width: w }) => w}px;
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
    viewColorPicker: PropTypes.func,
  };
  open = () => {
    this.props.viewColorPicker(this.props.id);
  };
  render() {
    return (
      <ControlerWrapper focus={this.props.focus}>
        <Button onClick={this.open}>Change color</Button>
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

// eslint-diable-next-line
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
    const {
      width: w, height: h, bounds, focus,
    } = this.props;
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
    width,
    height,
    sirGraphWidth: 600,
    sirGraphHeight: 300,
    sirs: {},
    sirSquareFocus: null,
    playLive: false,
    colorPicker: false,
  };

  componentDidMount() {
    this.frames[0] = simulation.getInitialFrame();
    this.renderCanvas(...this.frames[0]);
    this.initializeTicks();
  }

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

  initializeTicks = () => {
    if (this.state.playLive) {
      this.tick();
    }
    window.requestAnimationFrame(this.initializeTicks);
  };
  frames = [];
  tick() {
    this.frames[this.frames.length] = simulation.update(...this.frames[this.frames.length - 1]);
    this.renderCanvas();
    // this.renderSIR();
  }

  renderSIR = () => {
    this.graphBuffer.clearRect(0, 0, this.state.sirGraphWidth, this.state.sirGraphHeight);
    for (let k = 0; k < this.frames.length; k++) {
      const frame = this.frames[k];
      const frameSuceptible = [];
      const frameInfected = [];
      const framePeople = [];
      const frameDead = [];
      const frameRecovered = [];

      for (let i = 0; i < frame[0].length; i++) {
        const x = frame[0][i];
        const y = frame[1][i];
        if (x >= frame.x && x <= frame.x + frame.width && y >= frame.y && y <= frame.y + frame.height) {
          framePeople.push(i);
          if (frame[2][i]) { /* infectionMatrix */
            frameInfected.push(i);
          } else if (frame[3][i]) { /* immunityMatrix */
            frameRecovered.push(i);
          } else if (frame[4][i]) { /* deathMatrix */
            frameDead.push(i);
          } else {
            frameSuceptible.push(i);
          }
        }
      }
    }
    // this.graphBuffer.
  };

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
  renderCanvas() {
    simulation.setContext(this.simulationBuffer);
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
            />
          ))}
          <div>
            <Button onClick={this.addSIR}>Add SIR graph</Button>
          </div>
        </Controls>
        <canvas
          ref={el => {
            if (this.graphBuffer) this.graphBuffer = el.getContext('2d');
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
