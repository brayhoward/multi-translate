// @flow
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { percentScreenWidth } from './utils.js';
import getTranslations from './services/translate';
import { colors } from './styleVariables';
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
    const { translations } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <AppInput handleChangeText={this.getTranslations} handleClear={this.handleInputClear} />

          <ScrollView style={styles.scrollView} accessible={true}>
            {translations.map(({ text, language }, i) => (
              <View key={i}>
                <Headings.Two>{language}</Headings.Two>

                <View style={{marginBottom: 10 }}>
                  <Headings.One style={{ color: colors.accent }}>
                    {text}
                  </Headings.One>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  ///////////////////
  // PRIVATE METHODS
  ///////////////////
  getTranslations = value => {
    getTranslations(value)
    .then(translations => {
      this.setState({ translations })
    })
  }
  handleInputClear = () => {
    this.setState({ translations: [] })
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.dark
  },
  heading: {
    marginVertical: 10,
    textAlign: 'center'
  },
  clearSearch: {
    position: 'absolute',
    right: 14,
    top: 6,
  },
  scrollView: {
    paddingHorizontal: 15,
    paddingTop: 20
  }
};
