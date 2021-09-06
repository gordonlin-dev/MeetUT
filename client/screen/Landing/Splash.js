import React, {useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, TouchableOpacity, ImageBackground} from 'react-native'


const secureStore = require('../../SecureStore')
const headers = require('../Headers')

import {styles} from '../styles';

const image = require("../../assets/Splash.png");

const Splash = props => {

  const validateJWT = async(accessToken) => {
      try {
          const url = 'https://meet-ut-2.herokuapp.com/auth/validateJWT';

          const response = await fetch(url, {
              method : 'PUT',
              headers: headers.authorized(accessToken)
          });
          return response.status === 200

      } catch (error) {
          console.log(error)
      }
  }
  useEffect(() => {
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
      })
    }, []);
    return (<View style={styles.empty}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      </ImageBackground>
    </View>)
}


export default Splash;
