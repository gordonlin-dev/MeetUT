import React, {useEffect, useState} from 'react'
import {
    View, Dimensions,ImageBackground, Text, TouchableOpacity, Image, StyleSheet
} from 'react-native'

const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
const texts = require("../../assets/Texts.json");
const image = require("../../assets/bg.png");
const logo = require("../../assets/Logo-Transparent.png");
const title = require("../../assets/Title.png");
const {height, width} = Dimensions.get("window");

const Splash = props => {
    const [showButtons, setShowButtons] = useState(false);
    const validateJWT = async() => {
      const response = await handler.sendRequest(endpoints.Server.User.Auth.ValidateJWT,
          texts.HTTP.Get,
          null,
          true,
          props)
      if(response.ok){
          setTimeout(() => {props.navigation.navigate('Home')}, 500)
      } else if(response.status === 403){
          await handler.handleResponse(response)
      }
      else{
          setTimeout(() => {setShowButtons(true)}, 500)
      }
    }
    useEffect(() => {
        //AsyncStorage.setItem('accessToken', "123")
        validateJWT()
    }, []);

    if(showButtons){
        return (
            <View style={styles.empty}>
                <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                    <Image style={styles.logo} source={logo}/>
                    <Image style={inpageStyle.title} source={title}/>
                    <View>
                        <TouchableOpacity style={styles.Button}  onPress={() => {
                            props.navigation.navigate({routeName: 'Login'})
                        }}>
                            <Text style={styles.font}>{texts.Global.Common.Login}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.Button} onPress={() => {
                            props.navigation.navigate({routeName: 'Signup'})
                        }}>
                            <Text style={styles.font}>{texts.Global.Common.SignUp}</Text>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>
            </View>
        )
    }else{
        return (
            <View style={styles.empty}>
                <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                    <Image style={styles.logo} source={logo}/>
                    <Image style={inpageStyle.title} source={title}/>
                </ImageBackground>
            </View>
        )
    }

}
const inpageStyle = StyleSheet.create({
    title: {
        width: width,
        height: height * 0.15,
        marginLeft: width * 0.15
    }
})
export default Splash;
