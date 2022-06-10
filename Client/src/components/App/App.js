import React,{Component} from 'react';
import './App.css';
import '../main.css';
import Welcome_page from '../Welcome_page/Welcome_page';
import Menu from '../Menu/Menu';
import {connect} from 'react-redux';
import {WrappedRegistration} from '../Registration/Registration';
import {WrappedProfile} from '../Profile/Profile';
import {WrappedHomework} from '../Homework/Homework';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Account_Activation} from '../Account_Activation/Account_Activation';

export default class  App extends Component
{

  render() 
  {  
    // є ідея що якщо уже тут змінити signup props то ререндер станеться і воно відкине сторінку назад
    return(
      <Router>
        <div className = "container">
          <Switch>
            <Route path= "/" exact><Welcome_page lang ={this.props}/></Route>
            <Route path = "/signup"><WrappedRegistration lang= {this.props}/></Route>
            <Route path= "/diary_menu"><Menu lang = {this.props}/></Route>
            <Route path="/account_activation/:accessToken"><Account_Activation lang = {this.props.language}/></Route>
          </Switch> 
          <Route path= "/diary_menu/profile" ><WrappedProfile lang = {this.props}/></Route>
          <Route path= "/diary_menu/homework"><WrappedHomework lang = {this.props}/></Route>
        </div>
      </Router>
    );  
  };
  
};

const mapStateToProps = (state) => // кладет стейт в качестве пропса в наш компонент (который мы законектили)
{
  return{...state.languageState}
}
export const WrappedApp = connect(mapStateToProps)(App);