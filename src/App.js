import React, { Component } from 'react';
import './App.css';
import ImagesRandom from "./ImagesRandom.js";
import Videos from "./Videos.js";
import axios from 'axios';
import IdleTimer from 'react-idle-timer';
import Slider from "react-slick";
import ReactDOMServer from 'react-dom/server';
import Marquee3k from 'marquee3000';
const preFix = "https://spreadsheets.google.com/feeds/list/";
const sheetID = "1n2-gyTA4D4Qprxn_e4o2UEVz-E5mhTYelFaZnm_Aa1w";
const postFix = "/od6/public/values?alt=json"
const spreadsheetURL = preFix+sheetID+postFix;
var _ = require('lodash');

class App extends Component {

  constructor(props) {
       super(props);
       this.state = {
         backgroundColour: '#'+Math.random().toString(16).substr(-6),
         counter: 0,
         displayThumbnails: false,
         display_lightbox: "none",
         img_links: "",
         intermezzoDisplay: false,
         windowWidth: window.innerWidth,
         windowHeight: window.innerHeight,
         img_thumbnails_bigger: "",
         img_thumbnails_index: "",
         slider_data: "",
         thumbnails_data: "",
         videos_data: "",
         info_data: "",
         main_text_info: "",
         inquiries_info: "",
         other_links_info: "",
         info: false,
         videos: false,
         index: false,
         visible_data_slider: "",
         x: 200,
         y: 200,
         scroll: "hidden",
         image_caption_slider: "Click for more"
       };
       this.idleTimer = null;
       this.onActive = this._onActive.bind(this)
       this.onIdle = this._onIdle.bind(this)
       this._onMouseClick = this._onMouseClick.bind(this);
       this._onMouseMove = this._onMouseMove.bind(this);
       this._toggleInfo = this._toggleInfo.bind(this);
       this._toggleIndex = this._toggleIndex.bind(this);
       this._toggleVideos = this._toggleVideos.bind(this);
       this._toggleMain = this._toggleMain.bind(this);
       this._onHoverInfoText = this._onHoverInfoText.bind(this);

  }

  componentDidMount(){
    document.addEventListener("keydown", this._handleKeyPress.bind(this));
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
         info_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "info")
       })
       this.setState({
         main_text_info: this.state.info_data
          .filter(ele => ele.gsx$infotype.$t === "main_text")[0].gsx$additionaltxt.$t
       })
       this.setState({
         inquiries_info: this.state.info_data
          .filter(ele => ele.gsx$infotype.$t === "inquiries")
       })
       this.setState({
         other_links_info: this.state.info_data
          .filter(ele => ele.gsx$infotype.$t === "other_links")
       })
       this.setState({
         videos_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "video_works")
       })
     })
     .catch(function (error) {
       console.log(error);
     });
     console.log(this.state.info_data);
    }

 updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onHoverInfoText(){
    this.setState({
      backgroundColour: '#'+Math.random().toString(16).substr(-6),
    })
  }

  _handleKeyPress = (value) => {
    if (value.charCode == 48) {
      return this._toggleMain();
    }
    if (value.charCode == 49) {
      return this._toggleIndex();
    }
    if (value.charCode == 50) {
      return this._toggleInfo();
    }
    if (value.charCode == 51) {
      return this._toggleVideos();
    }
  }

  handleSortEnter(imgLink, i) {
     console.log(imgLink, i);
     this.setState({
       img_thumbnails_bigger: imgLink,
       img_thumbnails_index: i,
       display_lightbox: "flex"
     })
  }

  handleSortLeave() {
       this.setState({
         img_thumbnails_bigger: "",
         display_lightbox: "none"
       })
       console.log("here going there");
    }


  _toggleInfo(e){
    this.setState({
      index: false,
      info: true,
      videos: false,
      intermezzoDisplay: false
    })
  }

  _toggleMain(e){
    this.setState({
      index: false,
      info: false,
      videos: false,
      intermezzoDisplay: false
    })
  }

  _toggleIndex(e){
    this.setState({
      index: true,
      info: false,
      videos: false,
      intermezzoDisplay: false
    })
  }

  _toggleVideos(e){
    this.setState({
      index: false,
      info: false,
      videos: true,
      intermezzoDisplay: false
    })
  }

_onActive(e) {
  console.log('user is  active', e)
  this.setState({
    intermezzoDisplay: false
  })
}

_onIdle(e) {
  console.log('user is not active', e)
  this.setState({
    intermezzoDisplay: false
  })
}


