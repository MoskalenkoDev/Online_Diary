import {useEffect} from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../../Redux/Actions/action_language';
import './Languages.css';

const Languages = ({color,language,activeClass,firstLabel,secondLabel,dispatch}) =>
{
    useEffect(() => 
    {
        changeLabel(language);
    },[]);

    const onActive = () =>
    {
        dispatch(actionCreators.change_language_active_class(activeClass === "active"? "" : "active"));
    }

    let dispatchChangeLabel = (first,second) =>
    {
        window.setTimeout(()=>{
            dispatch(actionCreators.change_language_first_label(first));
            dispatch(actionCreators.change_language_second_label(second));
        },400);
    }
    const changeLabel = (lang) =>
    {
        switch(lang) {
            case "ua" : {dispatchChangeLabel("ru","en"); break;}
            case "ru" : {dispatchChangeLabel("ua","en"); break;}
            case "en" : {dispatchChangeLabel("ua","ru"); break;}
        }
    }
    const pickLang = (lang) =>
    {
        dispatch(actionCreators.change_language_active_class(""));
        changeLabel(lang);
        dispatch(actionCreators.change_language(lang));
    }

    return(
        <nav className = {"languages_nav " + color} >
            <button id = "mainBtn" className = {activeClass} onClick = {()=> onActive()}>{language}</button>
            <div className= {"hidden_buttons " + activeClass}>
                <button onClick = {()=> pickLang(firstLabel)}>{firstLabel}</button>
                <button onClick = {()=> pickLang(secondLabel)}>{secondLabel}</button>      
            </div>
        </nav>
    );
};

const mapStateToProps = (state) => // кладет стейт в качестве пропса в наш компонент (который мы законектили)
{
  return{...state.languageState}
}

export const WrappedLanguages = connect(mapStateToProps)(Languages);