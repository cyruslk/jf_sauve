import React, { Component } from 'react';
import HorizontalScroll from 'react-scroll-horizontal'
import ReactDOM from 'react-dom';
import './App.css';
import Videos from "./Videos.js";
import Flasher from "./Flasher.js";
import Slider from "./Slider.js";
import axios from 'axios';
import IdleTimer from 'react-idle-timer';
import ReactDOMServer from 'react-dom/server';
import getRandomPathIndex from './SvgPaths.js';
import getRandomPathIntermezzo from './SvgPathsIntermezzo.js';
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
         timerFlicker: 0,
         displayFlasher: "block",
         coloredMenu: false,
         styleFlicker: "",
         flickr_data: "",
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
         selected_projects: null,
         active_selected_project_content: null,
         active_selected_project_title: null,
         info: false,
         videos: false,
         index: false,
         toggleSelectedProject: false,
         visible_data_slider: "",
         x: 200,
         y: 200,
         scroll: "hidden",
         image_caption_slider: "Click for more",
         selected_projects_menu: null
       };
       this.idleTimer = null;
       this.onActive = this._onActive.bind(this)
       this.onIdle = this._onIdle.bind(this)
  }


componentDidMount(){
  document.addEventListener("keydown", this._handleKeyPress.bind(this));
  document.body.style.backgroundColor = "black";
   axios.get(spreadsheetURL)
   .then((response) => {
     const shuffledResponse = _.shuffle(response.data.feed.entry);
     this.setState({
       flickr_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "flickr_img"),
       slider_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "slider"),
       thumbnails_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "thumbnails"),
       info_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "info"),
       selected_projects: shuffledResponse.filter(ele => ele.gsx$section.$t === "selected_projects")
     }, () => {
       this.setState({
         main_text_info: this.state.info_data.filter(ele => ele.gsx$infotype.$t === "main_text")[0].gsx$additionaltxt.$t,
         inquiries_info: this.state.info_data.filter(ele => ele.gsx$infotype.$t === "inquiries"),
         other_links_info: this.state.info_data.filter(ele => ele.gsx$infotype.$t === "other_links"),
         videos_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "video_works"),
         selected_projects_menu: this.removeDuplicatesFromArray(this.state.selected_projects)
       })
     })
   })
   .catch(function (error) {
     console.log(error);
   });
 };


 removeDuplicatesFromArray = (array) => {
   let arrayMaped = array.map((ele, index) => {
     return ele.gsx$type.$t;
   })
   return arrayMaped.filter(function(item, index){
		return arrayMaped.indexOf(item) >= index;
	});
 }


 updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  _onHoverInfoText = () => {
    this.setState({
      backgroundColour: '#'+Math.random().toString(16).substr(-6),
    })
  };

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
  };

  handleSortEnter = (imgLink, i)  => {
     this.setState({
       img_thumbnails_bigger: imgLink,
       img_thumbnails_index: i,
       display_lightbox: "flex"
     })
  };

  handleSortLeave = () => {
     this.setState({
       img_thumbnails_bigger: "",
       display_lightbox: "none"
     })
  };


  _toggleInfo = (e) =>{
    this.setState({
      index: false,
      info: true,
      videos: false,
      intermezzoDisplay: false,
      displayFlasher: "none"
    })
  };

  _toggleMain = (e) =>{
    this.setState({
      index: false,
      info: false,
      videos: false,
      intermezzoDisplay: false,
      displayFlasher: "none"
    })
  };

  _toggleIndex = (e) =>{
    this.setState({
      index: true,
      info: false,
      videos: false,
      intermezzoDisplay: false,
      toggleSelectedProject: false,
      displayFlasher: "none",
      active_selected_project_content: null,
      active_selected_project_title: null
    })
  };

  _toggleVideos = (e) =>{
    this.setState({
      index: false,
      info: false,
      videos: true,
      intermezzoDisplay: false,
      displayFlasher: "none"
    })
  };

_onActive = (e) => {
  this.setState({
    intermezzoDisplay: false
  })
};

_onIdle = (e) =>{
  this.setState({
    intermezzoDisplay: true
  })
};

