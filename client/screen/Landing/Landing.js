
import React from 'react';
import { ImageBackground, Dimensions, View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

const logo = require('../../assets/Logo-Transparent.png');
const bgimage =  require('../../assets/bg.png');
const {height, width} = Dimensions.get('window');

const Authentication = (props) => {  
  return (
    <View style={styles.bg}>
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

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  logo: {
    width: width * 0.2,
    height: height * 0.15,
    marginLeft: width * 0.39
  },
  Button: {
    width: width * 0.6,
    height: height * 0.06,
    marginTop: height * 0.04,
    marginLeft: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  font: {
    fontFamily: 'timeburner',
    fontSize:18,
    color: "#0E0EA1",
    fontWeight: "500"
  }
});
export default Authentication;