import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
const preFix = "https://spreadsheets.google.com/feeds/list/";
const sheetID = "1n2-gyTA4D4Qprxn_e4o2UEVz-E5mhTYelFaZnm_Aa1w";
const postFix = "/od6/public/values?alt=json"
const spreadsheetURL = preFix+sheetID+postFix;
var _ = require('lodash');


class Thumbnails extends Component {

  constructor(props) {
       super(props);
       this.state = {
         backgroundColour: '#'+Math.random().toString(16).substr(-6),
         thumbnails_data: "",
         x: 200,
         y: 200
       };
     }

     componentDidMount(){
       window.scrollTo(0, 0);
        axios.get(spreadsheetURL)
        .then((response) => {
          const shuffledResponse = _.shuffle(response.data.feed.entry);
          this.setState({
            thumbnails_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "thumbnails")
          })
        })
        .catch(function (error) {
          console.log(error);
        });
       }

       returnRandomScale(){
         const scaleClass = ["scale_04","scale_05","scale_06","scale_07", "scale_08", "scale_09", "scale_1"];
         return scaleClass[Math.floor(Math.random()*scaleClass.length)]
       }




       render() {

         if(this.state.thumbnails_data.length === 0){
           return(
             <div className="loader">
               <span>
                 LOADING
               </span>
             </div>
           )
         }else{
           const thumbnails_rendered = this.state.thumbnails_data.map((ele, i) => {
             return (
               <img src={ele.gsx$link.$t}
               className={this.returnRandomScale()}
               onClick={() => this.handleSortEnter(ele.gsx$link.$t, i)}
               />
             )
             console.log(thumbnails_rendered, "-------");
           })

           return(
             <div className="img_thumbnails">
              {thumbnails_rendered}
             </div>
           )
         }
       }
     }


export default Thumbnails;
