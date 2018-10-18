import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
const preFix = "https://spreadsheets.google.com/feeds/list/";
const sheetID = "1n2-gyTA4D4Qprxn_e4o2UEVz-E5mhTYelFaZnm_Aa1w";
const postFix = "/od6/public/values?alt=json"
const spreadsheetURL = preFix+sheetID+postFix;
var _ = require('lodash');


class Flasher extends Component {

  constructor(props) {
         super(props);
         this.state = {
           seconds: 0,
           flickr_data: "",
           display: "none"
         };
       }

       tick() {
         this.setState(prevState => ({
           seconds: prevState.seconds + 1
         }));
       }


       componentDidMount(){
         this.setState({
           display: this.props.display
         })
          axios.get(spreadsheetURL)
          .then((response) => {
            const shuffledResponse = _.shuffle(response.data.feed.entry);
            this.setState({
              flickr_data: shuffledResponse.filter(ele => ele.gsx$section.$t === "flickr_img")
            })
          })
          .catch(function (error) {
            console.log(error);
          });
          console.log(this.state.info_data);
          this.interval = setInterval(() => this.tick(), 350);
         }

       componentWillUnmount() {
         clearInterval(this.interval);
       }

       componentDidUpdate(){
         console.log(this.state);
         const lastTimer = this.state.flickr_data.length -1;
         console.log(lastTimer);
         if(this.state.seconds === lastTimer){
           clearInterval(this.interval);
         }
       }

       render() {

         if(this.state.flickr_data.length === 0){
           return(
             <div className="loader">
               <span>
                 LOADING
               </span>
             </div>
           )
         }else if(this.state.flickr_data.length-1 === this.state.seconds || this.props.diplay === "none"){
           return(
              <div>
              </div>
           )
         }else{
           return(
             <div className="flasher"
             style={{backgroundColor: "black", display: this.state.styleFlicker}}
             id="container">
               <img src={this.state.flickr_data[this.state.seconds].gsx$link.$t} />
             </div>
           )
         }
       }
     }


export default Flasher;
