// @flow
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import StatusBarAlert from 'react-native-statusbar-alert';
import { Bar as ProgressBar } from 'react-native-progress';
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
  clipboardTimeoutId: number | undefined,
  showSettings: boolean,
  activeIsoKeys: Array<string>,
  isFetching: boolean
}

type Props = undefined;

const isoKeys = Object.keys(isoTable);

export default class App extends React.Component<Props, State> {
  state = {
    translations: [],
    copiedText: false,
    showSettings: false,
    // Default is to show translations for every language in isoTable
    activeIsoKeys: isoKeys,
    isFetching: false
  }

  render() {
    const {
      translations,
      copiedText,
      showSettings,
      activeIsoKeys,
      value,
      isFetching
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <StatusBarAlert
          backgroundColor={colors.accent}
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

          {isFetching &&
            <ProgressBar
              indeterminate
              borderWidth={0}
              color={colors.accent}
              height={1}
              width={null} // null makes it use automatic flexbex sizing
            />
          }

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

        {/* Settings Modal */}
        <Settings
          showSettings={showSettings}
          activeIsoKeys={activeIsoKeys}
          hideSettings={() => this.setState({ showSettings: false })}
          handleSettingsUpdate={this.handleSettingsUpdate}
          handleUnselectAll={this.unselectAllIsoKeys}
          handleSelectAll={this.selectAllIsoKeys}
          getTranslations={this.handleGetTranslations}
        />
      </View>
    );
  }

  /////////////////////////////////////////////////////////////////////
  //                       PRIVATE METHODS                           //
  /////////////////////////////////////////////////////////////////////
  handleGetTranslations = value => {
    const { activeIsoKeys = [], value: storedValue, fetchingTimeoutId } = this.state;
    value = value || storedValue;

    if (value) {
      this.setState({ isFetching: true })

      if (fetchingTimeoutId) clearTimeout(fetchingTimeoutId);

      getTranslations(value, activeIsoKeys)
      .then((translations) => {
        this.setState({ translations, value })

        const fetchingTimeoutId = setTimeout(() => {
          this.setState({ isFetching: false, fetchingTimeoutId: undefined })
        }, 260);

        this.setState({ fetchingTimeoutId })
      })
    }
  }

  handleInputClear = () => {
    this.setState({ translations: [] })
  }

  hideSettings = () => {
    this.setState({ showSettings: false })
  }

  unselectAllIsoKeys = () => this.setState({ activeIsoKeys: [] })

  selectAllIsoKeys = () => this.setState({ activeIsoKeys: isoKeys })

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
    const { clipboardTimeoutId } = this.state;

    // If banner is aleady active remove it and reset it
    if (clipboardTimeoutId) {
      clearTimeout(clipboardTimeoutId);
      this.setState({ copiedText: false, clipboardTimeoutId: undefined });

      setTimeout(this.triggerCopiedTextAlert, .3 * oneSecond);

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

    this.setState({ clipboardTimeoutId: id })
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
