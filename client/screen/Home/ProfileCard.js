import React, {useState, useEffect, useRef} from 'react'
import {View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, SafeAreaView, Alert} from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from '../styles';
const presenter = require('../Presenter')
const secureStore = require('../../SecureStore')
const headers = require('../Headers')
const logo =  require('../../assets/logo.png');
const {height, width} = Dimensions.get('window');
const ProfileCard = props => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const ref = useRef(null)
    const [ index, setIndex ] = useState ( 0 )
    const matches = props.users;
    console.log(matches)
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
                        <View style={inpageStyle.infoContainer}>
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
            
            <Swiper style={{}} loop={false}
              ref={ref}
              showsButtons={false}
              showsPagination={false}
              index={index}
              >
                {props.users.map((props) => {
                    return (
                        <View style={inpageStyle.slide} key={props.userId}>
                            <View style={inpageStyle.infoContainer}>
                                <Image style={styles.avatar} source={logo}/>

                                <View >
                                    <Text style={styles.text}> {props.userId}</Text>
                                    <Text style={styles.quizFont}> Similarity: </Text>
                                </View>

                                <View style={inpageStyle.buttonContainer}>
                                    <TouchableOpacity style={inpageStyle.homeButton} onPress={async () => {await nextUser(props)}}> 
                                        <Text style={styles.quizFont}>Archive</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={inpageStyle.homeButton} onPress={async () => {await sendLike(props)}}> 
                                        <Text style={styles.quizFont}>Chat</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={inpageStyle.detailContainer}>
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

const inpageStyle = StyleSheet.create({
    detailContainer: {
        position: "absolute",
        paddingBottom: height * 0.1,
        left: width * 0.03,
        top: height *0.31
    },
    infoContainer: {
        backgroundColor: '#9DD6EB',
        height: height * 0.28,
        width: width,
        position: "absolute",
        top: 0,
        alignItems: 'center',
    },
    homeButton: {
        width: width * 0.4,
        height: height * 0.06,
        marginBottom: height * 0.04,
        marginLeft: width * 0.05,
        marginRight: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.02,
        marginBottom: height * 0.02
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row'
    },
 })
export default ProfileCard
