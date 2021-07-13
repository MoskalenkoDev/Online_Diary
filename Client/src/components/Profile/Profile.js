import React,{Component, Fragment} from 'react';
import Axios from 'axios';
import {connect} from 'react-redux';
import * as actionCreators from '../../Redux/Actions/actions';
import {Student_Profile} from './Student_Profile/Student_Profile';
import {Teacher_Profile} from './Teacher_Profile/Teacher_Profile';
import { Redirect} from 'react-router-dom';
import './Profile.scss';

class Profile extends Component
{
    componentDidMount()
    {
        Axios.post("http://localhost:3001/diary_menu/profile",{login : localStorage.getItem("userToken"), status : localStorage.getItem("status")}).then((response) =>
        {
            let destr = {...response.data};
            if(destr.name !== "") window.localStorage.setItem("isFillProfile",true);
            this.props.dispatch(actionCreators.change_input_data_all(destr));
        });
    }

    render()
    {
        if(!window.localStorage.getItem('userToken')) return ( <Redirect from = "/diary_menu/profile" to = "/signup"/>);
        else 
        {
            switch(localStorage.getItem("status"))
            {
                case "student" : return(<Student_Profile input_data = {this.props}/>);
                case "teacher" : return(<Teacher_Profile input_data = {this.props}/>);
            }
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