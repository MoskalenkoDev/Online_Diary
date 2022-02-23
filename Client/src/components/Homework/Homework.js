import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux';
import './Homework.scss';
import {TeacherHomework} from './TeacherHomework/TeacherHomework';
import {StudentHomework} from './StudentHomework/StudentHomework';
class Homework extends Component
{
    render()
    {
        switch(window.localStorage.getItem('userType'))
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
  return{...state.homeworkState}
}

export const WrappedHomework = connect(mapStateToProps)(Homework);