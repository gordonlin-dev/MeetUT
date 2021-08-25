import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles';
const secureStore = require('../../SecureStore')
const cfg = require('../cfg.json')
const image = require('../../assets/bg.png');

const loginSubmit = async (email, password, props) => {
    try {
        const url = cfg.domain + cfg.login;
        const response = await fetch(url, {
            method: 'POST',
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
        await secureStore.Save('JWT', responseJson.accessToken);
        await secureStore.Save('RefreshToken', responseJson.refreshToken);

        console.log(response.status)
        if (response.status === 200) {
            props.navigation.navigate({
                routeName: 'Home'
            })
        } else if (response.status === 401) {
            props.navigation.navigate({
                routeName: 'Verification'
            })
        }

    } catch (error) {
        console.log(error)
        Alert.alert(cfg.internalError)
    }
}

const LoginScreen = props => {
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
                                routeName: 'ResetPassword'
                            })
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>Reset Password</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </View>
    );
};


export default LoginScreen;
