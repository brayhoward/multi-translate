// @flow
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { percentScreenWidth } from './utils.js';
import getTranslations from './services/translate';
import { colors } from './styleVariables';
import AppHeader from './cmpts/AppHeader';
import Headings from './cmpts/Headings';
import AppInput from './cmpts/AppInput';

type Translation = {
  text: string,
  language: string
}

type State = {
  translations: Array<Translation>
}

type Props = undefined;

export default class App extends React.Component<Props, State> {
  state = {
    translations: []
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader />

        <View style={styles.container}>
          <AppInput handleChangeText={this.handleTranslations} handleClear={this.handleInputClear} />
        </View>
      </View>
    );
  }

  ///////////////////
  // PRIVATE METHODS
  ///////////////////
  handleTranslations = value => {
    getTranslations(value)
    .then(translations => {
      console.log('translations', 'LOGGED BELLOW');
      console.log(translations);
    })
  }
  handleInputClear = () => {
    console.log('handleClear fired')
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
