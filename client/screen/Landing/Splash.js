import React, {useEffect, useState} from 'react'
import {
    View,
    ImageBackground, Text, TouchableOpacity, Dimensions, StyleSheet,
} from 'react-native'

const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
import {styles} from '../styles';
const texts = require("../../assets/Texts.json");
const image = require("../../assets/Splash.png");

const Splash = props => {
    const [showButtons, setShowButtons] = useState(false);
    const validateJWT = async() => {
      const response = await handler.sendRequest(endpoints.Server.User.Auth.ValidateJWT,
          handler.HTTP.Method.Get,
          true,
          props)
      if(response.ok){
          setTimeout(() => {props.navigation.navigate('Home')}, 1000)
      }else{
          setTimeout(() => {setShowButtons(true)}, 1000)
      }
    }
    useEffect(() => {
        validateJWT()
    }, []);
    
    if(showButtons){
        return (
            <View style={styles.empty}>
                <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                    <View style={customeStyles.ButtonView}>
                        <TouchableOpacity style={styles.Button}  onPress={() => {
                            props.navigation.navigate({routeName: 'Login'})
                        }}>
                            <Text style={styles.font}>{texts.Splash.Buttons.Login}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.Button} onPress={() => {
                            props.navigation.navigate({routeName: 'Signup'})
                        }}>
                            <Text style={styles.font}>{texts.Splash.Buttons.SignUp}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        )
    }else{
        return (
            <View style={styles.empty}>
                <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                </ImageBackground>
            </View>
        )
    }

}

const {height, width} = Dimensions.get('window');
const customeStyles = StyleSheet.create({
    ButtonView : {
        position: 'absolute',
        bottom:0
    }
})
export default Splash;
