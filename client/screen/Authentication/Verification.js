import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles';
const presenter = require('../Presenter')
const cfg = require('../cfg.json')
const image = require('../../assets/bg.png');

const secureStore = require('../../SecureStore')


const verificationSubmit = async (code, props) => {
    try {
        const url = cfg.domain + cfg.verify;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: await secureStore.GetValue("UserId"),
                verification: code
            })
        });

        if (response.status === 200) {
            props.navigation.navigate({
                routeName: 'Home'
            })
        } else {
            const responseJson = await response.json();
            Alert.alert(responseJson.error)
            props.navigation.navigate({
                routeName: 'Verification'
            })
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const resend = async (props) => {
    try {
        const url = cfg.domain + cfg.resendCode;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: await secureStore.GetValue("UserId")
            })
        });

        if (response.status === 200) {
            props.navigation.navigate({
                routeName: 'Verification'
            })
        } else {
            console.log(response.status)
            Alert.alert(presenter.internalError())
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const verificationScreen = props => {
    const [code, onChangeCode] = useState("")

    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <View>
                    <Text style={styles.verificationHeader}>
                        Verification
                    </Text>
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeCode}
                        value={code}
                        placeholder="code"
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            resend(props)
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>Resend Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            verificationSubmit(code, props)
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default verificationScreen;
