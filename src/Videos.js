import React, { Component } from 'react';
import Vimeo from '@u-wave/react-vimeo';
import './App.css';



class Videos extends Component {

  constructor(props) {
    super(props);

    this.state = {
      videoIndex: 0,
      volume: 1,
      paused: false,
      muted: false
    };

    this.handlePause = this.handlePause.bind(this);
    this.handlePlayerPause = this.handlePlayerPause.bind(this);
    this.handlePlayerPlay = this.handlePlayerPlay.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this._onHoverSound = this._onHoverSound.bind(this);
  }

  componentDidMount(){
    console.log(this.props.videos_data);
  }

  selectVideo(index) {
   this.setState({ videoIndex: index });
 }

 handlePause(event) {
   console.log("this shit is working");
   this.setState({
     paused: event.target.checked,
   });
   console.log(this.state.paused, "00000");
 }

 handlePlayerPause() {
   this.setState({ paused: true });
 }

 handlePlayerPlay() {
   this.setState({ paused: false });
 }


 handleVolume(event) {
   this.setState({
     volume: parseFloat(event.target.value),
   });
   console.log("this shit is working", this.state.volume);
 }

   _onHoverSound() {
     console.log("hover!");
   }

    render() {

      const { videoIndex, paused, volume } = this.state;

      return(
        <section
        className="video_container"
        onMouseEnter={this._onHoverSound}>
              <section className="vimeo_embed">
              <Vimeo
                  width={1296}
                  height={540}
                  muted={false}
                  video={this.props.videos_data.gsx$link.$t}
                />
              <div className="control_vimeo">
              <div className="control_vimeo_inner">
              <div>
                <span>{this.props.videos_data.gsx$caption.$t}</span>
                <span>{this.props.videos_data.gsx$additionaltxt.$t}</span>
              </div>
              <div>
                <input
                 type="checkbox"
                 id="paused"
                 checked={paused}
                 onChange={this.handlePause}
               />
              <input
                type="range"
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={this.handleVolume}
              />
              </div>
              </div>
              </div>
              </section>
            </section>

      )
  }
}

export default Videos;
