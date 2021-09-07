import React, {useEffect} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    Alert,
    DevSettings
} from 'react-native'
const texts = require('../../assets/Texts.json')

const secureStore = require('../../SecureStore')
const headers = require('../Headers')
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
import {styles} from '../styles';

const image = require("../../assets/Splash.png");

const Splash = props => {

  const validateJWT = async(accessToken) => {
      const response = await handler.sendRequest(endpoints.Server.User.Auth.ValidateJWT,
          handler.HTTP.Method.Get,
          props)
      try {

          const url = 'https://meet-ut-2.herokuapp.com/auth/validateJWT';

          const response = await fetch(url, {
              method : 'GET',
              headers: headers.authorized(accessToken)
          });
          return response.status === 200

      } catch (error) {
      }
  }
  useEffect(() => {
      /*
      secureStore.GetValue('JWT').then((jwt) =>{
          validateJWT(jwt).then(
              (result) => {
                  if(result){
                      props.navigation.navigate('Home')
                  } else {
                      props.navigation.navigate('Landing')
                  }
              }
          )
      })*/
    }, []);
    return (<View style={styles.empty}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      </ImageBackground>
    </View>)
}


export default Splash;
