// @flow
import React, { PureComponent } from 'react';
import { Text, View, ScrollView } from 'react-native';
import StatusBarAlert from 'react-native-statusbar-alert';
import { Bar as ProgressBar } from 'react-native-progress';
import debounce from 'lodash.debounce';
import { percentScreenWidth, percentScreenHeight } from './utils.js';
import { getTranslations, getIsoTable, Translation } from './services/translate';
import { colors } from './styleVariables';
import Headings from './cmpts/Headings';
import AppInput from './cmpts/AppInput';
import TranslationView from './cmpts/TranslationView';
import Settings from './cmpts/Settings';


type State = {
  value: string,
  translations: Array<Translation>,
  copiedText: boolean,
  clipboardTimeoutId: ?number,
  showSettings: boolean,
  isFetching: boolean,
  errorMsg: ?string,
  isoTable: any,
  isoCodes: Array<string>,
  activeIsoCodes: Array<string>,
}

type Props = {};

export default class App extends PureComponent<Props, State> {
  state = {
    value: '',
    translations: [],
    copiedText: false,
    clipboardTimeoutId: undefined,
    showSettings: false,
    isFetching: false,
    errorMsg: undefined,
    isoTable: {},
    isoCodes: [],
    // Default is to show translations for every language in isoTable
    activeIsoCodes: [],
  }

  componentWillMount() {
    this.getAndSetIsoData();
  }

  render() {
    const {
      translations,
      copiedText,
      showSettings,
      isoTable,
      activeIsoCodes,
      value,
      isFetching,
      errorMsg
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
        <StatusBarAlert
          backgroundColor={"red"}
          statusbarHeight={percentScreenHeight(6.1)}
          style={{paddingBottom: copiedText ? 2 : 0 }}
          visible={!!errorMsg}
          message={errorMsg}
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
          isoTable={isoTable}
          activeIsoCodes={activeIsoCodes}
          hideSettings={() => this.setState({ showSettings: false })}
          handleSettingsUpdate={this.handleSettingsUpdate}
          handleUnselectAll={this.unselectAllIsoKeys}
          handleSelectAll={this.selectAllIsoKeys}
        />
      </View>
    );
  }

  /////////////////////////////////////////////////////////////////////
  //                       PRIVATE METHODS                           //
  /////////////////////////////////////////////////////////////////////
  handleGetTranslations = (value?: string) => {
    const { isoCodes, activeIsoCodes, value: storedValue  } = this.state;
    const isValueUndefined = value === undefined;
    value = isValueUndefined ? storedValue : value;

    if (!isoCodes.length){
      this.getAndSetIsoData()

    } else if (value === '') {
      this.setState({ translations: [], value: '' })

    } else {
      this.setState({ isFetching: true })

      // Cancel the trailing debounced invocation so fetching indicator doesn't flash erratically while
      // User is typing
      this.debouncedSetFetchingFalse.cancel()

      getTranslations(value, activeIsoCodes)
      .then((translations) => {
        this.setState(
          { translations, value },
          this.debouncedSetFetchingFalse
        )
      })
      .catch(() => {
        this.debouncedSetFetchingFalse();
        this.triggerErrorState()
      })
    }
  }

  triggerErrorState() {
    this.setState(
      {
        errorMsg: 'Network error, please try again later',
        translations: [],
        value: ''
      },
      () => {
        this.debouncedSetFetchingFalse();
        // Remove error banner after 1.5 seconds
        setTimeout(() => { this.setState({ errorMsg: undefined }) }, 1.5 * 1000);
      }
    )
  }

  getAndSetIsoData() {
    getIsoTable()
    .then(isoTable => {
      const isoCodes = Object.keys(isoTable);

      this.setState({
        isoTable,
        isoCodes,
        activeIsoCodes: isoCodes
      })
    })
    .catch(() => {
      this.triggerErrorState()
    })
  }

  debouncedSetFetchingFalse = debounce(
    () => this.setState({ isFetching: false }),
    500,
    { trailing: true }
  )

  handleInputClear = () => {
    this.setState({ translations: [] })
  }

  hideSettings = () => {
    this.setState({ showSettings: false })
  }

  unselectAllIsoKeys = () => this.setState({ activeIsoCodes: [] }, this.handleGetTranslations)

  selectAllIsoKeys = () => this.setState(
    ({ isoCodes }) => ({ activeIsoCodes: isoCodes }),
    this.handleGetTranslations
  )

  handleSettingsUpdate = (isoCode: string, active: boolean) => {
    const { value = '' } = this.state;

    this.setState(
      ({ activeIsoCodes }) => {
        const updatedIsoCodes = (
          active ?
            // Remove isoKey from activeIsoCodes array (make inactive)
            activeIsoCodes.filter(activeIsoKey => activeIsoKey !== isoCode)
          :
            // Remove isoKey from activeIsoCodes array
            [...activeIsoCodes, isoCode]
        )

        return { activeIsoCodes: updatedIsoCodes }
      },
      // After updating activeIsoCodes refresh translations
      () => this.handleGetTranslations(value)
    )
  }

  // TODO: abstract all the timeout / setState logic into a reusable module
  copyTextCallback = () => {
    const oneSecond = 1000;
    const { clipboardTimeoutId } = this.state;

    // If banner is aleady active remove it and reset it
    if (clipboardTimeoutId) {
      clearTimeout(clipboardTimeoutId);
      this.setState(
        { copiedText: false, clipboardTimeoutId: undefined },
        // Close then open alert againg after half a second
        () => setTimeout(this.triggerCopiedTextAlert, .5 * oneSecond)
      );
    } else {
      this.triggerCopiedTextAlert()
    }
  }

  triggerCopiedTextAlert = () => {
    const oneSecond = 1000;
    this.setState({ copiedText: true });

    const clipboardTimeoutId = setTimeout(
      () => this.setState({ copiedText: false }),
      1.5 * oneSecond
    )

    this.setState({ clipboardTimeoutId })
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
