const {Alert} = require("react-native");
const presenter = require("./Presenter");

exports.handle = (response, responseJson, props) => {
    if (response.status === 400) {
        Alert.alert(responseJson.error)
    } else if (response.status === 401) {
        props.navigation.navigate({
            routeName: "Login"
        })
    } else if (response.status === 403) {
        props.navigation.navigate({
            routeName: "Verification"
        })
    } else if (response.status === 404) {
        Alert.alert(presenter.notFound())
        props.navigation.navigate({
            routeName: "Login"
        })
    } else {
        Alert.alert(presenter.internalError())
    }
}