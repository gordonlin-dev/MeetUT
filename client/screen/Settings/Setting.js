import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity} from 'react-native'
const secureStore = require('../../SecureStore')

const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');
const image =  require('../../assets/bg.png');
const {height, width} = Dimensions.get('window');
const signoutSubmit = async (props) => {
    try {
        await secureStore.Delete('UserId');
        await secureStore.Delete('JWT');
        props.navigation.navigate({
            routeName: 'Landing'
        })        
    }catch (error){
        console.log(error)
    }
}

/* Delete user function here, saw the function in controller, not sure how to call it
*/
const deleteButton = async (props) => {

}
const SettingScreen = props => {

    return (
        <View style={styles.bg}>
          <ImageBackground source={image} resizeMode="cover" style={styles.image} >
          <View style={styles.buttonContainer}>
          <TouchableOpacity
              onPress={() => {
                signoutSubmit(props)
              }}
              style={styles.Button}>
              <Text style={styles.font}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate({
                  routeName: 'ResetPassword'
                })
              }}
              style={styles.Button}>
              <Text style={styles.font}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteButton(props)
              }}
              style={styles.Button}>
              <Text style={styles.font}>Delete Myself</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
                <View style={styles.footerButton}>
                  <TouchableOpacity onPress={() => {
                      props.navigation.navigate({
                          routeName: 'Setting'
                      })
                  }}>
                      <Image style={styles.icon} source={setting}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      props.navigation.navigate({
                          routeName: 'Home'
                      })
                  }}>
                      <Image style={styles.icon} source={home}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      props.navigation.navigate({
                          routeName: 'ChatList'
                      })
                  }}>
                      <Image style={styles.icon} source={chat}/>
                  </TouchableOpacity>
                    
                </View>
                
            </View>
          </ImageBackground>
      
        </View>
          
          
        );
};

const styles = StyleSheet.create({
    bg: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center"
    },
    Input: {
      marginTop: height * 0.03,
      marginLeft: width * 0.15,
      height: height * 0.06,
      width: width * 0.7,
      borderRadius: 5,
      borderWidth: 2,
      padding: 10,
      borderColor: "white",
      color: "white"
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
    header: {
      fontSize:50,
      marginLeft: width * 0.34,
      color: "white",
      fontFamily: 'timeburner',
    },
    font: {
      fontFamily: 'timeburner',
      fontSize:18,
      color: "#0E0EA1",
      fontWeight: "500"
    },
    footer: {
      position: "absolute",
      justifyContent: 'space-around',
      alignItems: 'stretch',
      backgroundColor: '#3590F2',
      height: height * 0.1,
      marginTop: height * 0.52,
      width: width,
      bottom: 0
    },
    footerButton:{
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    buttonContainer: {
      position: "absolute",
      top: height*0.1
    },
    icon: {
      height: height*0.05,
      width: width*0.1
  }
  });

export default SettingScreen;
