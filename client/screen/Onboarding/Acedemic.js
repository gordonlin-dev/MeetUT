import React, { Component, useState } from 'react';
import { View, SafeAreaView, Dimensions, TouchableOpacity, Text, ScrollView} from 'react-native';
import { styles } from '../styles'; 
import NestedListView from 'react-native-nested-listview'
const secureStore = require('../../SecureStore')

const Acedemic = (props) => {
    const [programs, setPrograms] = useState([]);
    const [chosen, setChosen] = useState([]);
    const colorLevels = {
        [0]: '#d0d0d9',
        [1]: '#abe1f5',
        [2]: '#f2f2fc',
    };

    const submit = async (props, chosen) => {
        try{
            const userID = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-1.herokuapp.com/questionnaire/programs'
            const response = await fetch(url, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserId: userID,
                    Programs: chosen
                })
            });
            const responseJson = await response.json();
            props.navigation.navigate({
                routeName: 'Personal'
            })
            
    
        }catch (e) {
            console.log(e);
        }
    }
    


    const loadPrograms = async () => {
        try{
            const url = 'https://meet-ut-1.herokuapp.com/questionnaire/programs'
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseJson = await response.json();
            setPrograms(responseJson)
            
    
        }catch (e) {
            console.log(e);
        }
    }

    loadPrograms();
    const sortedPrograms = [];
    for (let i = 0; i < programs.length; i++) {
        const temp = {};
        temp.title = programs[i].categoryValue;
        temp.items = [];
        for (let j = 0; j < programs[i].content.length; j++) {
            temp.items.push({id: programs[i].content[j].programId, title: programs[i].content[j].value})
        }
        sortedPrograms.push(temp)
    }
    const toggleChecked = (node) => {
        if (!chosen.some(el => el.value === node.title)) {
            chosen.push({programId: node.id, value: node.title})
            
        }
    } 

    const unselect = (props) => {
        for (let i = 0; i < chosen.length; i++) {
            if (chosen[i].value === props.value) {
                chosen.splice(i, 1)
            }
        } 
    }
    const renderNode = (node, level) => {
        const paddingLeft = (level ?? 0 + 1) * 30;
        const backgroundColor = colorLevels[level ?? 0] || 'white';
        if (level === 1) {
            return (
                <View style={[styles.row, { backgroundColor, paddingLeft }]}>
                    <Text style={styles.headerFont}>{node.title}</Text>
                </View>
            );
            
        } else {
            return (
                <View style={[styles.row, { backgroundColor, paddingLeft }]}>
                    <Text style={styles.headerFont}>{node.title}</Text>
                    <TouchableOpacity style={styles.selectButton} onPress={() => toggleChecked(node)}> 
                    <Text style={styles.headerFont}>select</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
    };
    
    return (
        <SafeAreaView style={styles.quizContainer} >
            
            <View style={styles.scrollContainer} >
                <Text style={styles.headerFont}>Programs</Text>
                <NestedListView
                    data={sortedPrograms}
                    renderNode={renderNode}
                />
            </View>
            <View style={styles.selectedContainer}>
            <Text style={styles.headerFont}>chosen Programs ({chosen.length})</Text>
                <ScrollView style={styles.outputContainer}>
                    
                    {chosen.map((props) => {
                        return(
                            <View style={{flexDirection: 'row',}}>
                                <View style={styles.outputCard}>
                                    <Text style={styles.quizFont}>{props.value}</Text>
                                </View>
                                <TouchableOpacity style={styles.swipeButton} onPress={() => unselect(props)}>
                                        <Text style={styles.headerFont}>Unselect</Text>
                                </TouchableOpacity>
                            </View>
                            
                            
                        )
                        
                    })}
                </ScrollView>
            </View>
            
                <View style={styles.quizeFooter}>
                <TouchableOpacity 
                    style={styles.quizLeftButton}
                    onPress={() => {
                    props.navigation.navigate({
                        routeName: 'Demographics'
                    })
                }}>
                    <Text style={styles.font}>Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.quizRightButton}
                    onPress={() => {
                        submit(props, chosen) 
                    
                }}>
                    <Text style={styles.font}>Next</Text>
                </TouchableOpacity>
            </View>
            
            
        </SafeAreaView>
    );
  
}

export default Acedemic;