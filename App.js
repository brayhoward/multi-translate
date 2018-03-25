// @flow
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import StatusBarAlert from 'react-native-statusbar-alert';
import { percentScreenWidth, percentScreenHeight } from './utils.js';
import getTranslations from './services/translate';
import { colors } from './styleVariables';
import Headings from './cmpts/Headings';
import AppInput from './cmpts/AppInput';
import TranslationView from './cmpts/TranslationView';

type Translation = {
  text: string,
  language: string
}

type State = {
  translations: Array<Translation>,
  copiedText: boolean,
  timeoutId: number | undefined
}

type Props = undefined;

export default class App extends React.Component<Props, State> {
  state = {
    translations: [],
    copiedText: false
  }

  render() {
    const { translations, copiedText } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <StatusBarAlert
          backgroundColor={colors.accentSecondary}
          statusbarHeight={percentScreenHeight(6.1)}
          style={{paddingBottom: copiedText ? 2 : 0 }}
          pulse="background"
          visible={copiedText}
          message="Copied to clipboard!"
        />

        <View style={styles.container}>
          <AppInput handleChangeText={this.getTranslations} handleClear={this.handleInputClear} />

          <ScrollView style={styles.scrollView} accessible={true}>
            {translations.map((translation, i) => (
              <TranslationView
                key={i}
                translation={translation}
                copyTextCallback={this.copyTextCallback}
              />
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

  copyTextCallback = () => {
    const oneSecond = 1000;
    const { timeoutId } = this.state;

    // If banner is aleady active remove it and reset it
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.setState({ copiedText: false, timeoutId: undefined });

      const id = setTimeout(
        () => this.triggerCopiedTextAlert(),
        .3 * oneSecond
      );

    } else {
      this.triggerCopiedTextAlert()
    }
  }

  triggerCopiedTextAlert() {
    const oneSecond = 1000;
    this.setState({ copiedText: true });

    const id = setTimeout(
      () => this.setState({ copiedText: false }),
      1.5 * oneSecond
    )

    this.setState({ timeoutId: id })
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
