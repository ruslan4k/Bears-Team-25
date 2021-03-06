//Renders the step 4 for create-applet

import React,{Component} from "react";
import { connect } from 'react-redux';
import ActionCard from "../ActionCard/ActionCard";

class Step4 extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	  this._validate=this._validate.bind(this);
	}
	_validate(key1,value1,key2,value2) {
		// a sanitized version of state can be passed instead
		this.props.afterValid(key1,value1,key2,value2);
	}
	render(){
		if (this.props.currentStep !== 4) {
			return null;
		}
		const service=this.props.service;
		const serviceFrom=this.props.serviceFrom;
		const serviceAction = this.props.serviceAction[service];
		//if the object does not have the functionality to do action from current trigger then return null
		if(serviceAction.hasOwnProperty(serviceFrom)===false){
			return null;
		}
		return(
			<div className="step-4">
				<ActionCard json={serviceAction[serviceFrom]} validate={this._validate}/>
			</div>
		);
	}
}

const mapStateToProps=state=>{
	return{
		serviceAction:state.action
	}
}

export default connect(mapStateToProps)(Step4);
