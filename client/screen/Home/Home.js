import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
import ProfileCard from "./ProfileCard";

const secureStore = require('../../SecureStore')

const HomeScreen = props => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const loadData = async () => {
        try{
            const jwt = await secureStore.GetValue('JWT');
            const userId = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-2.herokuapp.com/users/' + userId;
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jwt
                },
            });
            const responseJson = await response.json();
            setEmail(responseJson.email);
            setFirstName(responseJson.firstName);
            setLastName(responseJson.lastName);

        }catch (e){

        }
    }
    useEffect(() => {
        //loadData();
    }, []);

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.empty}>
                <ProfileCard style={styles.empty} firstName={'Bob'} lastName={'Benson'}/>
                <View style={styles.buttonContainer}>
                    <Button title={'Pass'} onPress={() => {}}/>
                    <Button title={'Like'} onPress={() => {}}/>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    buttonContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button:{

    },
    empty:{
        flex:1
    }
});


export default HomeScreen;
