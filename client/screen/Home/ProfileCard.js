import React, {useState, useEffect} from 'react'
import {View, Text, Button, StyleSheet, Slide, Dimensions, SafeAreaView, Alert} from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from '../styles';
const presenter = require('../Presenter')
const secureStore = require('../../SecureStore')

const ProfileCard = props => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [curUser, setCurUser] = useState(0);
    const [users, setUsers] = useState([])

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
    const loadUser = async () => {
        try{
            const userID = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-2.herokuapp.com/match' + '/' + userID
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'authorization': 'Bearer ' + jwt
                },
            });
            const responseJson = await response.json();
            setUsers(responseJson)


        }catch (e) {
            console.log(e);
        }
    }

    const nextUser = async () => {
        await setCurUser(curUser + 1);
    }

    const sendLike = async () => {
        try{
            console.log(users[curUser])
            const jwt = await secureStore.GetValue('JWT');
            const userId = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-2.herokuapp.com/match/like';
            const response = await fetch(url, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({
                    curUser: userId,
                    likedUser: users[curUser].email
                })
            });
            const responseJson = await response.json();
            await nextUser();

        }catch (e){
            console.log(e);
            Alert.alert(presenter.internalError())
        }
    }

    useEffect(() => {
        //loadData();
        loadUser()
    }, []);

    useEffect(() => {
        //loadData();
        if(users.length > 0){
            setFirstName(users[curUser].firstName)
            setLastName(users[curUser].lastName)
        }
    }, [users, curUser]);

    return(
        <SafeAreaView style={styles.homeBg}>
            
            <Swiper style={styles.wrapper}>
                {users.map((props) => {
                    return (
                        <View style={styles.slide}>
                            <View style={styles.leftButton}>
                                <Button style={styles.Button} title={'   Pass   '} onPress={async () => {await nextUser()}}/>

                            </View>
                        <View >
                        
                        <Text style={styles.text} onPress={async () => {await sendLike()}}>{props.firstName + ' ' + props.lastName}</Text>
                        </View>
                        <View style={styles.rightButton}>
                            <Button style={styles.Button} title={'   Like   '} onPress={async () => {await sendLike()}}/>

                        </View>
                        </View>
                    );
                })}
                
            </Swiper>
        </SafeAreaView>
    )
}

export default ProfileCard
