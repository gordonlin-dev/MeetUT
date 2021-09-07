import AsyncStorage from '@react-native-async-storage/async-storage';
import headers from "../Headers";
const {Alert, DevSettings} = require("react-native");
const presenter = require("./Presenter");
const texts = require("../assets/Texts.json");


exports.handleResponse = async (response, props) => {
    if (response.status === 400) {
        const responseJson = await response.json();
        Alert.alert(texts.Alert.Title.UnableToProcess,
            responseJson,
            [{text: texts.Alert.Button.OK}])

    } else if (response.status === 401) {
        props.navigation.navigate({
            routeName: "Login"
        })
        Alert.alert(texts.Alert.Title.Unauthorized,
            texts.Alert.Message.Authenticate,
            [{text: texts.Alert.Button.OK, onPress: () => props.navigation.navigate({
                    routeName: "Login"
                })}])

    } else if (response.status === 403) {
        Alert.alert(texts.Alert.Title.Verification,
            texts.Alert.Message.Verification,
            [{text: texts.Alert.Button.OK, onPress: () => props.navigation.navigate({
                    routeName: "Verification"
                })}])

    } else if (response.status === 404) {
        Alert.alert(texts.Alert.Title.Error,
            texts.Alert.Message.NotFound,
            [{text: texts.Alert.Button.OK, onPress: () => props.navigation.navigate({
                    routeName: "Login"
                })}])

    } else {
        Alert.alert(texts.Alert.Title.Error,
            texts.Alert.Message.RestartApp,
            [{text: texts.Alert.Button.OK, onPress: () => DevSettings.reload()}])
    }
}

exports.sendRequest = async (url, method, props) => {
    try {
        const token = await AsyncStorage.getItem('accessToken')
        const response = await fetch(url, {
            method : method,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        });
        if(response.ok){
            const responseJson = await response.json()
            return responseJson
        }
        await this.handleResponse(response, props)
    } catch(e) {
        Alert.alert(texts.Alert.Title.Error,
            texts.Alert.Message.RestartApp,
            [{text: texts.Alert.Button.OK, onPress: () => DevSettings.reload()}])
    }

}

exports.HTTP = {
    Method : {
        Get : 'Get',
        Post : 'Post'
    }
}
