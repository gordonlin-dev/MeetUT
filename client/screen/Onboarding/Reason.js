import React, {useState} from 'react'
import {View, TouchableOpacity, Text} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { styles } from '../styles'; 
const Reason = props => {
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <View style={styles.onboardContainer}>

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
                style={styles.quizLeftButton}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Personal'
                })
            }}>
                <Text style={styles.quizFont}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.quizRightButton}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Hobbies'
                })
            }}>
                <Text style={styles.quizFont}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Reason;
