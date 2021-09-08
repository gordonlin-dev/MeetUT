import AsyncStorage from '@react-native-async-storage/async-storage';
const {Alert, DevSettings} = require("react-native");
const texts = require("../assets/Texts.json");

const handleResponse = async (response, props) => {
    if (response.status === 400) {
        const responseJson = await response.json();
        console.log(responseJson)
        Alert.alert(texts.Alert.Title.UnableToProcess,
            responseJson,
            [{text: texts.Alert.Buttons.OK}])

    } else if (response.status === 401) {
        props.navigation.navigate({
            routeName: "Login"
        })
        Alert.alert(texts.Alert.Title.Unauthorized,
            texts.Alert.Message.Authenticate,
            [{text: texts.Alert.Buttons.OK, onPress: () => props.navigation.navigate({
                    routeName: "Login"
                })}])
    } else if (response.status === 403) {
        Alert.alert(texts.Alert.Title.Verification,
            texts.Alert.Message.Verification,
            [{text: texts.Alert.Buttons.OK, onPress: () => props.navigation.navigate({
                    routeName: "Verification"
                })}])
    } else if (response.status === 404) {
        Alert.alert(texts.Alert.Title.Error,
            texts.Alert.Message.NotFound,
            [{text: texts.Alert.Buttons.OK, onPress: () => props.navigation.navigate({
                    routeName: "Login"
                })}])
    } else {
        Alert.alert(texts.Alert.Title.Error,
            texts.Alert.Message.RestartApp,
            [{text: texts.Alert.Buttons.OK, onPress: () => DevSettings.reload()}])
    }
    return response
}

const sendRequest = async (url, method, body, unhandled, props) => {
    try {
        const token = await AsyncStorage.getItem('accessToken')
        let requestObject = {
            method : method,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        }
        if(method === texts.HTTP.Post) {
            requestObject.body = JSON.stringify(body)
        }
        const response = await fetch(url, requestObject);
        if(unhandled || response.ok){
            return response
        }
        console.log(response.status)
        return await handleResponse(response, props)
    } catch(e) {
        console.log(e)
        Alert.alert(texts.Alert.Title.Error,
            texts.Alert.Message.RestartApp,
            [{text: texts.Alert.Buttons.OK, onPress: () => DevSettings.reload()}])
    }

}

export {handleResponse,sendRequest}
