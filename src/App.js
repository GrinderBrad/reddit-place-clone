import React, { Component } from 'react';
import Konva from 'konva';
import axios from 'axios';
import { Stage, Layer, Star, Text, Image } from 'react-konva';
import { SketchPicker } from 'react-color';
import './App.css';


class App extends Component {
  state = {
    color: '#36c',
    image: new window.Image(),
    zoomLevel: 2
  }

  componentDidMount() {
      this.setImage('http://localhost:3000');
  }

  setImage = (src) => {
      const image = this.state.image;
      image.src = src;
      image.onload = () => this.imageNode.getLayer().batchDraw();
      this.setState({ image });
  };
  
  mouseEnter = () => {
      this.imageLayer.scale({
          x : this.state.zoomLevel,
          y : this.state.zoomLevel
      });
      this.imageLayer.draw();
  };
  mouseLeave = () => {
    this.imageLayer.scale({
        x : 1,
        y : 1
    });
    this.imageLayer.draw();
};
  mouseMove = () => {
    var pos = this.imageStage.getPointerPosition();
    if (pos.x >= 900 || pos.y >= 900) {
      return;
    }
    this.imageLayer.x( - (pos.x));
    this.imageLayer.y( - (pos.y));
    this.imageLayer.draw();
  }
  pickColor = (color) => {
    this.setState({color: color.rgb})
  }
  stageClick = (e) => {
    const coords = this.imageStage.getPointerPosition();
    axios.post('http://localhost:3000', {
      x: coords.x,
      y: coords.y,
      color: this.state.color
    });
    this.setImage('http://localhost:3000');
  }
  render() {
    return (
      <div style={{backgroundColor: 'lightgrey'}}>
        <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 1000}}>
        <SketchPicker style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}
            color={ this.state.color }
            onChangeComplete={ this.pickColor }
         />
        </div>
         
       <Stage width={window.innerWidth} height={window.innerHeight} ref={node => {
            this.imageStage = node;
          }}>
        <Layer onMouseMove={this.mouseMove} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} ref={node => {
            this.imageLayer = node;
          }}>
          <Image
          onClick={this.stageClick}
          image={this.state.image}
          ref={node => {
            this.imageNode = node;
          }}
        />
        </Layer>
      </Stage>
      </div>
    );
  }
}

export default App;