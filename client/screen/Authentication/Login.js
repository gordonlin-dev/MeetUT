import React, {useState, useEffect} from 'react'
import {View, Text, BackHandler, TextInput, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles'
const secureStore = require('../../SecureStore')
const cfg = require('../cfg.json')
const image = require('../../assets/bg.png')
const handler = require('../Handler')
const fixer = require('../Fixer')

const loginSubmit = async (email, password, props) => {
    try {
        email = fixer.email(email)
        const url = cfg.domain + cfg.login;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: email,
                password: password
            })
        });

        if (response.status === 201) {
            const responseJson = await response.json();
            await secureStore.Save('UserId', email);
            await secureStore.Save('JWT', responseJson.accessToken);
            await secureStore.Save('RefreshToken', responseJson.refreshToken);
            props.navigation.navigate({
                routeName: 'Home'
            })
        } else {
            await handler.handle(response, props)
        }

    } catch (error) {
        console.log(error)
        Alert.alert(cfg.internalError)
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
                        onPress={() => {
                            props.navigation.navigate({
                                routeName: 'GetEmail'
                            })
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>Forgot Password</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </View>
    );
};


export default LoginScreen;
