import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
const secureStore = require('../SecureStore')

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
        loadData();
    }, []);

    return(
        <SafeAreaView>
            <View>
                <Text>Home page</Text>
            </View>
            <View>
                <Text>First name: {firstName}</Text>
            </View>
            <View>
                <Text>Last name: {lastName}</Text>
            </View>
            <View>
                <Text>Email: {email}</Text>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;
