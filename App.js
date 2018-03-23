import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { percentScreenWidth } from './utils.js';
import { colors } from './styleVariables';
import AppHeader from './cmpts/AppHeader';
import Headings from './cmpts/Headings';
import AppInput from './cmpts/AppInput';
import { googleTranslateToken } from './secrets';

export default class App extends React.Component {
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

async function getTranslations(q = '') {
  const url = 'https://translation.googleapis.com/language/translate/v2';

  const data = {
    q,
    source: 'en',
    target: 'es',
    format: 'text'
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${googleTranslateToken}`
      }
    });
    const payload = await response.text();

    return payload;

  } catch (error) {
    console.error(error);
  }
}
