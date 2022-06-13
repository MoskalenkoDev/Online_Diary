import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import './SchoolMarks.scss';
import {StudentSchoolMarks} from './StudentSchoolMarks/StudenSchoolMarks';
import {TeacherSchoolMarks} from './TeacherSchoolMarks/TeacherSchoolMarks';

class SchoolMarks extends Component
{
    
    render()
    {   
        if(!this.props.isLogged) return (<Redirect to = "/signup" />);
        switch(this.props.userType)
        {
            case "teacher" :
                return(<TeacherSchoolMarks state = {this.props}/>)
            case "student" :
                return(<StudentSchoolMarks state = {this.props}/>)
        } 
        return(
            <Fragment>

            </Fragment>
        )

    }
}

const mapStateToProps = (state) => { // кладет стейт в качестве пропса в наш компонент (который мы законектили)
  return{...state.schoolMarksState,...state.signupState}
}

export const WrappedSchoolMarks = connect(mapStateToProps)(SchoolMarks);