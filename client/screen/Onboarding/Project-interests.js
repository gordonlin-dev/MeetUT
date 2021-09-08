import React, { Component } from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {styles} from '../styles'
const items = [{
    id: '1',
    name: 'Business'
  }, {
    id: '2',
    name: 'Social Courses'
  }, {
    id: '3',
    name: 'Computer Science'
  }, {
    id: '4',
    name: 'Life Science'
  }, {
    id: '5',
    name: '5'
  }, {
    id: '6',
    name: '6'
  }, {
    id: '7',
    name: '7'
  }, {
    id: '8',
    name: '8'
  }, {
    id: '9',
    name: '9'
    }
];
 
class Hobbies extends Component {
 
    state = {
        selectedItems : []
    };
    
  
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };
    
    render() {
        const { selectedItems } = this.state;
 
    return (
        <View style={styles.onboardContainer} >
            <Text style={styles.headerFont}>Project Interests</Text>
            <MultiSelect
                style={styles.select}
                hideTags
                items={items}
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
                <Text style={styles.quizFont}>Added Project Interest</Text>
            </View>
            <View>
                 {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}
            </View>
            <TouchableOpacity 
                style={styles.quizLeftButton}
                onPress={() => {
                this.props.navigation.navigate({
                    routeName: 'SpecificHobby'
                })
            }}>
                <Text style={styles.quizFont}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.quizRightButton}
                onPress={() => {
                this.props.navigation.navigate({
                    routeName: 'Industry'
                })
            }}>
                <Text style={styles.quizFont}>Next</Text>
            </TouchableOpacity>
            
        </View>
    );
  }
}

export default Hobbies;