import React from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions} from 'react-native'

const logo = require('../assets/logo.png');

const {height, width} = Dimensions.get('window');

const LandingScreen = props => {
    return(
        <View style={styles.container}>
            <Image source={logo} style={styles.logo}/>
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button title={'Log in'} onPress={() => {
                        props.navigation.navigate({
                            routeName : 'Login'
                        })
                    }}/>
                </View>
                <View style={styles.button}>
                    <Button title={'Sign up'} onPress={() => {
                        props.navigation.navigate({
                            routeName: 'Signup'
                        })
                    }}/>
                </View>
                <View style={styles.button}>
                    <Button title={'Chat'} onPress={() => {
                        props.navigation.navigate({
                            routeName: 'Chat'
                        })
                    }}/>
                </View>
                <View style={styles.button}>
                    <Button title={'Home'} onPress={() => {
                        props.navigation.navigate({
                            routeName: 'Home'
                        })
                    }}/>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    logo: {
        flex:3,
        width: null,
        height: null,
        marginBottom: height * 0.1,
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

export default LandingScreen;
