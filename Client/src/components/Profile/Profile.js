import React, { Component, Fragment } from 'react';
import $api from '../../http/axios_instance';
import { connect } from 'react-redux';
import { change_is_logged } from '../../Redux/Actions/action_signup';
import { Student_Profile } from './Student_Profile/Student_Profile';
import { Teacher_Profile } from './Teacher_Profile/Teacher_Profile';
import { profile_get_data } from '../../controllers/ProfileController';
import './Profile.scss';
import { Redirect } from 'react-router-dom';

class Profile extends Component {

    async componentDidMount() {
        console.log("yes")
        await profile_get_data(this.props.userType)(this.props.dispatch);
    }

    render() {
        if (!this.props.isLogged) return (<Redirect to="/signup" />);
        switch (this.props.userType) {
            case "student": return (<Student_Profile input_data={this.props} />);
            case "teacher": return (<Teacher_Profile input_data={this.props} />);
        }

        return (
            <Fragment></Fragment>
        );
    }
}

const mapStateToProps = (state) => // кладет стейт в качестве пропса в наш компонент (который мы законектили)
{
    return { ...state.profileState, ...state.signupState }
}

export const WrappedProfile = connect(mapStateToProps)(Profile);