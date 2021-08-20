import {createStackNavigator} from 'react-navigation-stack';
import LandingScreen from './screen/Landing';
import LoginScreen from "./screen/Login";
import SignupScreen from "./screen/Signup";
import HomeScreen from "./screen/Home/Home";
import ChatScreen from "./screen/Chat/Chat";
import {createAppContainer} from "react-navigation";
import ChatListScreen from "./screen/Chat/ChatList";
import Splash from './screen/Splash';
import ResetPasswordScreen from './screen/ResetPassword';
import SettingScreen from './screen/Setting';

import DemographicsScreen from "./screen/onboarding/Demographics";
import PersonalScreen from "./screen/onboarding/Personal";
import AcedemicScreen from "./screen/onboarding/Acedemic";
import ReasonScreen from "./screen/onboarding/Reason";
import HobbiesScreen from "./screen/onboarding/Hobbies";
import SpecificHobbyScreen from "./screen/onboarding/SpecificHobby"
import ProjectInterestsScreen from "./screen/onboarding/Project-interests"
import IndustryScreen from "./screen/onboarding/Industry"
import {Dimensions} from 'react-native';

import * as Font from 'expo-font';
const customFonts = {
    'timeburner': require('./assets/fonts/timeburner_regular.ttf'),
  };
const {height, width} = Dimensions.get('window');
Font.loadAsync(customFonts);
const Navigator = createStackNavigator({
    Demographics:{
        screen: DemographicsScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    Personal:{
        screen: PersonalScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    Acedemic:{
        screen: AcedemicScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    Reason:{
        screen: ReasonScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    Hobbies:{
        screen: HobbiesScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    SpecificHobby:{
        screen: SpecificHobbyScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    ProjectInterests:{
        screen: ProjectInterestsScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    Industry:{
        screen: IndustryScreen,
        navigationOptions:{
            title:"Onboarding",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.23
            },
        }

    },
    Splash: {
        screen:Splash,
        navigationOptions:{
            title:"",
            headerShown: false
        }
    },
    Landing: {
        screen:LandingScreen,
        navigationOptions:{
            title:"",
            headerShown: false
        }
    },
    Login: {
        screen: LoginScreen,
        navigationOptions:{
            title:"",
        }
    },
    Signup: {
        screen:SignupScreen,
        navigationOptions:{
            title:"",
        }
    },
    Setting: {
        screen:SettingScreen,
        navigationOptions:{
            title:"Setting",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                alignSelf: 'center',
                fontFamily: "timeburner",
                fontSize: 30,
            },
        }
    },
    ResetPassword: {
        screen:ResetPasswordScreen,
        navigationOptions:{
            title:""
        }
    },
    Home:{
        screen:HomeScreen,
        navigationOptions:{
            title:"Home",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                alignSelf: 'center',
                fontFamily: "timeburner",
                fontSize: 30,
            },
        }
    },
    Chat:{
        screen:ChatScreen,
        navigationOptions:{
            title:"",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerTintColor: '#ffff',
            headerTitleStyle: {
                alignSelf: 'center',
                fontFamily: "timeburner",
                fontSize: 30,
            },
        }
    },
    ChatList:{
        screen: ChatListScreen,
        navigationOptions:{
            title:"Chat List",
            headerStyle: {
                backgroundColor: '#3590F2',
            },
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                marginLeft: width * 0.14
            },
        }
    },
    
});

export default createAppContainer(Navigator);


