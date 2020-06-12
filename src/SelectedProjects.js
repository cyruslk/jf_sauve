import React, { Component } from 'react';
import './App.css';



class SelectedProjects extends Component {


  constructor(props) {
     super(props);
     this.state = {
       selectedProjectsArray: []
     };
   }

   componentDidMount(){

     let selected_projects = this.props.selected_projects;

     if(!selected_projects){
       return null;
     }

     let mapStuffs = selected_projects.map((ele => {
       let section = ele.gsx$type.$t
       let selectedProjectsArray = this.state.selectedProjectsArray;
       if(selectedProjectsArray.indexOf(section) === -1) {
           return selectedProjectsArray.push(section)
       }
     }));
   }

   renderSubMenu = () => {
     console.log(this.state.selectedProjectsArray.length);
     // let selectedProjectsArrayMaped = this.state.selectedProjectsArray
     // .map((index, ele) => {
     //   return (
     //     <span key={index}>{ele}</span>
     //   )
     // })
     // console.log(selectedProjectsArrayMaped);
     // return selectedProjectsArrayMaped;
     return (
       <span>fvdvd</span>
     )
   }


  render() {
      return(
        <div>
          {this.renderSubMenu()}
        </div>
      )
  }
}

export default SelectedProjects;
