import React from "react";
import { ImageBackground, StyleSheet, Button, View } from "react-native";

const image = { uri: "https://cdn.discordapp.com/attachments/865226240779878400/869986919868678164/MeetUT_Splash.png" };

function Splash({ navigation }) {
  return (
    <View style={styles.bg}>
    <ImageBackground source={image} resizeMode="cover" style={styles.image} >
    <Button success transparent style={styles.button}
        title=""
        color="#ffffff00"
        onPress={() => navigation.navigate('Authentication')}
      />
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
  button: {
    height: 5,
  },

});

export default Splash;
