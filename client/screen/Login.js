import { ALWAYS } from 'expo-secure-store';
import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'
const secureStore = require('../SecureStore')

const image =  require('../assets/bg.png');

const {height, width} = Dimensions.get('window');
const loginSubmit = async (email, password, props) => {
  if (await secureStore.GetValue('UserId') == null){
    Alert.alert("Could not match a user, please check your email or password")
  } else {
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
            />
            <TextInput
              style={styles.Input}
              onChangeText={onChangePassword}
              value={password}
              secureTextEntry={true}
              placeholder="password"
            />
          <TouchableOpacity
              onPress={() => {
                loginSubmit(email, password, props)
            }}
              style={styles.Button}>
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        <View>
          <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ResetPassword');
                // do something
              }}
              style={styles.Button}>
              <Text>Reset Password</Text>
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
      borderColor: "white"
    },
    Button: {
      width: width * 0.6,
      height: height * 0.06,
      marginTop: height * 0.03,
      marginLeft: width * 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor: 'white',
    },
    header: {
      fontSize:30,
      marginLeft: width * 0.38,
    }
  });

export default LoginScreen;
