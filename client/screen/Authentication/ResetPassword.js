import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ImageBackground, Alert} from 'react-native'
import {styles} from '../styles';
const secureStore = require('../../SecureStore')
const image =  require('../../assets/bg.png');
const cfg = require('../cfg.json')
const presenter = require('../Presenter')


const resetSubmit = async (email, password, confirm, props) => {
    try {
        const url = cfg.domain + cfg.resetPassword + "/" + email // TODO: Use config
        console.log(email)
        console.log(url)

        const response = await fetch(url, {
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: email,
                password: password,
                confirm: confirm
            })
        });
        console.log('response status ' + response.status)
        // console.log(response.text())
        const responseJson = await response.json()
        if (response.status == 200) {
          await secureStore.Save('UserId', email);
          await secureStore.Save('JWT', responseJson.accessToken);
          await secureStore.Save('RefreshToken', responseJson.refreshToken)
          props.navigation.navigate({
              routeName: 'Login'
          })
        }else if (response.status = 400) {
          Alert.alert(responseJson.error)
        }
    }catch (error){
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const ResetPasswordScreen = props => {
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [confirm, onChangeNumber] = useState("");

    return (
        <View style={styles.empty}>
          <ImageBackground source={image} resizeMode="cover" style={styles.image} >
          <Text style={styles.header} >
                  Reset
              </Text>
          <View>
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

        <TextInput
              style={styles.Input}
              onChangeText={onChangeNumber}
              value={confirm}
              secureTextEntry={true}
              placeholder="confirm password"
              placeholderTextColor="white"
            />
          </View>
        <View>
          <TouchableOpacity
              onPress={() => {
                resetSubmit(email, password, confirm, props)
            }}
              style={styles.Button}>
              <Text style={styles.font}>Reset Password</Text>
            </TouchableOpacity>
          </View>

          </ImageBackground>

        </View>


        );
};


export default ResetPasswordScreen;
