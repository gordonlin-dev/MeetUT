import React, {useState} from 'react'
import {View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, Text} from 'react-native'
import {Picker} from '@react-native-picker/picker';

const {height, width} = Dimensions.get('window');
const Reason = props => {
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <View style={styles.container}>

            <View style={styles.pickerHeader}>
                <Text style={styles.headerFont}>Reason for using MeetUT</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedValue}
                    ColorValue="black"
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="--" value="--" />
                    <Picker.Item label="Make new friends within my field of study" value="within" />
                    <Picker.Item label="Make new friends outside my field of study" value="outside" />
                    <Picker.Item label="Connect with students for a project" value="other" />
                </Picker>
            </View>
            
            

            <TouchableOpacity 
                style={styles.leftButton}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Personal'
                })
            }}>
                <Text style={styles.font}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.Button}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Hobbies'
                })
            }}>
                <Text style={styles.font}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: height*0.05,
        alignItems: "center",
        backgroundColor: "#e1e1ea"
    },
    leftButton: {
        position: 'absolute',
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        left: width*0.02,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: "black",
        backgroundColor: 'white',
      },
    Button: {
        position: 'absolute',
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        right: width*0.02,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: "black",
        backgroundColor: 'white',
      },
    pickerHeader: {
        marginTop: height * 0.01,
        left: width*0.01,
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

export default Reason;
