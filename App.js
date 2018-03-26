// @flow
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import StatusBarAlert from 'react-native-statusbar-alert';
import Modal from "react-native-modal";
import { CheckBox } from 'react-native-elements'
import mapValues from 'lodash.mapvalues';
import map from 'lodash.map';
import { percentScreenWidth, percentScreenHeight } from './utils.js';
import getTranslations, { isoTable } from './services/translate';
import { colors } from './styleVariables';
import Headings from './cmpts/Headings';
import AppInput from './cmpts/AppInput';
import TranslationView from './cmpts/TranslationView';

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
  isoTableState: { language: string, translate: boolean }
}

type Props = undefined;

export default class App extends React.Component<Props, State> {
  state = {
    translations: [],
    copiedText: false,
    showSettings: false,
    // Add translate boolean to isoTable values and store value under language.
    // This was so we can toggle on and off based on settings. default value true
    isoTableState: mapValues(isoTable, language => ({ language, translate: true }))
  }

  render() {
    const { translations, copiedText, showSettings, isoTableState, value } = this.state;

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

        <Modal
          isVisible={showSettings}
          onBackdropPress={this.hideSettings}
          onSwipe={this.hideSettings}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          backdropColor={colors.dark}
        >
          <View
            style={{
              width: percentScreenWidth(85),
              height: percentScreenHeight(80),
              backgroundColor: colors.light,
              overflow: 'scroll',
              paddingTop: 10
            }}
          >
            <Headings.Two
              style={{ color: colors.dark, textAlign: 'center', fontWeight: 'bold' }}
            >
              select languages
            </Headings.Two>

            <ScrollView>
              {
                Object.keys(isoTableState).map((isoKey, i) => {
                  const { language, translate } = isoTableState[isoKey];
                  return (
                    <CheckBox
                      key={i}
                      title={language}
                      checkedColor={colors.accentSecondary}
                      checked={translate}
                      onPress={() => {
                      this.setState(({ isoTableState }) => ({
                        // TODO: This logic hurts to read. Do better
                        isoTableState: {
                          ...isoTableState,
                          ...{ [isoKey]: { translate: !translate, language } }
                        }
                      }))

                      setTimeout(() => {
                        this.handleGetTranslations(value);
                      }, 250);
                    }}
                    />
                  )
                })
              }
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }

  ///////////////////
  // PRIVATE METHODS
  ///////////////////
  handleGetTranslations = value => {
    const { isoTableState } = this.state;

    const isoCodes = map(
      isoTableState,
      ({ translate }, key) => (translate ? key : null)
    )
    .filter(keys => keys)


    getTranslations(value, isoCodes)
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
