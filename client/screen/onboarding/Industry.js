import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
const {height, width} = Dimensions.get('window');
const items = [{
    id: '1',
    name: 'Academic'
  }, {
    id: '2',
    name: 'Software'
  }, {
    id: '3',
    name: 'Finance'
  }, {
    id: '4',
    name: 'Professional Serevices'
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
        <View style={styles.container} >
            <Text style={styles.headerFont}>Industry Experience</Text>
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
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
            >
            </MultiSelect>
            <View>
                 {
                    MultiSelect.getSelectedItemsExt(selectedItems)
                }
            </View>

            <TouchableOpacity 
                style={styles.leftButton}
                onPress={() => {
                this.props.navigation.navigate({
                    routeName: 'ProjectInterests'
                })
            }}>
                <Text style={styles.font}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.Button}
                onPress={() => {
                this.props.navigation.navigate({
                    routeName: 'Industry'
                })
            }}>
                <Text style={styles.font}>Next</Text>
            </TouchableOpacity>
            
        </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: height*0.05,
        paddingLeft: width*0.15,
        paddingRight: width*0.15,
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
    font: {
        fontFamily: 'timeburner',
        fontSize:18,
        color: "black",
        fontWeight: "500"
    },
    headerFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: "black",
        marginBottom: height * 0.01
    },
  });
export default Hobbies;