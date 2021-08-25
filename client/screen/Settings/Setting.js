import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles';
const secureStore = require('../../SecureStore')
const cfg = require('../cfg.json')
const presenter = require('../Presenter')
const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');
const image =  require('../../assets/bg.png');
const logo = require('../../assets/logo.png')
const signoutSubmit = async (props) => {
    try {
        await secureStore.Delete('UserId');
        await secureStore.Delete('JWT');
        props.navigation.navigate({
            routeName: 'Landing'
        })        
    }catch (error){
        console.log(error)
    }
}

/* Delete user function here, saw the function in controller, not sure how to call it
*/
const deleteButton = async (props) => {

}

const SettingScreen = props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const profile = async () => {
        try {
            const userID = await secureStore.GetValue('UserId');
            const url = cfg.domain + '/users/' + userID
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
          const responseJson = await response.json();
          if (response.status === 200) {
              setLastName(responseJson.lastName)
              setFirstName(responseJson.firstName)
              setEmail(userID)
                
          } else {
              Alert.alert(responseJson.error)
          }
        } catch (error) {
            console.log(error)
            Alert.alert(presenter.internalError())
        }
    }
    profile();
    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image} >
                <View style={styles.profile}>
                    <Image style={styles.avatar} source={logo}/>
                <View style={styles.chat}>
                    <Text style={styles.font}>{firstName + ' ' + lastName}</Text>
                    <Text style={styles.font}>{email}</Text>
                </View>
            
                </View>
                <View style={styles.buttonInRow}>
                <TouchableOpacity
                    onPress={() => {
                        signoutSubmit(props)
                    }}
                    style={styles.Button}>
                    <Text style={styles.font}>Sign Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate({
                        routeName: 'ResetPassword'
                        })
                    }}
                    style={styles.Button}>
                    <Text style={styles.font}>Reset Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {
                        deleteButton(props)
                    }}
                    style={styles.Button}>
                    <Text style={styles.font}>Delete Myself</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerButton}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate({
                            routeName: 'Setting'
                        })
                    }}>
                        <Image style={styles.icon} source={setting}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate({
                            routeName: 'Home'
                        })
                    }}>
                        <Image style={styles.icon} source={home}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate({
                            routeName: 'ChatList'
                        })
                    }}>
                        <Image style={styles.icon} source={chat}/>
                    </TouchableOpacity>
                        
                    </View>
                    
                </View>
            </ImageBackground>
      
        </View>
          
          
        );
};


export default SettingScreen;
