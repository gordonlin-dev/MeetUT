
import React from 'react';
import { ImageBackground, Dimensions, View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

const {height, width} = Dimensions.get('window');
const image =  require('../assets/bg.png');
function Authentication({ navigation }) {
  return (
    <View style={styles.bg}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image} >
      <Image
        style={styles.logo}
        source={{
          uri: "https://raw.githubusercontent.com/Meet-UT/MeetUT/master/design/MeetUT%20Logo%20Transparent.png?token=APQ3WJU56MCZYAW2ILDU63TBBQ6QU",
        }}
      />
      <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      </View>
    <View>
    <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
      </View>
        
      </ImageBackground>
  
    </View>
      
      
    );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  container: {
    paddingTop: 100,
    paddingBottom: 45,
    paddingLeft: 100,
  },
  logo: {
    marginTop: -height * 0.05,
    marginLeft: width * 0.355,
    width: 100,
    height: 95,
  },
  button: {
    marginTop: height * 0.08,
    marginLeft: width * 0.16,
    marginBottom: -20,
    width: 240,
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10
  },
  text: {
    color: "#0748BB"
  }
});
export default Authentication;