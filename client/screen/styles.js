import {View, Text, StyleSheet, TextInput, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    buttonInRow: {
        marginTop: 0
    },

    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: height * 0.02,
        marginBottom: height * 0.02
    },
    empty:{
        flex:1,
    },
    homeBg:{
        position: 'absolute',
        height: height*0.85,
        width: width,
    },
    footer: {
        position: "absolute",
        justifyContent: 'space-around',
        alignItems: 'stretch',
        backgroundColor: '#3590F2',
        height: height * 0.1,
        width: width,
        bottom: 0
    },
    footerButton:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: height * 0.005
    },
    wrapper: {},
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    icon: {
        height: height*0.05,
        width: width*0.1
    },
    
    image: {
        flex: 1,
        justifyContent: "center"
    },
    Input: {
        marginTop: height * 0.03,
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
        marginTop: height * 0.04,
        marginLeft: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 50,
        marginLeft: width * 0.34,
        color: "white",
        fontFamily: 'timeburner',
    },
    signUpHeader: {
        fontSize: 50,
        marginLeft: width * 0.27,
        color: "white",
        fontFamily: 'timeburner',
    },
    verificationHeader: {
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
    },
    logo: {
        width: width * 0.2,
        height: height * 0.15,
        marginLeft: width * 0.39
    },
    rightButton:{
        position: "absolute",
        right: 0,
    },
    leftButton:{
        position: "absolute",
        left: 0
    },
    profilebg: {
        marginTop: height * 0.05,
        marginBottom: height * 0.08,
        marginLeft: width * 0.1,
        height: height * 0.6,
        width: width * 0.8
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        flexDirection: 'row',
    },
    buttonText: {
        color: '#3590F2',
        fontSize: 50,
        fontWeight: 'bold'
    },
    profile: {
        position: "absolute",
        height: height*0.1,
        width: width,
        top: 0,
        backgroundColor: "white",
        flexDirection: 'row'
    },
    avatar: {
        marginTop: height*0.01,
        marginLeft: width*0.01,
        height: height*0.08,
        width: width*0.16,
        borderRadius: 400/ 2,
    },
    chat: {
        height: height*0.1,
        marginLeft: width*0.02
        
    }
});
    
export { styles };