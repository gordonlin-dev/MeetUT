import React, {useState, useEffect} from 'react'
import {
    Text,
    BackHandler,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView, ScrollView, StyleSheet, Dimensions
} from 'react-native'
import {useHeaderHeight} from 'react-navigation-stack';

import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";

const image = require('../../assets/bg.png');
const handler = require('../Handler')
const fixer = require('../Fixer')
const endpoints = require('../../API_endpoints.json')
const texts = require("../../assets/Texts.json");

const signupSubmit = async (firstName, lastName, email, password, confirm, props) => {
    try {
        const body = {
            firstName: firstName,
            lastName: lastName,
            _id: fixer.email(email),
            password: password,
            confirm: confirm
        }
        const response = await handler.sendRequest(
            endpoints.Server.User.User.SignUp,
            texts.HTTP.Post,
            body,
            true,
            props
        )
        const responseJson = await response.json();
        if (response.status == 403) {
            await AsyncStorage.setItem('accessToken', responseJson.accessToken)
            props.navigation.navigate({
                routeName: 'Verification'
            })
        } else {
            await handler.handleResponse(response, props)
        }
    } catch (error) {
        console.log(error)
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
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
            <ScrollView>
                <KeyboardAvoidingView  style={customStyles.Main} behavior={"padding"} keyboardVerticalOffset = {useHeaderHeight()}>
                    <Text style={styles.signUpHeader}>
                        {texts.Global.Common.SignUp}
                    </Text>
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeFirstName}
                        value={firstName}
                        placeholder= {texts.Global.Common.Firstname}
                        placeholderTextColor="white"
                    />
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeLastName}
                        value={lastName}
                        placeholder={texts.Global.Common.Lastname}
                        placeholderTextColor="white"
                    />
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

                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeNumber}
                        value={confirm}
                        secureTextEntry={true}
                        placeholder={texts.Global.Common.ConfirmPassword}
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={async () => {
                            await signupSubmit(firstName, lastName, email, password, confirm, props)
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>{texts.Global.Common.SignUp}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
    );
};

const {height, width} = Dimensions.get('window');
const customStyles = StyleSheet.create({
    Main : {
        paddingTop: height*0.05
    }
})

export default SignupScreen;
