import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, Dimensions, Button, ScrollView} from 'react-native'
const secureStore = require('../SecureStore')

const {height, width} = Dimensions.get('window');
const loginSubmit = async (email, password, props) => {
    try {
        const url = 'https://meet-ut-2.herokuapp.com/auth';
        const response = await fetch(url, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const responseJson = await response.json();
        await secureStore.Save('UserId', email);
        await secureStore.Save('JWT',responseJson.accessToken);
        await secureStore.Save('RefreshToken', responseJson.refreshToken);
        props.navigation.navigate({
            routeName: 'Home'
        })
    }catch (error){
        console.log(error)
    }
}
const LoginScreen = props => {
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    return(
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Log in</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput style={styles.input}
                               onChangeText={onChangeEmail}
                               value={email}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput style={styles.input}
                               secureTextEntry={true}
                               onChangeText={onChangePassword}
                               value={password}
                    />
                </View>
                <Button title={'submit'} onPress={() => {
                    loginSubmit(email, password, props)
                }}/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems: 'center',
        flex:1
    },
    header:{
        fontSize:75,
        height: height * 0.2,
        marginBottom: height * 0.05
    },
    inputContainer:{
        height:height * 0.1,
        width: width * 0.9,
        flexDirection:'row',
        alignItems: 'flex-start'
    },
    inputTitle:{
        flex:2
    },
    input:{
        flex:7,
        borderBottomWidth:2,
        borderBottomColor:'black'
    }
});

export default LoginScreen;
