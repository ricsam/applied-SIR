import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import Simulation from './Simulation';
import SIR from './SIR';

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
  baseInfectionDuration: 180,
  baseImmunityDuration: 360,
  personRadius: 3,
  numberOfPeople: 1200,
  subways: [
    {
      x: 50,
      y: 50,
      r: 25,
    },
    {
      x: 150,
      y: 150,
      r: 50,
    },
  ],
});

const sir = new SIR();

const Rect = styled.div`
  width: ${({ width: w }) => w}px;
  height: ${({ height: h }) => h}px;
  border: 5px solid black;
  box-sizing: border-box;
  ${({ focus }) => focus && 'background: rgba(255, 255, 255, 0.5);'}
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
  ${({ focus }) => focus && 'background: rgba(255, 255, 255, 0.5);'}
  `;

class ControlRow extends React.PureComponent {
  static propTypes = {
    focus: PropTypes.bool,
  };
  render() {
    return <ControlerWrapper focus={this.props.focus}>wef</ControlerWrapper>;
  }
}

const AbsolutPsed = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 0;
  width: 0;
  ${({ focus }) => focus && 'z-index: 2;'}
`;

class DragableSIRSampleArea extends React.PureComponent {
  static propTypes = {
    onStop: PropTypes.func,
    onStart: PropTypes.func,
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    bounds: PropTypes.object,
    focus: PropTypes.bool,

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
          <Rect width={w} height={h} focus={focus} />
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
  };
  componentDidMount() {
    this.frames[0] = simulation.getInitialFrame();
    this.renderCanvas(...this.frames[0]);
  }
  frames = [];
  tick() {
    this.frames[this.frames.length] = simulation.update(...this.frames[this.frames.length - 1]);
    this.renderCanvas();
  }
  dragStopped = (_, { x, y }) => {
    this.renderSir(x, y);
  };

  addSIR = () => {
    const id = uuid();
    this.setState(prevState => ({
      sirs: {
        ...prevState.sirs,
        [id]: {
          color: 'black',
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
  }

  renderNextFrame = () => {
    this.tick();
  };
  renderCanvas() {
    simulation.setContext(this.simulationBuffer);
    simulation.render(...this.frames[this.frames.length - 1]);
  }
  renderSir(x, y) {
    sir.setContext(this.simulationBuffer);
    sir.render(...this.frames[this.frames.length - 1], x, y);
  }
  render() {
    return (
      <div>
        <canvas
          ref={el => {
            if (!this.simulationBuffer) { this.simulationBuffer = el.getContext('2d'); }
          }}
          width={this.state.width}
          height={this.state.height}
        />
        <Controls width={this.state.width}>
          {Object.keys(this.state.sirs).map(id => <ControlRow key={id} focus={this.state.sirSquareFocus === id} />)}
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
        <button onClick={this.renderNextFrame}>Next frame</button>
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
          />
        ))}
      </div>
    );
  }
}

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(<App />, mountNode);
