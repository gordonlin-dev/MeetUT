import React, {useState, useEffect} from 'react'
import {View, Text, Button, StyleSheet, Slide, Dimensions, SafeAreaView} from 'react-native'
import Swiper from 'react-native-swiper'

const secureStore = require('../../SecureStore')
const {height, width} = Dimensions.get('window');

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
            console.log(e)
        }
    }

    const nextUser = async () => {
        await setCurUser(curUser + 1)
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
            console.log(e)
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
        <SafeAreaView style={styles.container}>
            
            <Swiper style={styles.wrapper} showsButtons={true}>
                <View style={styles.slide}>
                <View >
                <Text style={styles.text} onPress={async () => {await sendLike()}}>{props.firstName + ' ' + props.lastName}</Text>
                </View>
                    
                </View>
            </Swiper>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonContainer:{
    },
    container:{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    profilebg: {
        marginTop: height * 0.05,
        marginBottom: height * 0.08,
        marginLeft: width * 0.1,
        height: height * 0.6,
        width: width * 0.8
    },
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        flexDirection: 'row',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    buttonText: {
        color: '#3590F2',
        fontSize: 50,
        fontWeight: 'bold'
    }
})
export default ProfileCard
