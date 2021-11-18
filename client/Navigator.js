import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from "./screen/Authentication/Login";
import SignupScreen from "./screen/Authentication/Signup";
import HomeScreen from "./screen/Home/Home";
import ChatScreen from "./screen/Chat/Chat";
import {createAppContainer, NavigationActions, StackActions} from "react-navigation";
import ChatListScreen from "./screen/Chat/ChatList";
import Splash from './screen/Landing/Splash';
import ResetPasswordScreen from './screen/Authentication/ResetPassword';
import SettingScreen from './screen/Settings/Setting';
import VerificationScreen from './screen/Authentication/Verification'
import ForgotPasswordScreen from './screen/Authentication/ForgotPassword';
import GetEmailScreen from './screen/Authentication/GetEmail';
import ChangeAvatarScreen from './screen/Settings/ChangeAvatar';

import DemographicsScreen from "./screen/Onboarding/Demographics";
import PersonalScreen from "./screen/Onboarding/Personal";
import AcademicScreen from "./screen/Onboarding/Academic";
import {Button, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react'
import * as Font from 'expo-font';
import { forestgreen } from 'color-name';
import {Icon} from "react-native-elements";
const customFonts = {
    'timeburner': require('./assets/fonts/timeburner_regular.ttf'),
  };
const {height, width} = Dimensions.get('window');
Font.loadAsync(customFonts);
const Navigator = createStackNavigator({
    Splash: {
        screen:Splash,
        navigationOptions:{
            title:"",
            headerShown: false
        }
    },

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
                marginLeft: width * 0.03
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
                marginLeft: width * 0.03
            },
        }

    },
    Academic:{
        screen: AcademicScreen,
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
                marginLeft: width * 0.03
            },
        }

    },
    Login: {
        screen: LoginScreen,
        navigationOptions:{
            title:"",
            headerShown:false
        }
    },
    Signup: {
        screen:SignupScreen,
        navigationOptions:{
            title:"",
            headerShown:false
        }
    },
    Setting: {
        screen:SettingScreen,
        navigationOptions:{
            title:"Settings",
            headerStyle: {
                backgroundColor: 'rgb(0,41,93)',
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
    ChangeAvatar: {
        screen:ChangeAvatarScreen,
        navigationOptions: (screenProps) => {
            return {
                title:"Change Avatar",
                headerStyle: {
                    backgroundColor: 'rgb(0,41,93)'
                },
                headerTintColor: '#ffff',
                headerTitleStyle: {
                    fontFamily: "timeburner",
                    fontSize: 30,
                    marginLeft: width * 0.01
                },
                headerLeft: () => (
                    <Icon name="chevron-left" size={35} color="white" type="fontawesome5" style={{
                    }}
                          onPress={()=>{
                              const resetAction = StackActions.reset({
                                  index: 0,
                                  actions: [NavigationActions.navigate({ routeName: 'Setting' })],
                              });
                              screenProps.navigation.dispatch(resetAction)
                          }}
                    />
                )
            }
        }
    },
    ResetPassword: {
        screen:ResetPasswordScreen,
        navigationOptions:{
            title:"",
            headerShown:false
        }
    },
    Home:{
        screen:HomeScreen,
        navigationOptions:{
            title:"Profiles",
            headerStyle: {
                backgroundColor: 'rgb(0,41,93)',
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
        navigationOptions: (screenProps) => {
            return {
                title:screenProps.navigation.state.params.displayName,
                headerStyle: {
                    backgroundColor: 'rgb(0,41,93)'
                },
                headerTintColor: '#ffff',
                headerTitleAlign:"center",
                headerTitleStyle: {
                    fontFamily: "timeburner",
                    fontSize: 30,
                },
                headerLeft: () => (
                    <Icon name="chevron-left" size={35} color="white" type="fontawesome5" style={{
                    }}
                          onPress={()=>{
                              screenProps.navigation.navigate({
                                  routeName: 'ChatList'
                              })
                          }}
                    />
                )
            }
        },
    },
    ChatList:{
        screen: ChatListScreen,
        navigationOptions:{
            title:"Contacts",
            headerStyle: {
                backgroundColor: 'rgb(0,41,93)',
            },
            headerLeft: ()=> null,
            headerTintColor: '#ffff',
            headerTitleStyle: {
                fontFamily: "timeburner",
                fontSize: 30,
                alignSelf: 'center',
            },
        }
    },
    Verification: {
        screen: VerificationScreen,
        navigationOptions:{
            title:"",
            headerShown:false
        }
    },
    ForgotPassword: {
        screen: ForgotPasswordScreen,
        navigationOptions:{
            title:"",
        }
    },
    GetEmail: {
        screen: GetEmailScreen,
        navigationOptions:{
            title:"",
        }
    }

});

export default createAppContainer(Navigator);


