import {View, Text, StyleSheet, TextInput, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    onboardEmpty: {

    },
    onboardContainer: {
        flex: 1,
        backgroundColor: "#e1e1ea",
        paddingBottom: height * 0.1
    },
    scrollViewContainer: {
        flex: 1,
        alignItems: 'center',
    },
    pickerHeader: {
        marginTop: height * 0.02,
        left: width*0.15,
    },
    inputHeader: {
        left: width*0.16,
        marginTop: height * 0.01,
    },
    onboardInput: {
        left: width*0.16,
        height: height * 0.06,
        width: width * 0.7,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        borderColor: "black",
        color: "black"
    },
    onboardHeaderFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: "black"
    },
    container:{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    quizContainer: {
        flex: 1,
        position: 'absolute',
        height: height*0.92,
        width: width,
        paddingTop: height*0.05,
        paddingLeft: width*0.15,
        paddingRight: width*0.15,
        backgroundColor: "#e1e1ea"
    },
    scrollContainer: {
        position: 'absolute',
        height: height*0.45,
        width: width,
        paddingTop: height*0.05,
        paddingLeft: width*0.05,
        paddingRight: width*0.05,
    },
    outputContainer:{
        height: height*0.35,
        width: width,
        marginLeft: width*0.1
    },
    outputCard:{
        flex: 0.6,
        backgroundColor: '#d0d0d9',
        height: height*0.08,
        width: width*0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedContainer:{
        position: 'absolute',
        width: width,
        height: height*0.35,
        top: height * 0.48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        borderColor: 'black',
        borderWidth: 1,
        height: height*0.08,
        flexDirection: 'row',
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
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: '#3590F2',
        height: height * 0.1,
        width: width,
        bottom: 0
    },
    footerButton:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: height * 0.025
    },
    text: {
        color: '#000',
        fontSize: 25,
        fontWeight: 'bold'
    },
    icon: {
        height: height*0.05,
        width: width*0.1
    },

    image: {
        flex: 1,
        justifyContent: "center",
    },
    Input: {
        marginBottom: height * 0.03,
        marginLeft: width * 0.15,
        height: height * 0.06,
        width: width * 0.7,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        borderColor: "white",
        color: "white"
    },
    picker: {
        width: width * 0.7,
        height: height * 0.055,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        color: "black"

    },
    Button: {
        width: width * 0.6,
        height: height * 0.06,
        marginBottom: height * 0.04,
        marginLeft: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    },
    swipeButton: {
        position: 'absolute',
        right: width*0.1,
        width: width * 0.2,
        height: height * 0.06,
        marginTop: height*0.01,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 400/ 2,
        backgroundColor: 'white',
    },
    selectButton: {
        position: "absolute",
        width: width * 0.16,
        height: height * 0.03,
        marginTop: height*0.04,
        marginLeft: width*0.7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 400/ 2,
        backgroundColor: '#e1e1ea',
    },
    header: {
        fontSize: 50,
        marginLeft: width * 0.34,
        marginBottom: height *0.03,
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
        marginLeft: width * 0.39,
        marginBottom: height * 0.03
    },
    avatar: {
        marginTop: height*0.01,
        marginLeft: width*0.01,
        height: height*0.08,
        width: width*0.16,
        borderRadius: 400/ 2,
    },
    headerFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: "black",
        marginBottom: height * 0.01,
        marginTop: height*0.01
    },
    quizHeader: {
        marginTop: height * 0.02,
        alignItems: 'center',
        marginLeft: width * 0.01
      },
    quizFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: "black"
    },
    quizLeftButton: {
        position: 'absolute',
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        left: width*0.02,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: "black",
        backgroundColor: 'white'
    },
    quizRightButton: {
        position: 'absolute',
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        right: width*0.02,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: "black",
        backgroundColor: 'white'
    },
    leftFont: {
        fontFamily: 'timeburner',
        fontSize:12,
        color: "black",
        left: width*0.11
    }
});

export { styles };
