import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    BackHandler,
    TextInput,
    ImageBackground,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions, StyleSheet
} from 'react-native'
const endpoints = require('../../API_endpoints.json')
import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationActions, StackActions} from "react-navigation";
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const image = require('../../assets/bg.png');
import { Icon } from 'react-native-elements'
const {height, width} = Dimensions.get('window');

const verificationSubmit = async (code, props) => {
    const body = {
        verification : code
    }
    const response = await handler.sendRequest(
        endpoints.Server.User.User.Verify,
        texts.HTTP.Post,
        body,
        false,
        props
    )
    if(response.ok){
        const responseJson = await response.json()
        await AsyncStorage.setItem('accessToken', responseJson.accessToken)
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        props.navigation.dispatch(resetAction)
    }
}

const resend = async (props) => {
    const response = await handler.sendRequest(
        endpoints.Server.User.User.ResendCode,
        texts.HTTP.Post,
        {},
        false,
        props
    )
    if(response.ok){
        Alert.alert("",
            texts.Alert.Message.SentCode,
            [{text: texts.Alert.Buttons.OK, onPress: () => {}}])
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
            <ImageBackground source={image} defaultSource={image} resizeMode="cover" style={styles.image}>
                <ScrollView style={{paddingTop: height*0.05}}>
                    <View style={{
                        alignItems:"flex-start"
                    }}>
                        <Icon name="chevron-left" size={35} color="white" type="fontawesome5" style={{
                            marginLeft:width*0.02
                        }}
                              onPress={()=>{
                                  props.navigation.navigate({
                                      routeName: 'Splash'
                                  })
                              }}
                        />
                    </View>
                    <View>
                        <Text style={inpageStyle.Header}>
                            {texts.Screens.Verification.Verification}
                        </Text>
                        <TextInput
                            style={styles.Input}
                            onChangeText={onChangeCode}
                            value={code}
                            placeholder={texts.Global.Common.Code}
                            placeholderTextColor="white"
                        />
                        <TouchableOpacity
                            onPress={() => {
                                verificationSubmit(code, props).then()
                            }}
                            style={inpageStyle.Button}>
                            <Text style={styles.font}>{texts.Global.Common.Submit}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                resend(props).then()
                            }}
                            style={styles.Button}>
                            <Text style={styles.font}>{texts.Global.Common.ResendCode}</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};
const inpageStyle = StyleSheet.create({
    Header: {
        fontSize: 50,
        marginLeft: width * 0.20,
        marginTop : height * 0.15,
        marginBottom: height * 0.03,
        color: "white",
        fontFamily: 'timeburner',
    },
    Button: {
        width: width * 0.6,
        height: height * 0.06,
        marginTop: height * 0.05,
        marginBottom: height * 0.04,
        marginLeft: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    }
})
export default verificationScreen;
