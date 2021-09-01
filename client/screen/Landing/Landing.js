
import React, {useEffect} from 'react';
import { ImageBackground, BackHandler, View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

const logo = require('../../assets/Logo-Transparent.png');
const bgimage =  require('../../assets/bg.png');
import {styles} from '../styles';

const Authentication = (props) => {  
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true)
  }, [])
  
  return (
    <View style={styles.empty}>
    <ImageBackground source={bgimage} resizeMode="cover" style={styles.image}>
        <Image source={logo} style={styles.logo}/>
        <View>
        <TouchableOpacity style={styles.Button}  onPress={() => {
                    props.navigation.navigate({routeName: 'Login'})
                }}>
                <Text style={styles.font}>Login</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.Button} onPress={() => {
                    props.navigation.navigate({routeName: 'Signup'})
                }}>
                <Text style={styles.font}>Sign Up</Text>
                </TouchableOpacity>
        </View>
    </ImageBackground>
</View>
    
    
  );
  
}

export default Authentication;