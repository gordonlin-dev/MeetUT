import React, {useState, useEffect} from 'react'
import {View, Text, BackHandler, TextInput, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles';
const presenter = require('../Presenter')
const cfg = require('../cfg.json')
const image = require('../../assets/bg.png');
const handler = require('../Handler')
const headers = require('../Headers')

const secureStore = require('../../SecureStore')


const verificationSubmit = async (code, props) => {
    try {
        const accessToken = await secureStore.GetValue('JWT')
        const url = cfg.domain + cfg.verify;
        const response = await fetch(url, {
            method: 'POST',
            headers: headers.authorized(accessToken),
            body: JSON.stringify({
                verification: code
            })
        });

        if (response.status === 201) {
            const responseJson = await response.json();
            await secureStore.Save('JWT', responseJson.accessToken);
            props.navigation.navigate({
                routeName: 'Home'
            })
        } else {
            await handler.handle(response, props)
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const resend = async (props) => {
    try {
        const accessToken = await secureStore.GetValue('JWT')
        const url = cfg.domain + cfg.resendCode;
        const response = await fetch(url, {
            method: 'POST',
            headers: headers.authorized(accessToken)
        });

        if (response.status === 201) {
            props.navigation.navigate({
                routeName: 'Verification'
            })
        } else {
            await handler.handle(response, props)
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const verificationScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

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
                            resend(props).then()
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>Resend Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            verificationSubmit(code, props).then()
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
