import React, {useState} from 'react'
import {View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, Text} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { withDecay } from 'react-native-reanimated';

const {height, width} = Dimensions.get('window');
const logo =  require('../../assets/logo.png');
const Demographics = props => {
    const [firstName, onChangeFirstName] = useState("");
    const [lastName, onChangeLastName] = useState("");
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <View style={styles.container}>

            <TextInput
                style={styles.Input}
                onChangeText={onChangeFirstName}
                value={firstName}
                placeholder="first name"
                placeholderTextColor="black"
            />
            <TextInput
              style={styles.Input}
              onChangeText={onChangeLastName}
              value={lastName}
              placeholder="last name"
              placeholderTextColor="black"
            />
            <View style={styles.pickerHeader}>
                <Text style={styles.headerFont}>Gender</Text>
            </View>
            <Picker
                style={styles.picker}
                selectedValue={selectedValue}
                ColorValue="black"
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label="--" value="--" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Other" value="other" />
                <Picker.Item label="Prefer not to say" value="no" />
            </Picker>

            <ScrollView style={styles.scrollView}>
                <Image style={styles.avator} source={logo}/>
            </ScrollView>
            <View>
                <TouchableOpacity 
                    style={styles.Button}
                    onPress={() => {
                    props.navigation.navigate({
                        routeName: 'Acedemic'
                    })
                }}>
                    <Text style={styles.font}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        alignItems: "center",
        backgroundColor: "#e1e1ea"
    },
    Button: {
        position: 'absolute',
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        marginRight: width*0.6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: "black",
        backgroundColor: 'white',
      },
    pickerHeader: {
        position: 'absolute',
        marginTop: height * 0.25,
        left: width*0.16,
    },
    Input: {
        marginTop: height * 0.03,
        height: height * 0.06,
        width: width * 0.7,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        borderColor: "black",
        color: "black"
    },
    picker: {
        width: width * 0.7,
        height: height * 0.06,
        marginTop: height * 0.04,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        color: "black"
        
    },
    header: {
        fontSize:50,
        marginLeft: width * 0.34,
        color: "white",
        fontFamily: 'timeburner',
    },
    headerFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: "black"  
    },
    font: {
        fontFamily: 'timeburner',
        fontSize:18,
        color: "black",
        fontWeight: "500"
    },
    scrollView: {
        marginTop: height*0.05,
    },
    avator: {
        height: height*0.08,
        width: width*0.12
    }
  });

export default Demographics;
