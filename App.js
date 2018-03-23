import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { percentScreenWidth } from './utils.js';
import { colors } from './styleVariables';
import AppHeader from './cmpts/AppHeader';
import Headings from './cmpts/Headings';
import AppInput from './cmpts/AppInput';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader />

        <View style={styles.container}>
          <AppInput />

          {/* <Headings.One style={styles.clearSearch}>X</Headings.One> */}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  heading: {
    marginVertical: 10,
    textAlign: 'center'
  },
  clearSearch: {
    position: 'absolute',
    right: 14,
    top: 6,
  }
};