handlePause(event) {
  this.setState({
    paused: event.target.checked,
  });
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
}


 _onMouseClick(e){
   const  newCol = '#'+Math.random().toString(16).substr(-6);
   const actualCounter = this.state.counter + 1
   this.setState({
     backgroundColour: newCol,
     counter: actualCounter
   })
   this.setState({
     image_caption_slider: this.state.slider_data[this.state.counter]
                           .gsx$caption.$t
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
        <div key={i*3.3}>
        <svg width="800" height="600" viewBox="0 0 800 600"
            id="svg"
             preserveAspectRatio="none">
          <path
           transform="scale(3,1.2)"
          id="curve"
          fill="transparent"
          d="M 10 100 C 200 30 300 250 350 50" />
          <text id="svg_text" fill="white">
            <textPath className="text_path">
              {ele.gsx$additionaltxt.$t}


            </textPath>
          </text>
          </svg>
        </div>
      )
    }
  })

  function returnRandomScale(){
    const scaleClass = ["scale_04","scale_05","scale_06","scale_07", "scale_08", "scale_09", "scale_1"];
    return scaleClass[Math.floor(Math.random()*scaleClass.length)]
  }

  const itemsToRender_Thumbnails = this.state.thumbnails_data
      .map((ele, i) => {
      if(ele.gsx$link.$t.length > 0){
      return (
      <ImagesRandom
      key={i}
      imgLink={ele.gsx$link.$t}
      thumbnails_data={this.state.thumbnails_data}
      className={returnRandomScale()}
      slider={this.state.value}
      id={i}
      />
      )
    }
  })

  this.setState({
    visible_data_slider: itemsToRender_slider,
    visible_data_thumbnails: itemsToRender_Thumbnails,
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
     intermezzoDisplay: "block"
   })
 }

 _onActiveInfo() {
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

      let styles_info = {
      width: "100vw",
      height: "100vh",
      backgroundColor: "black"
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

    if(this.state.slider_data.length === 0
     && this.state.intermezzoDisplay === false){

      return(
        <div className="loader">
          <span>
            LOADING
          </span>
        </div>
      )
    }else if(this.state.slider_data.length > 0
     && this.state.info === false
     && this.state.videos === false
     && this.state.index === false
     && this.state.intermezzoDisplay === false){

      return (
        <IdleTimer
        ref={ref => { this.idleTimer = ref }}
        element={document}
        onActive={this.onActive}
        onIdle={this.onIdle}
        timeout={4000*3}>

        <div id="slider" className="App" style={styles}
             onClick={this._onMouseClick}
             onMouseMove={this._onMouseMove}
             onKeyPress={this._handleKeyPress}
             tabIndex="0">

          <section className="main_info" style={style_clicker}>
            <div>
            <span>Jean François Sauvé</span>
            <span>{this.state.image_caption_slider}</span>
            </div>
            </section>
            <section className="counter_1 ">
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
    }else if(this.state.info_data.length > 0
     && this.state.info === true
     && this.state.videos === false
     && this.state.index === false
     && this.state.intermezzoDisplay === false){

              const other_links_info_maped = this.state.other_links_info.map((ele, i) => {
                  return (
                    <a key={i*3.3} href={ele.gsx$link.$t} target="_blank">
                      {ele.gsx$additionaltxt.$t}
                    </a>
                  )
              })
              const inquiries_info_mapped = this.state.inquiries_info.map((ele, i) => {
                  return (
                    <a key={i*3.3} href={ele.gsx$link.$t} target="_blank">
                      {ele.gsx$additionaltxt.$t}
                    </a>
                  )
              })

              const mainTextNewArray = [];
              const mainTextOldArray = this.state.main_text_info.split("")


              function convertToSpans(oldArray, newArray) {
                oldArray.map((oldArrayItem, index) => {
                  if(oldArrayItem === " "){
                    return newArray.push(
                      <span key={index}
                      className="span_main_text">
                      {oldArrayItem}
                      </span>
                    );
                  }else{
                    return newArray.push(
                      <span key={index}
                      className="span_main_text">
                      {oldArrayItem}
                      </span>
                    );
                  }
                });
              }

              convertToSpans(mainTextOldArray, mainTextNewArray);


              return (
                <IdleTimer
                ref={ref => { this.idleTimer = ref }}
                element={document}
                onActive={this.onActive}
                onIdle={this.onIdle}
                timeout={4000*3}>

                 <div id="no_background" className="App" style={styles}
                  onClick={this._onMouseClick}
                  onKeyPress={this._handleKeyPress}
                  tabIndex="0">
                       <section className="about_page">
                         <div className="main_about">
                         <span className="sec_span_about">Jean François Sauvé ―</span>
                          <h1 onMouseOver={this._onHoverInfoText}
                              onMouseLeave={this._onHoverInfoText}>
                            {mainTextNewArray}
                          </h1>
                         </div>
                         <div className="secon_about">
                         <div>
                         <span className="sec_span_about">for any inquiries ―</span>
                         {inquiries_info_mapped}
                         </div>
                         <div>
                         <span className="sec_span_about">on the internet ―</span>
                          {other_links_info_maped}
                         </div>
                         </div>
                         </section>
                         <section className="black info_menu">
                         <span onClick={this._toggleMain}> ←← </span>
                         <span onClick={this._toggleIndex}>(1)index</span>
                         <span className="selected" onClick={this._toggleInfo}>(2)info</span>
                         <span onClick={this._toggleVideos}>(3)video works</span>
                         </section>
                     </div>
                 </IdleTimer>
            );
          }else if(this.state.slider_data.length > 0
          && this.state.info === false
          && this.state.videos === false
          && this.state.index === true
          && this.state.intermezzoDisplay === false){

              const thumbnails_rendered = this.state.thumbnails_data.map((ele, i) => {
                function returnRandomScale(){
                  const scaleClass = ["scale_04","scale_05","scale_06","scale_07", "scale_08", "scale_09", "scale_1"];
                  return scaleClass[Math.floor(Math.random()*scaleClass.length)]
                }
                return (
                    <IdleTimer
                    ref={ref => { this.idleTimer = ref }}
                    element={document}
                    onActive={this.onActive}
                    onIdle={this.onIdle}
                    timeout={4000*3}>
                        <div className="img_thumbnails" key={i*3.33}>
                        <img src={ele.gsx$link.$t}
                        className={returnRandomScale()}
                        onClick={() => this.handleSortEnter(ele.gsx$link.$t, i)}
                        key={i*3.33}
                        />
                  </div>
                  </IdleTimer>
                )
              })

              if(this.state.display_lightbox === "none"){
                return(
                  <IdleTimer
                  ref={ref => { this.idleTimer = ref }}
                  element={document}
                  onActive={this.onActive}
                  onIdle={this.onIdle}
                  timeout={4000*3}>
                  <div className="App" style={styles}
                  onKeyPress={this._handleKeyPress}
                  tabIndex="0">
                    <section className="img_thumbnails_container" style={{backgroundColor: this.state.backgroundColour}}>
                      {thumbnails_rendered}
                    </section>
                      <section id="info_menu_index" className="info_menu">
                      <span onClick={this._toggleMain}> ←← </span>
                      <span className="selected" onClick={this._toggleIndex}>(1)index</span>
                      <span onClick={this._toggleInfo}>(2)info</span>
                      <span onClick={this._toggleVideos}>(3)video works</span>
                      <span style={{color: "black", textTransform: "lowercase"}}>click to open</span>
                      </section>
                  </div>
                  </IdleTimer>
                )

              }if(this.state.display_lightbox === "flex"){
                return(
                  <IdleTimer
                  ref={ref => { this.idleTimer = ref }}
                  element={document}
                  onActive={this.onActive}
                  onIdle={this.onIdle}
                  timeout={4000*3}>

                  <div>
                    <section className="img_thumbnails_focus"
                    onClick={() => this.handleSortLeave()}
                     onMouseMove={this._onMouseMove}
                     style={{
                       display: this.state.display_lightbox,
                       backgroundColor: "black"}}>
                      <img src={this.state.img_thumbnails_bigger}/>
                      <section className="main_info" style={style_clicker}>
                         <span
                         style={{color: this.state.backgroundColour}}
                         className="anim_text_darkbox">
                         click to close
                         </span>
                         <span
                         style={{color: "white"}}>
                         {this.state.img_thumbnails_index+1}/{this.state.thumbnails_data.length}
                         </span>
                      </section>
                    </section>
                  </div>
                  </IdleTimer>
                )
              }
                  }else if(this.state.slider_data.length > 0
                   && this.state.info === false
                   && this.state.index === false
                   && this.state.videos === true
                   && this.state.intermezzoDisplay === false){
                    const videosRendered = this.state.videos_data.map((ele, i) => {
                      return (
                        <div key={i*4} id="videos">
                          <Videos videos_data={this.state.videos_data[i]}/>
                        </div>

                          )
                        })

                        return(


                          <div className="App_videos"
                          onKeyPress={this._handleKeyPress}
                          tabIndex="0">
                          <section id="info_menu_index" className="black info_menu">
                          <span onClick={this._toggleMain}>←←</span>
                          <span onClick={this._toggleIndex}>(1)index</span>
                          <span onClick={this._toggleInfo}>(2)info</span>
                          <span className="selected" onClick={this._toggleVideos}>(3)video works</span>
                          <span className="remove_mob" style={{color: "black",
                                        textTransform: "lowercase",
                                        display: "none",
                                        color: "white"}}>hover to add sound</span>
                          </section>

                          <section className="video_main_container">
                          </section>
                            {videosRendered}
                          </div>
                        )
                      }if(this.state.intermezzoDisplay === true){
                        const intermezzoArray = [];
                        for(var i=0; i<4; i++){
                           intermezzoArray.push(
                            <section className="info_menu_intermezzo"
                              key={i*3}>
                               <span onClick={this._toggleIndex}>(1)index</span>
                               <span onClick={this._toggleInfo}>(2)info</span>
                               <span onClick={this._toggleVideos}>(3)video works</span>
                             </section>
                          );
                        }
                      return(
                          <div>
                            {intermezzoArray}
                          </div>
                      )
                  }
                    }
}
export default App;
