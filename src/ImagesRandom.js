import React, { Component } from 'react';
import './App.css';



class ImagesRandom extends Component {

  constructor(props) {
      super(props);
      this.state = {
        display: "none",
        thumbnails_data: "",
        bigThumbURL: "",
        id: "",
        slider: ""
      };
  }

  componentDidMount(){
    this.setState({
      thumbnails_data: this.props.thumbnails_data,
      id: this.props.id,
      className: this.props.className,
      slider: this.props.slider
    })
  }

  componentWillReceiveProps(newProps){
    this.setState({
      slider: this.newProps.slider
    })
}


    render() {


      if(this.props.slider === 0){
      return(
        <div className="img_thumbnails">
          vtrtrtrgrtgrgrxwx/x
            <img
            src={this.props.imgLink}
            className={this.props.className}
            />
        </div>
      )
    }else{
      return(
        <div className="img_thumbnails">
            -------
            <img
            src={this.props.imgLink}
            />
        </div>
      )
    }
  }
}

export default ImagesRandom;