_onMouseMove = (e) => {
  this.setState({
    x: e.screenX,
    y: e.screenY
  });
}

 onIdleSlider = (e) => {
   this.setState({
     intermezzoDisplay: "block"
   })
 }

 _onActiveInfo = () => {
   const  newCol = '#'+Math.random().toString(16).substr(-6);
   this.setState({
     backgroundColor: newCol
   })
 };

 toggleSelectedProject = (eleToFilter, index) => {
   if(!this.state.selected_projects){return null};

   let selectedProjects = this.state.selected_projects;
   const filteredArray = selectedProjects.filter(category => category.gsx$type.$t === eleToFilter);
   this.setState({
     toggleSelectedProject: true,
     active_selected_project_content: filteredArray,
     active_selected_project_title: eleToFilter,
     coloredMenu: true
   })
 };

 displaySelectedProject = () => {
   if(!this.state.toggleSelectedProject){
     return null
   };
   let selectedProjectMapped = this.state.active_selected_project_content
   .map((ele, index) => {
     return (
       <img
       className="img_categories_selected"
       src={ele.gsx$link.$t}
       key={index} />
     )
   })

   if(this.state.windowWidth > 520){
     return (
       <HorizontalScroll reverseScroll={true}>
           {selectedProjectMapped}
       </HorizontalScroll>
     )
   }else{
    return(
      <div className="selected_projects_index_container">
        {selectedProjectMapped}
      </div>
    )
   }
 }


 subMenuProjectsHere = () => {

   if(!this.state.selected_projects_menu
     || this.state.toggleSelectedProject){
     return null;
   }

   let selectedProjectMaped = this.state.selected_projects_menu
   .map((ele, index) => {
     return (
       <li key={index}
        onClick={() => this.toggleSelectedProject(ele, index)}>
        {ele}
       </li>
     )
   });

   return (
     <div className="selected_projects_menu">
        <ul>{selectedProjectMaped}</ul>
      </div>
   )
   };

   closeSelectedProject = () => {
     if(!this.state.toggleSelectedProject){
       return null;
     }
     return (
       <div
        onClick={this.closeSelectedProjectStuff}
        className="close_selected_project">
          <span>back to all</span>
        </div>
     )
   }

   closeSelectedProjectStuff = () => {
     this.setState({
       toggleSelectedProject: false,
       coloredMenu: false
     })
   }

   toggleColor = () => {
     if(this.state.toggleSelectedProject){
       return {
         color: this.state.backgroundColour
       }
     }else{
       return {
         color: "white"
       }
     }
   }

   displayMenu = () => {
     return(
       <section id="info_menu_index" className="info_menu">
         <span onClick={this._toggleMain}> ←← </span>
         <span className="selected" onClick={this._toggleIndex}>(1)PHOTOS</span>
         <span onClick={this._toggleInfo}>(2)info</span>
         <span onClick={this._toggleVideos}>(3)video works</span>
         {this.subMenuProjectsHere()}
         {this.closeSelectedProject()}
       </section>
     )
   }


   displayAll = () => {

     if(this.state.toggleSelectedProject){return null};

     const thumbnails_rendered = this.state.thumbnails_data.map((ele, i) => {
         function returnRandomScale(){
           const scaleClass = ["scale_08", "scale_09", "scale_1"];
           return scaleClass[Math.floor(Math.random()*scaleClass.length)]
         }
       return (
         <div className="img_thumbnails" key={i}>
             <img src={ele.gsx$link.$t}
             className={returnRandomScale()}
             onClick={() => this.handleSortEnter(ele.gsx$link.$t, i)}/>
         </div>
       )
     })

     return (
       <section className="img_thumbnails_container" style={{backgroundColor: this.state.backgroundColour}}>
         {thumbnails_rendered}
       </section>
     )
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

       if(this.state.timerFlicker === this.state.flickr_data.length-1){
         clearInterval(this.interval);
         this.removeDiv();
       }

      return (
        <IdleTimer
        ref={ref => { this.idleTimer = ref }}
        element={document}
        onActive={this.onActive}
        onIdle={this.onIdle}
        timeout={55000}>
          <Flasher diplay={this.state.displayFlasher}/>
          <div style={{position: "relative"}}>
              <section className="white info_menu">
              <span onClick={this._toggleMain}> ←← </span>
              <span onClick={this._toggleIndex}>(1)PHOTOS</span>
              <span onClick={this._toggleInfo}>(2)info</span>
              <span onClick={this._toggleVideos}>(3)video works</span>
              </section>
          <Slider />
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
                timeout={55000}>

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
                         <span onClick={this._toggleIndex}>(1)PHOTOS</span>
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


              if(this.state.display_lightbox === "none"){


                return(
                  <IdleTimer
                  ref={ref => { this.idleTimer = ref }}
                  element={document}
                  onActive={this.onActive}
                  onIdle={this.onIdle}
                  timeout={55000}>
                  <div className="App" style={styles}
                  onKeyPress={this._handleKeyPress}
                  tabIndex="0">
                    {this.displayMenu()}
                    {this.displaySelectedProject()}
                    {this.displayAll()}
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
                  timeout={55000}>

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
                          <span onClick={this._toggleIndex}>(1)PHOTOS</span>
                          <span onClick={this._toggleInfo}>(2)info</span>
                          <span className="selected" onClick={this._toggleVideos}>(3)video works</span>
                          </section>

                          <section className="video_main_container">
                          </section>
                            {videosRendered}
                          </div>
                        )
                      }if(this.state.intermezzoDisplay === true){


                        const intermezzoArray = [];
                        for(var i=0; i<2; i++){

                           intermezzoArray.push(
                            <section className="info_menu_intermezzo"
                              key={i*3}>
                              <svg
                              viewBox="0 0 800 960"
                              id="svg_intermezzo">
                                <path d={getRandomPathIntermezzo()}
                                fill="transparent" id="curve"/>
                                <text id="svg_text_intermezzo"
                                x="0" y="0" fill={'#'+Math.random().toString(16).substr(-6)}>
                                  <textPath xlinkHref="#curve" startOffset="0%">
                                  <a className="links_intermezzo"
                                  onClick={this._toggleMain}>SLIDER</a>
                                  <a style={{visibility: "hidden"}}>-___-</a>
                                  <a className="links_intermezzo"
                                  onClick={this._toggleIndex}>INDEX</a>
                                  <a style={{visibility: "hidden"}}>-___-</a>
                                  <a className="links_intermezzo"
                                  onClick={this._toggleInfo}>INFO</a>
                                  <a style={{visibility: "hidden"}}>-___-</a>
                                  <a className="links_intermezzo"
                                  onClick={this._toggleVideos}>VIDÉOS</a>
                                  <animate attributeName="startOffset"
                                  from="100%" to="-180%"
                                  begin="0s" dur="15s" repeatCount="indefinite"/>
                                 </textPath>
                                </text>
                                </svg>
                             </section>
                          );
                        }
                      return(
                          <div className="intermezzo_container" style={{backgroundColor: "black"}}>
                          {intermezzoArray}
                          </div>
                      )
                  }
                    }
}
export default App;
