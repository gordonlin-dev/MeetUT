import React from 'react';
import type {Node} from 'react';

import {
  Image,
  SafeAreaView,
  Button,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const logo = require('./logo.png');

const LandingPage = () => {
  return (
    <View style={styles.landingPage}>
      <Image source={logo} style={styles.logo} resizeMode={'contain'} />
      <View style={styles.buttonContainer}>
        <Button title="Sign up" />
        <Button title="Log in" />
      </View>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <LandingPage />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    flex: 10,
    width: null,
    height: null,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  landingPage: {
    flex: 1,
  },
});

export default App;
