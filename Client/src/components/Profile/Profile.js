import React,{Component, Fragment} from 'react';
import $api from '../../http/axios_instance';
import {connect} from 'react-redux';
import * as actionCreators from '../../Redux/Actions/actions';
import {Student_Profile} from './Student_Profile/Student_Profile';
import {Teacher_Profile} from './Teacher_Profile/Teacher_Profile';
import { profile_get_data } from '../../controllers/ProfileController';
import './Profile.scss';

class Profile extends Component
{
    userType = localStorage.getItem("userType");

    componentDidMount() {
        profile_get_data()(this.props.dispatch);
    }

    render() {
        
        switch(this.userType) {

            case "student" : return(<Student_Profile input_data = {this.props}/>);
            case "teacher" : return(<Teacher_Profile input_data = {this.props}/>);
        }

        return(
            <Fragment></Fragment>
        );
    }
}

const mapStateToProps = (state) => // кладет стейт в качестве пропса в наш компонент (который мы законектили)
{
  return{...state.profileState}
}

export const WrappedProfile = connect(mapStateToProps)(Profile);