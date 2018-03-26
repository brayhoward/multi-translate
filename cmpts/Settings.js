// @flow
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import mapValues from 'lodash.mapvalues';
import Modal from "react-native-modal";
import { CheckBox } from 'react-native-elements';

import { percentScreenWidth, percentScreenHeight } from '../utils.js';
import { isoTable } from '../services/translate';
import { colors } from '../styleVariables';
import Headings from './Headings';

//////////////////////////////////////////////////////////////////////
// Settings Component (Modal)
// Props:
//  showSettings: boolean
//  hideSettings: function called on modal close actions
//  handleSettingsUpdate: function called on settings update
//////////////////////////////////////////////////////////////////////
type Props = {
  showSettings: boolean,
  hideSettings():  void,
  handleSettingsUpdate(): void
}

type State = {
  isoTableState: { language: string, translate: boolean }
}

export default class extends Component {
  state = {
    // Add translate boolean to isoTable values and store value under language.
    // This was so we can toggle on and off based on settings. default value true
    isoTableState: mapValues(isoTable, language => ({ language, translate: true }))
  }

  render() {
    const { showSettings, hideSettings, handleSettingsUpdate } = this.props;
    const { isoTableState } = this.state;

    return (
      <Modal
        isVisible={showSettings}
        onBackdropPress={hideSettings}
        onSwipe={hideSettings}
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
          <Headings.Two style={{ color: colors.dark, textAlign: 'center', fontWeight: 'bold' }}>
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
                    onPress={() => handleSettingsUpdate(isoKey, translate, language)}
                  />
                )
              })
            }
          </ScrollView>
        </View>
      </Modal>
    );
  }
}
