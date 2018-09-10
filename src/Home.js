import React, { Component } from 'react';
import './App.css';
import ImagesRandom from "./ImagesRandom.js"
import axios from 'axios';
import IdleTimer from 'react-idle-timer';
const preFix = "https://spreadsheets.google.com/feeds/list/";
const sheetID = "1n2-gyTA4D4Qprxn_e4o2UEVz-E5mhTYelFaZnm_Aa1w";
const postFix = "/od6/public/values?alt=json"
const spreadsheetURL = preFix+sheetID+postFix;
var _ = require('lodash');



class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        slidedValueThumbs: 0,
        backgroundColour: "blue",
        counter: 0,
        displayThumbnails: false,
        img_links: "",
        intermezzoDisplay: "none",
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        slider_data: "",
        thumbnails_data: "",
        videos_data: "",
        info: false,
        videos: false,
        index: false,
        visible_data_slider: "",
        x: 200,
        y: 200,
        scroll: "hidden"
      };
      this.idleTimer = null;
      this.onIdleSlider = this.onIdleSlider.bind(this);
      this.onActiveInfo = this._onActiveInfo.bind(this);
      this._onMouseClick = this._onMouseClick.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
      this._toggleInfo = this._toggleInfo.bind(this);
      this._toggleIndex = this._toggleIndex.bind(this);
      this._toggleVideos = this._toggleVideos.bind(this);
      this._toggleMain = this._toggleMain.bind(this);
  }


  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    document.body.style.backgroundColor = "black";
     axios.get(spreadsheetURL)
     .then((response) => {
       const shuffledResponse = _.shuffle(response.data.feed.entry);
       this.setState({
         slider_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "slider"),
       })
       this.setState({
         thumbnails_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "thumbnails")
       })
       this.setState({
         about_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "about")
       })
     })
     .catch(function (error) {
       console.log(error);
     });
     axios.get(spreadsheetURL)
     .then((response) => {
       const shuffledResponse = _.shuffle(response.data.feed.entry);
       this.setState({
         videos_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "video_works")
       })
       console.log(this.state.videos_data);
     })
     .catch(function (error) {
       console.log(error);
     });
 }

 updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  handleOnChange = (value) => {
    this.setState({
      slidedValueThumbs: value
    })
  }


  _toggleInfo(e){
    this.setState({
      index: false,
      info: true,
      videos: false
    })
  }

  _toggleMain(e){
    this.setState({
      index: false,
      info: false,
      videos: false,
    })
  }

  _toggleIndex(e){
    this.setState({
      index: true,
      info: false,
      videos: false
    })
  }

  _toggleVideos(e){
    this.setState({
      index: false,
      info: false,
      videos: true
    })
  }

 _onMouseClick(e){
   const  newCol = '#'+Math.random().toString(16).substr(-6);
   const actualCounter = this.state.counter + 1
   this.setState({
     backgroundColour: newCol,
     counter: actualCounter
   })

   if(this.state.slider_data.length === this.state.counter+1){
     this.setState({
       counter: 0
     });
   }

   function returnRandom(){
     let leftOrRight = ["left", "right"]
     return leftOrRight[Math.floor(Math.random() * leftOrRight.length)];
   }

  const itemsToRender_slider = this.state.slider_data
                      .slice(this.state.counter, this.state.counter+1)
                      .map((ele, i) => {

  const randomLeftOrRight = { [returnRandom()]: 0, display: "block"};

      if(ele.gsx$link.$t.length > 0){
      return (
        <div key={i*3}>
          <img src={ele.gsx$link.$t} alt={`img${i}`} key={i*3}
          style={randomLeftOrRight}/>
        </div>
      )
    }else{
      return(
        <div className="main_text_container" key={i*2}>
          <p>{ele.gsx$additionaltxt.$t}</p>
        </div>
      )
    }
  })



  this.setState({
    visible_data_slider: itemsToRender_slider
  })
 }

_onMouseMove(e){
  this.setState({
    x: e.screenX,
    y: e.screenY
  });
}

 onIdleSlider(e) {
   console.log("not active");
   this.setState({
     intermezzoDisplay: "none"
   })
 }


 _onActiveInfo() {
   console.log("here");
   const  newCol = '#'+Math.random().toString(16).substr(-6);
   this.setState({
     backgroundColor: newCol
   })
 }


  render() {
    let styles = {
      width: "100vw",
      height: "100vh",
      backgroundColor: this.state.backgroundColour
      };

    let style_clicker = {
      position: "absolute",
      left: this.state.x,
      top:this.state.y
    }

    let style_Intermezzo = {
      display: this.state.intermezzoDisplay
    }

    const  newCol = '#'+Math.random().toString(16).substr(-6);
    let randomColorStyle = {
      backgroundColor: newCol
    }

    let pickendRandomColour = {
      backgroundColor: this.state.backgroundColour
    }

      return (
        <IdleTimer
        onIdleSlider={this.onIdleSlider}
        onActiveInfo={this.onActiveInfo}
        timeout={3000}>

        <div id="slider" className="App" style={styles}
             onClick={this._onMouseClick}
             onMouseMove={this._onMouseMove}>

            <section className="intermezzo" style={style_Intermezzo}>

              <section className="info_menu_intermezzo" style={randomColorStyle}>
                <span onClick={this._toggleIndex}>(1)index</span>
                <span onClick={this._toggleInfo}>(2)info</span>
                <span onClick={this._toggleVideos}>(3)video works</span>
              </section>
              <section className="info_menu_intermezzo" style={randomColorStyle}>
                <span onClick={this._toggleIndex}>(1)index</span>
                <span onClick={this._toggleInfo}>(2)info</span>
                <span onClick={this._toggleVideos}>(3)video works</span>
              </section>
              <section className="info_menu_intermezzo" style={randomColorStyle}>
                <span onClick={this._toggleIndex}>(1)index</span>
                <span onClick={this._toggleInfo}>(2)info</span>
                <span onClick={this._toggleVideos}>(3)video works</span>
              </section>
              <section className="info_menu_intermezzo" style={randomColorStyle}>
                <span onClick={this._toggleIndex}>(1)index</span>
                <span onClick={this._toggleInfo}>(2)info</span>
                <span onClick={this._toggleVideos}>(3)video works</span>
              </section>
            </section>

              <section className="main_info" style={style_clicker}>
                <div>
                <span>Jean François Sauvé</span>
                <span>{this.state.slider_data[this.state.counter].gsx$caption.$t}</span>
                </div>
            </section>
            <section className="counter_1">
            {this.state.counter}
            </section>
            <section className="counter_2">
            {this.state.slider_data.length}
            </section>
            <section className="info_menu">
            <span onClick={this._toggleIndex}>(1)index</span>
            <span onClick={this._toggleInfo}>(2)info</span>
            <span onClick={this._toggleVideos}>(3)video works</span>
            </section>
            <div className="main_slider_wrapper">
            <section className="img_container">
                {this.state.visible_data_slider}
            </section>
            </div>
        </div>
        </IdleTimer>

      );
}
}

export default App;
