import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
const secureStore = require('../../SecureStore')

const ProfileCard = props => {

    return(
        <View>
            <Text>
                {props.firstName + ' ' + props.lastName}
            </Text>
        </View>
    )
}

export default ProfileCard
