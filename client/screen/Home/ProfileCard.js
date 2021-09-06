import React, {useState, useEffect, useRef} from 'react'
import {View, Text, TouchableOpacity, Image, Dimensions, SafeAreaView, Alert} from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from '../styles';
const presenter = require('../Presenter')
const secureStore = require('../../SecureStore')
const headers = require('../Headers')
const logo =  require('../../assets/logo.png');
const ProfileCard = props => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const ref = useRef(null)
    const [ index, setIndex ] = useState ( 0 )
    const matches = props.users;

    const nextUser = async (props) => {
        for (let i = 0; i < matches.length; i++) {
            if (matches[i] == props) {
                matches.splice(i, 1)
                if(matches.length - i >= 1){
                    setIndex(i+1)
                } else {
                    /* Need to handle when reach last user
                    */
                    return (
                        <View style={styles.infoContainer}>
                            <Text style={styles.quizFont}>You've reached the end of the list</Text>
                        </View>
                    );
                }
                
            }
        }
    }

    const sendLike = async (props) => {
        try{
            for (let i = 0; i < matches.length; i++) {
                if (matches[i] == props) {
                    matches.splice(i, 1)
                    if(matches.length - i >= 1){
                        setIndex(i+1)
                    } else {
                        /* Need to handle when reach last user
                        */
                    }
                    
                }
            }
            
            const accessToken = await secureStore.GetValue('JWT');
            const url = 'https://meet-ut-2.herokuapp.com/match/like';
            const response = await fetch(url, {
                method : 'POST',
                headers: headers.authorized(accessToken),
                body: JSON.stringify({
                    likedUser: props.userId
                })
            });
            const responseJson = await response.json();

            

            

        }catch (e){
            console.log(e);
            Alert.alert(presenter.internalError())
        }
    }

    return(
        <SafeAreaView style={styles.homeBg}>
            
            <Swiper style={styles.wrapper} loop={false}
              ref={ref}
              showsButtons={false}
              showsPagination={false}
              index={index}
              >
                {matches.map((props) => {
                    return (
                        <View style={styles.slide} key={props.userId}>
                            <View style={styles.infoContainer}>
                                <Image style={styles.avatar} source={logo}/>

                                <View >
                                    <Text style={styles.text}> {props.userId}</Text>
                                    <Text style={styles.quizFont}> Similarity: </Text>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.homeButton} onPress={async () => {await nextUser(props)}}> 
                                        <Text style={styles.quizFont}>Archive</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.homeButton} onPress={async () => {await sendLike(props)}}> 
                                        <Text style={styles.quizFont}>Chat</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={styles.detailContainer}>
                                <Text style={styles.text}> Education </Text>
                                {props.programs.map((props) => {
                                    return (
                                        <Text style={styles.quizFont}  key={props.id}> {props.value} </Text>
                                    );
                                })}
                                <Text style={styles.text}> Hobbies </Text>
                                {props.hobbies.map((props) => {
                                    return (
                                        <Text style={styles.quizFont} key={props.id}> {props.value} </Text>
                                    );
                                })}
                            </View>
                        
                        </View>
                    );
                })}
                
            </Swiper>
        </SafeAreaView>
    )
}

export default ProfileCard
