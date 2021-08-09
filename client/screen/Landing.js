import React, {useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, TouchableOpacity, ImageBackground} from 'react-native'

const logo = require('../assets/Logo-Transparent.png');
const image =  require('../assets/bg.png');
const secureStore = require('../SecureStore')

const {height, width} = Dimensions.get('window');

const LandingScreen = props => {
    const jwt = secureStore.GetValue('JWT')

    const validateJWT = async(jwt) => {

        try {
            const url = 'https://meet-ut-2.herokuapp.com/auth/validateJWT';

            const response = await fetch(url, {
                method : 'PUT',
                headers: {
                    'authorization': jwt
                }
            });

            return response.ok

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (validateJWT(jwt)) {
            props.navigation.navigate({
                routeName: 'Home'
            })
        }
    }, []);
    return (
        <View style={styles.bg}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Image source={logo} style={styles.logo}/>
                <View>
                <TouchableOpacity style={styles.button}  onPress={() => {
                            props.navigation.navigate({routeName: 'Login'})
                        }}>
                        <Text>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            props.navigation.navigate({routeName: 'Signup'})
                        }}>
                        <Text>Sign Up</Text>
                        </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    empty:{
        flex:1
    },

    bg: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    container: {
        paddingTop: 100,
        paddingBottom: 45,
        paddingLeft: 100,
    },
    logo: {
        marginTop: height * 0.05,
        marginLeft: width * 0.355,
        width: 100,
        height: 95,
    },
    button: {
      width: width * 0.6,
      height: height * 0.06,
      marginTop: height * 0.03,
      marginLeft: width * 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor: 'white',
    },
    text: {
        color: "#0748BB"
    }
});

export default LandingScreen;
