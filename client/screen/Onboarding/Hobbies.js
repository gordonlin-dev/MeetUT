import React, { Component, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { styles } from '../styles'; 

class Hobbies extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hobbies : [],
      };
    }
    
    
  
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };
    
    render() {
      const loadHobbies = async () => {
        try{
            const url = 'https://meet-ut-1.herokuapp.com/questionnaire/hobbies'
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseJson = await response.json();
            this.setState({ hobbies: responseJson })
            
      
        }catch (e) {
            console.log(e);
        }
      }
      const { selectedItems } = this.state;

      loadHobbies();
      const generalHobbies = [];
      for (let i = 0; i < this.state.hobbies.length; i++) {
        generalHobbies.push({ id: i, name: this.state.hobbies[i].categoryValue })
      }
    return (
        <View style={styles.quizContainer} >
            <Text style={styles.headerFont}>Activities</Text>
            <MultiSelect
                hideTags
                items={generalHobbies}
                uniqueKey="id"
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={selectedItems}
                searchInputPlaceholderText="Search Items..."
                onChangeInput={ (text)=> console.log(text)}
                altFontFamily="timeburner"
                itemFontFamily="timeburner"
                tagRemoveIconColor="black"
                tagBorderColor="black"
                tagTextColor="black"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                selectedItemFontFamily="timeburner"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
            >
            </MultiSelect>
            <View style={styles.quizHeader}>
                <Text style={styles.quizFont}>Added Activities</Text>
            </View>
            <View>
                 {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}
            </View>
            <View style={styles.quizeFooter}>
                <TouchableOpacity 
                    style={styles.quizLeftButton}
                    onPress={() => {
                    this.props.navigation.navigate({
                        routeName: 'Reason'
                    })
                }}>
                    <Text style={styles.font}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.quizRightButton}
                    onPress={() => {
                    this.props.navigation.navigate({
                        routeName: 'SpecificHobby'
                    })
                }}>
                    <Text style={styles.font}>Next</Text>
                </TouchableOpacity>
            </View>
            
            
        </View>
    );
  }
}

export default Hobbies;