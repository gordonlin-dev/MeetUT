import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'

const presenter = require('../Presenter')
const cfg = require('../cfg.json')
const image = require('../../assets/bg.png');
const {height, width} = Dimensions.get('window');
const secureStore = require('../../SecureStore')


const verificationSubmit = async (code, props) => {
    console.log(await secureStore.GetValue("UserId"))
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
            console.log(response.status)
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const resend = async (props) => {

}

const verificationScreen = props => {
    const [code, onChangeCode] = useState("")

    return (
        <View style={styles.bg}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <View>
                    <Text style={styles.header}>
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

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    Input: {
        marginTop: height * 0.05,
        marginLeft: width * 0.15,
        height: height * 0.06,
        width: width * 0.7,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        borderColor: "white",
        color: "white"
    },
    Button: {
        width: width * 0.6,
        height: height * 0.06,
        marginTop: height * 0.05,
        marginLeft: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 50,
        marginLeft: width * 0.15,
        color: "white",
        fontFamily: 'timeburner',
    },
    font: {
        fontFamily: 'timeburner',
        fontSize: 18,
        color: "#0E0EA1",
        fontWeight: "500"
    }
});

export default verificationScreen;
