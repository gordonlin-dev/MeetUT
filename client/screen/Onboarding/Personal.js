import React, {Fragment, useEffect, useState} from 'react'
import {
    View,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Text,
    StyleSheet,
    SectionList,
    TextInput
} from 'react-native'
import {styles} from '../styles'
const {height, width} = Dimensions.get('window');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const lookups = require('../Lookups.json')


const Personal = props => {
    const [reasons, setReasons] = useState([]);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [industryExperience, setIndustryExperience] = useState([]);
    const [selectedIndustryExperience, setSelectedIndustryExperience] = useState([]);
    const [hobbies, setHobbies] = useState([])
    const [selectedHobbies, setSelectedHobbies] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])
    const [countriesFiler, setCountriesFilter] = useState("")
    const [renderStage, setRenderStage] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(true);

    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Personal,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(response.ok){
            const responseJson = await response.json()
            setReasons(responseJson.reasonsToJoin)
            setProjects(responseJson.projectInterests)
            setIndustryExperience(responseJson.industryExperiences)
            setCountries(responseJson.countriesLivedIn)
            setHobbies(responseJson.hobbies)
        }
    }

    const save = async () => {
        const body = {
            ReasonsToJoin: selectedReasons,
            IndustryExperiences: selectedIndustryExperience,
            CountriesLivedIn: selectedCountries,
            ProjectInterests: selectedProjects,
            SelectedHobbies: selectedHobbies
        }
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Personal,
            texts.HTTP.Post,
            body,
            false,
            props
        )
        if(response.ok){
            console.log(123)
        }
    }
    const generateReasonsSelection = () => {
        let section = {
            title:"",
            data:reasons.sort((a,b) => {return a.id - b.id})
        }
        return [section]
    }

    const reasonSelectPress = (item) => {
        if(selectedReasons.filter(x => x.id === item.id).length === 0){
            selectedReasons.push(item)
            setSelectedReasons(selectedReasons)
        }else{
            setSelectedReasons(selectedReasons.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const generateProjectSelection = () => {
        let section = {
            title:"",
            data:projects.sort((a,b) => {return a.id - b.id})
        }
        return [section]
    }
    const projectSelectPress = (item) => {
        if(selectedProjects.filter(x => x.id === item.id).length === 0){
            selectedProjects.push(item)
            setSelectedProjects(selectedProjects)
        }else{
            setSelectedProjects(selectedProjects.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const generateIndustrySelection = () => {
        let section = {
            title:"",
            data:industryExperience.sort((a,b) => {return a.id - b.id})
        }
        return [section]
    }

    const industrySelectPress = (item) => {
        if(selectedIndustryExperience.filter(x => x.id === item.id).length === 0){
            selectedIndustryExperience.push(item)
            setSelectedIndustryExperience(selectedIndustryExperience)
        }else{
            setSelectedIndustryExperience(selectedIndustryExperience.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const generateCountrySelection = () => {
        const notSelectedCountries = countries.filter(x =>
            (selectedCountries.indexOf(x) === -1) &&
            (x.value.includes(countriesFiler))
        )
        let selectedSection = {
            title:"",
            data:selectedCountries.sort((a,b) => {return a.value > b.value})
        }
        let section = {
            title:"",
            data:notSelectedCountries.sort((a,b) => {return a.value > b.value})
        }
        return [selectedSection,section]
    }

    const generateHobbiesSelection = () => {
        let sections = []
        for (let i = 0; i < hobbies.length; i++){
            let section = {
                title:hobbies[i].categoryValue,
                data:hobbies[i].content.sort((a,b) => {return a.value > b.value})
            }
            sections.push(section)
        }
        return sections
    }

    const generateSelectedHobbies = () => {
        let section = {
            title:"Selected",
            data:selectedHobbies
        }
        return [section]
    }

    const hobbiesPress = (hobby) => {
        const filtered = selectedHobbies.filter(element => element.hobbyId === hobby.hobbyId)
        if(filtered.length === 0){
            selectedHobbies.push(hobby)
            setSelectedHobbies(selectedHobbies)
            removeHobby(hobby.hobbyId)
            setForceUpdate(!forceUpdate)
        }
    }
    const selectedHobbiesPress = (hobby) => {
        setSelectedHobbies(selectedHobbies.filter(element => element.hobbyId !== hobby.hobbyId))
        addHobby(hobby)
        setForceUpdate(!forceUpdate)
    }

    const removeHobby = (hobbyId) =>{
        for(let i = 0; i < hobbies.length; i++){
            hobbies[i].content = hobbies[i].content.filter(element => element.hobbyId !== hobbyId)
        }
        setHobbies(hobbies)
    }

    const addHobby = (hobby) => {
        for(let i = 0; i < hobbies.length; i ++){
            if(hobby.categoryIds.filter(element => element === hobbies[i].categoryId).length > 0){
                if(hobbies[i].content.filter(element => element.hobbyId === hobby.hobbyId).length === 0){
                    hobbies[i].content.push(hobby)
                    hobbies[i].content.sort((a,b) => {return a.value > b.value})
                }
            }
        }
        setHobbies(hobbies)
    }

    const countrySelectPress = (item) => {
        if(selectedCountries.filter(x => x.id === item.id).length === 0){
            selectedCountries.push(item)
            setSelectedCountries(selectedCountries)
        }else{
            setSelectedCountries(selectedCountries.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const getReasonItemStyle = (item) =>{
        if(selectedReasons.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }
    const getProjectItemStyle = (item) => {
        if(selectedProjects.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }

    const getIndustryItemStyle = (item) => {
        if(selectedIndustryExperience.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }
    const getCountryItemStyle = (item) => {
        if(selectedCountries.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }

    const renderBody = () => {
        if(renderStage === 0){
            return(
                <Fragment>
                    <View>
                        <Text style={styles.headerFont}>What are your reasons for joining MeetUT?</Text>
                        <SectionList sections={generateReasonsSelection()}
                                     renderItem={({item}) => <Text style={getReasonItemStyle(item)} onPress={() => {
                                         reasonSelectPress(item)
                                     }}>{item.value}</Text>}
                                     keyExtractor={(item, index) => index}
                        >

                        </SectionList>
                        <Text style={styles.headerFont}>Project interests</Text>
                        <SectionList sections={generateProjectSelection()}
                                     renderItem={({item}) => <Text style={getProjectItemStyle(item)} onPress={() => {
                                         projectSelectPress(item)
                                     }}>{item.value}</Text>}
                                     keyExtractor={(item, index) => index}
                        >

                        </SectionList>
                    </View>
                </Fragment>
            )
        }else if(renderStage === 1){
            return(
                <Fragment>
                    <View>
                        <Text style={styles.headerFont}>Industry Experience</Text>
                        <SectionList
                            style={inpageStyle.list}
                            sections={generateIndustrySelection()}
                            renderItem={({item}) => <Text style={getIndustryItemStyle(item)} onPress={() => {
                                industrySelectPress(item)
                            }}>{item.value}</Text>}
                            keyExtractor={(item, index) => index}
                        >
                        </SectionList>
                    </View>
                </Fragment>
            )
        }else if (renderStage === 2){
            return(
                <Fragment>
                    <View style={styles.scrollContainer} >
                        <Text style={styles.headerFont}>Hobbies</Text>
                        <SectionList sections={generateHobbiesSelection()}
                                     renderItem={({item}) => <Text style={inpageStyle.item} onPress={() => {
                                         hobbiesPress(item)
                                     }}>{item.value}</Text>}
                                     renderSectionHeader={({section}) => <Text style={inpageStyle.sectionHeader}>{section.title}</Text>}
                                     keyExtractor={(item, index) => index}
                        >

                        </SectionList>
                    </View>
                    <View style={styles.selectedContainer}>
                        <Text style={styles.headerFont}>Chosen Hobbies ({selectedHobbies.length})</Text>
                        <SectionList sections={generateSelectedHobbies()}
                                     renderItem={({item}) => <Text style={inpageStyle.item} onPress={() => {
                                         selectedHobbiesPress(item)
                                     }}>{item.value}</Text>}
                                     keyExtractor={(item, index) => index}
                        >

                        </SectionList>
                    </View>
                </Fragment>
            )
        }else if(renderStage === 3){
            return(
                <Fragment>
                    <View>
                        <Text style={styles.headerFont}>Places lived in</Text>
                        <TextInput
                            onChangeText={setCountriesFilter}
                        />
                        <SectionList
                            style={inpageStyle.list}
                            sections={generateCountrySelection()}
                            renderItem={({item}) => <Text style={getCountryItemStyle(item)} onPress={() => {
                                countrySelectPress(item)
                            }}>{item.value}</Text>}
                            keyExtractor={(item, index) => index}
                        >
                        </SectionList>
                    </View>
                </Fragment>
            )
        }

    }
    return (
        <SafeAreaView style={styles.onboardContainer}>
            {renderBody()}
            <View style={inpageStyle.quizeFooter}>
                <TouchableOpacity
                    style={styles.quizLeftButton}
                    onPress={() => {
                        if(renderStage == 0){
                            props.navigation.navigate({
                                routeName: 'Academic'
                            })
                        }else{
                            setRenderStage(renderStage - 1)
                        }
                    }}>
                    <Text style={styles.quizFont}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quizRightButton}
                    onPress={() => {
                        if(renderStage === 3){
                            save()
                        }else{
                            setRenderStage(renderStage + 1)
                        }
                    }}>
                    <Text style={styles.quizFont}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const inpageStyle = StyleSheet.create ({
    quizeFooter: {
        position: "absolute",
        backgroundColor: '#e1e1ea',
        height: height * 0.1,
        width: width,
        top: height*0.82
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: 'rgba(0,0,0,1.0)'
    },
    itemSelected:{
        padding: 10,
        fontSize: 18,
        height: 44,
        color: 'rgba(247,0,0,1.0)'
    },
    list:{
        height: height / 2
    }
})
export default Personal;
