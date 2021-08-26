import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import { styles } from '../styles'; 

class Acedemic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            year: '--',
            college: '--',
            type: []
        };
    }
    
  
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };
    
    render() {
        const loadTypes = async () => {
            try{
                const url = 'https://meet-ut-1.herokuapp.com/questionnaire/programs'
                const response = await fetch(url, {
                    method : 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const responseJson = await response.json();
                this.setState({ type: responseJson })
                
        
            }catch (e) {
                console.log(e);
            }
        }
        const { selectedItems } = this.state;

        loadTypes();
        const allTypes = [];
        for (let i = 0; i < this.state.type.length; i++) {
            allTypes.push({ id: i, name: this.state.type[i].categoryValue })
        }
        
        /* Not completed yet
        */
        const loadPrograms = selectedItems => {
            const allPrograms = [];
            for (let i = 0; i < this.state.type.length; i++) {
                if (selectedItems.includes(i)){
                    console.log(this.state.type[i].categoryValue)
                    for (let j = 0; j < this.state.type[i].contenet.length; j++) {
                        allPrograms.push({ id: j, name: this.state.type[i].content[j].Value})
                        console.log(this.state.type[i].content[j].Value)
                    }
                }
                
            }
            
        }
        
    return (
        <View >
            <ScrollView style={styles.quizContainer} >
                
                <Text style={styles.headerFont}>Programs</Text>
                <View style={styles.pickerHeader}>
                    
                    <Text style={styles.headerFont}>Year of Study</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                </View>

                <View style={styles.pickerHeader}>
                    <Text style={styles.headerFont}>College</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                </View>
                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>Added Programs</Text>
                </View>
                <View>
                    {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}
                </View>
            </ScrollView>
            
            
            
        </View>
    );
  }
}

export default Acedemic;
