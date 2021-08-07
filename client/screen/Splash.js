import React from "react";
import { ImageBackground, StyleSheet, Button, View } from "react-native";

const image = require("../assets/Splash.png");

function Splash({ navigation }) {
  return (
      <View style={styles.bg} onTouchStart={() => {navigation.navigate('Landing')}}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
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
