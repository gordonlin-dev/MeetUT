import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, Dimensions, ImageBackground, TouchableOpacity} from 'react-native'
const secureStore = require('../SecureStore')

const image =  require('../assets/bg.png');
const {height, width} = Dimensions.get('window');
const buttonClickedHandler = () => {
    console.log('You have been clicked a button!');
    // do something
  };
const loginSubmit = async (email, password, props) => {
    try {
        const url = 'https://meet-ut-2.herokuapp.com/auth';
        const response = await fetch(url, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const responseJson = await response.json();
        await secureStore.Save('UserId', email);
        await secureStore.Save('JWT',responseJson.accessToken);
        await secureStore.Save('RefreshToken', responseJson.refreshToken);
        props.navigation.navigate({
            routeName: 'Home'
        })
    }catch (error){
        console.log(error)
    }
}
const LoginScreen = props => {
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");

    return (
        <View style={styles.bg}>
          <ImageBackground source={image} resizeMode="cover" style={styles.image} >
          <View>
              <Text style={styles.header} >
                  Login
              </Text>

          <TextInput
              style={styles.Input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="email"
              placeholderTextColor="white"
            />
            <TextInput
              style={styles.Input}
              onChangeText={onChangePassword}
              value={password}
              secureTextEntry={true}
              placeholder="password"
              placeholderTextColor="white"
            />
          <TouchableOpacity
              onPress={() => {
                loginSubmit(email, password, props)
            }}
              style={styles.Button}>
              <Text style={styles.font}>Login</Text>
            </TouchableOpacity>
          </View>
        <View>
          <TouchableOpacity
              onPress={buttonClickedHandler}
              style={styles.Button}>
              <Text style={styles.font}>Reset Password</Text>
            </TouchableOpacity>
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
    }
  });

export default LoginScreen;
