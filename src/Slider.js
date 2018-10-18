import React, { Component } from 'react';
import axios from 'axios';
import getRandomPathIndex from './SvgPaths.js';
import './App.css';
const preFix = "https://spreadsheets.google.com/feeds/list/";
const sheetID = "1n2-gyTA4D4Qprxn_e4o2UEVz-E5mhTYelFaZnm_Aa1w";
const postFix = "/od6/public/values?alt=json"
const spreadsheetURL = preFix+sheetID+postFix;
var _ = require('lodash');


class Slider extends Component {

  constructor(props) {
       super(props);
       this.state = {
         backgroundColour: '#'+Math.random().toString(16).substr(-6),
         slider_data: "",
         visible_data_slider: "",
         counter: 0,
         image_caption_slider: "Click for more",
         x: 200,
         y: 200
       };
       this._onMouseClick = this._onMouseClick.bind(this);
       this._onMouseMove = this._onMouseMove.bind(this);
     }


     componentDidMount(){
       window.scrollTo(0, 0);
        axios.get(spreadsheetURL)
        .then((response) => {
          const shuffledResponse = _.shuffle(response.data.feed.entry);
          this.setState({
            slider_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "slider"),
          })
          console.log(this.state.slider_data, "------");
        })
        .catch(function (error) {
          console.log(error);
        });
       }


       _onMouseClick(e){
         const  newCol = '#'+Math.random().toString(16).substr(-6);
         const actualCounter = this.state.counter + 1;
         this.setState({
           backgroundColour: newCol,
           counter: actualCounter,
           image_caption_slider: this.state.slider_data[this.state.counter].gsx$caption.$t
         })

         const itemsToRender_slider = this.state.slider_data
         .slice(this.state.counter, this.state.counter+1)
         .map((ele, i) => {
         const randomLeftOrRight = { [this.returnRandom()]: 0, display: "block"};

             if(ele.gsx$link.$t.length > 0){
             return (
               <div key={i*3}>
                 <img src={ele.gsx$link.$t} alt={`img${i}`} key={i*3}
                 style={randomLeftOrRight}/>
               </div>
             )
           }else{
             return(
               <div key={3} id="svg_container">
                <svg
                viewBox="0 0 2000 1000"
                id="svg">
                  <path d={getRandomPathIndex()}
                  fill="transparent" id="curve"/>
                  <a>
                  <text id="svg_text" x="0" y="0" fill="white">
                    <textPath xlinkHref="#curve" startOffset="100%">
                      {ele.gsx$additionaltxt.$t}
                      <animate attributeName="startOffset"
                      from="100%" to="-180%"
                      begin="0s" dur="15s" repeatCount="indefinite"/>
                   </textPath>
                  </text>
                  </a>
                  </svg>
                </div>
              )
           }
         })

         this.setState({
           visible_data_slider: itemsToRender_slider,
         })

         if(this.state.slider_data.length === this.state.counter+1){
           this.setState({
             counter: 0
           });
         }
        }

        returnRandom(){
          let leftOrRight = ["left", "right"]
          return leftOrRight[Math.floor(Math.random() * leftOrRight.length)];
        }


       _onMouseMove(e){
         this.setState({
           x: e.screenX,
           y: e.screenY
         });
       }



       render() {

         if(this.state.slider_data.length === 0){
           return(
             <div className="loader">
               <span>
                 LOADING
               </span>
             </div>
           )
         }else{
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

           return(
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
                 <div className="main_slider_wrapper">
                 <section className="img_container">
                     {this.state.visible_data_slider}
                 </section>
                 </div>
             </div>
           )
         }
       }
     }


export default Slider;
