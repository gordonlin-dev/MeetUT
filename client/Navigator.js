import {createStackNavigator} from 'react-navigation-stack';
import LandingScreen from './screen/Landing';
import LoginScreen from "./screen/Login";
import SignupScreen from "./screen/SIgnup";
import HomeScreen from "./screen/Home";
import {createAppContainer} from "react-navigation";

const Navigator = createStackNavigator({
    Landing: {
        screen:LandingScreen,
        navigationOptions:{
            title:""
        }
    },
    Login: {
        screen: LoginScreen,
        navigationOptions:{
            title:""
        }
    },
    Signup: {
        screen:SignupScreen,
        navigationOptions:{
            title:""
        }
    },
    Home:{
        screen:HomeScreen,
        navigationOptions:{
            title:"",
            headerShown: false
        }
    }
});

export default createAppContainer(Navigator);


