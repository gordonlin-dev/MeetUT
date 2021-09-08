import React, {useState, useEffect} from 'react'
import {View, Text, BackHandler, TextInput, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles'
import AsyncStorage from "@react-native-async-storage/async-storage";
const image = require('../../assets/bg.png')
const handler = require('../Handler')
const fixer = require('../Fixer')
const endpoints = require('../../API_endpoints.json')
const texts = require("../../assets/Texts.json");

const loginSubmit = async (email, password, props) => {
    const body = {
        _id: fixer.email(email),
        password: password
    }
    const response = await handler.sendRequest(
        endpoints.Server.User.Auth.Login,
        texts.HTTP.Post,
        body,
        false,
        props
    )

    if(response.ok){
        const responseJson = await response.json();
        await AsyncStorage.setItem('accessToken', responseJson.accessToken)
        props.navigation.navigate({
            routeName: 'Home'
        })
    }
}

const LoginScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");

    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <View>
                    <Text style={styles.header}>
                        {texts.Global.Common.Login}
                    </Text>

                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeEmail}
                        value={email}
                        placeholder={texts.Global.Common.Email}
                        placeholderTextColor="white"
                        autoCapitalize='none'
                    />
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangePassword}
                        value={password}
                        secureTextEntry={true}
                        placeholder={texts.Global.Common.Password}
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            loginSubmit(email, password, props).then()
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>{texts.Global.Common.Login}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate({
                                routeName: 'GetEmail'
                            })
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>{texts.Global.Common.ForgotPassword}</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </View>
    );
};


export default LoginScreen;
