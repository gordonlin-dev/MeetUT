import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, BackHandler, TextInput, TouchableOpacity, ImageBackground, Alert} from 'react-native'
import {styles} from '../styles';

const cfg = require('../cfg.json')
const presenter = require('../Presenter')
const secureStore = require('../../SecureStore')
const image = require('../../assets/bg.png');
const signupSubmit = async (firstName, lastName, email, password, confirm, props) => {
    try {
        const url = cfg.domain + cfg.signup
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                _id: email,
                password: password,
                confirm: confirm
            })
        });

        const responseJson = await response.json();
        if (response.status === 403) {
            await secureStore.Save('UserId', email);
            await secureStore.Save('JWT', responseJson.accessToken);
            await secureStore.Save('RefreshToken', responseJson.refreshToken)
            props.navigation.navigate({
                routeName: 'Verification'
            })
        } else if (response.status === 400) {
            Alert.alert(responseJson.error)
        } else if (response.status === 404) {
            Alert.alert(cfg.notFound)
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}


const SignupScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [confirm, onChangeNumber] = useState("");
    const [firstName, onChangeFirstName] = useState("");
    const [lastName, onChangeLastName] = useState("");

    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.signUpHeader}>
                    Sign Up
                </Text>
                <View>
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeFirstName}
                        value={firstName}
                        placeholder="first name"
                        placeholderTextColor="white"
                    />
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeLastName}
                        value={lastName}
                        placeholder="last name"
                        placeholderTextColor="white"
                    />
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
                            signupSubmit(firstName, lastName, email, password, confirm, props)
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default SignupScreen;
