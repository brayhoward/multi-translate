// @flow
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import StatusBarAlert from 'react-native-statusbar-alert';
import map from 'lodash.map';
import mapValues from 'lodash.mapvalues';
import { percentScreenWidth, percentScreenHeight } from './utils.js';
import getTranslations, { isoTable } from './services/translate';
import { colors } from './styleVariables';
import Headings from './cmpts/Headings';
import AppInput from './cmpts/AppInput';
import TranslationView from './cmpts/TranslationView';
import Settings from './cmpts/Settings';

type Translation = {
  text: string,
  language: string
}

type State = {
  value: string,
  translations: Array<Translation>,
  copiedText: boolean,
  timeoutId: number | undefined,
  showSettings: boolean,
  isoKeys: Array<string>
}

type Props = undefined;

export default class App extends React.Component<Props, State> {
  state = {
    translations: [],
    copiedText: false,
    showSettings: false,
    // Default is to show translations for every language in isoTable
    activeIsoKeys: Object.keys(isoTable)
  }

  render() {
    const { translations, copiedText, showSettings, activeIsoKeys, value } = this.state;

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
          <AppInput
            handleChangeText={this.handleGetTranslations}
            handleClear={this.handleInputClear}
            handleSettingsPress={() => this.setState({ showSettings: true })}
          />

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

        {/* Setting Modal */}
        <Settings
          showSettings={showSettings}
          activeIsoKeys={activeIsoKeys}
          hideSettings={() => this.setState({ showSettings: false })}
          handleSettingsUpdate={this.handleSettingsUpdate}
        />
      </View>
    );
  }

  /////////////////////////////////////////////////////////////////////
  //                       PRIVATE METHODS                           //
  /////////////////////////////////////////////////////////////////////
  handleGetTranslations = value => {
    const { activeIsoKeys = [] } = this.state;

    getTranslations(value, activeIsoKeys)
    .then((translations) => {
      this.setState({ translations, value })
    })
  }

  handleInputClear = () => {
    this.setState({ translations: [] })
  }

  hideSettings = () => {
    this.setState({ showSettings: false })
  }

  handleSettingsUpdate = (isoKey, active: boolean) => {
    const { value = '' } = this.state;

    this.setState(({ activeIsoKeys }) => {
      updatedIsoKeys = (
        active ?
          // Remove isoKey from activeIsoKeys array (make inactive)
          activeIsoKeys.filter( activeIsoKey => activeIsoKey !== isoKey)
        :
          // Remove isoKey from activeIsoKeys array
          [...activeIsoKeys, isoKey]
      )

      return { activeIsoKeys: updatedIsoKeys }
    })

    if (value) {
      // Let the setState call above propigate before refreshing the translations.
      setTimeout(() => {
        this.handleGetTranslations(value);
      }, 250);
    }
  }

  // TODO: abstract all the timeout / setState logic into a reusable module
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
