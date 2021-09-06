import React, {useState, useEffect} from 'react'
import {View, Text, Button, Box , Slide, Dimensions, SafeAreaView, Alert} from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from '../styles';
const presenter = require('../Presenter')
const secureStore = require('../../SecureStore')
const headers = require('../Headers')

const ProfileCard = props => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [curUser, setCurUser] = useState(0);
    const [users, setUsers] = useState([])

    const loadData = async () => {
        try{
            const accessToken = await secureStore.GetValue('JWT');
            const userId = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-2.herokuapp.com/users/' + userId; // TODO: Find a way to remove dependency on UserId
            const response = await fetch(url, {
                method : 'GET',
                headers: headers.authorized(accessToken),
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
            const accessToken = await secureStore.GetValue('JWT')
            const url = 'https://meet-ut-1.herokuapp.com/user/recommendations'
            const response = await fetch(url, {
                method : 'GET',
                headers: headers.authorized(accessToken),
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
            const accessToken = await secureStore.GetValue('JWT');
            const url = 'https://meet-ut-2.herokuapp.com/match/like';
            const response = await fetch(url, {
                method : 'POST',
                headers: headers.authorized(accessToken),
                body: JSON.stringify({
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
                        <View style={styles.slide} key={props._id}>
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
