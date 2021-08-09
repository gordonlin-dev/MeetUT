import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

const image = require("../assets/Splash.png");

function Splash({ navigation }) {
  setTimeout(() => {navigation.navigate('Landing')}, 4000);
  return (
      <View style={styles.bg}>
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
