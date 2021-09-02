import React, {useState, useEffect} from 'react'
import {View, Text, BackHandler, Dimensions, TextInput, TouchableOpacity, ImageBackground, Alert} from 'react-native'
import {styles} from '../styles';

const secureStore = require('../../SecureStore')
const image = require('../../assets/bg.png');
const cfg = require('../cfg.json')
const presenter = require('../Presenter')
const handler = require('../Handler')

const resetSubmit = async (password, confirm, props) => {
    try {
        const email = await secureStore.GetValue('UserId')
        const url = cfg.domain + cfg.resetPassword + "/" + email

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: email,
                password: password,
                confirm: confirm
            })
        });

        if (response.status === 200) {
            const responseJson = await response.json()
            await secureStore.Save('UserId', email);
            await secureStore.Save('JWT', responseJson.accessToken);
            await secureStore.Save('RefreshToken', responseJson.refreshToken)
            props.navigation.navigate({
                routeName: 'Login'
            })
        } else {
            handler.handle(response, props)
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const ResetPasswordScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [confirm, onChangeNumber] = useState("");

    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.header}>
                    Reset
                </Text>
                <View>
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangePassword}
                        value={password}
                        secureTextEntry={true}
                        placeholder="new password"
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
                            resetSubmit(password, confirm, props).then()
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
