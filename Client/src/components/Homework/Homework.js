import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import './Homework.scss';
import {TeacherHomework} from './TeacherHomework/TeacherHomework';
import {StudentHomework} from './StudentHomework/StudentHomework';
class Homework extends Component
{
    render()
    {   
        if(!this.props.isLogged) return (<Redirect to = "/signup" />);
        switch(this.props.userType)
        {
            case "teacher" :
                return(<TeacherHomework state = {this.props}/>)
            case "student" :
                return(<StudentHomework state = {this.props}/>)
        } 
        return(
            <Fragment>

            </Fragment>
        )

    }
}

const mapStateToProps = (state) => // кладет стейт в качестве пропса в наш компонент (который мы законектили)
{
  return{...state.homeworkState, ...state.signupState}
}

export const WrappedHomework = connect(mapStateToProps)(Homework);