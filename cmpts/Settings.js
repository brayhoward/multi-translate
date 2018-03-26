// @flow
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { CheckBox, Icon } from 'react-native-elements';
import { isoTable } from '../services/translate';
import { percentScreenWidth, percentScreenHeight } from '../utils.js';
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

export default class extends Component<Props> {
  render() {
    const { showSettings, hideSettings, handleSettingsUpdate, activeIsoKeys } = this.props;

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
            overflow: 'scroll'
          }}
        >
          <View
            style={{
              paddingTop: 10,
              marginBottom: 10,
              shadowColor: colors.dark,
              shadowOffset: {
                width: 0,
                height: 1
              },
              shadowRadius: 2,
              shadowOpacity: .4
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginRight: 10,
                borderColor: colors.dark,
                borderWidth: 1
              }}
              onPress={hideSettings}
            >
              <Icon name='clear' color={colors.dark} />
            </TouchableOpacity>

            <Headings.Two style={{ color: colors.dark, textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
              select languages
            </Headings.Two>
          </View>

          <ScrollView>
            {
              Object.keys(isoTable)
              .map((isoKey, i) => {
                const language = isoTable[isoKey];
                const active = activeIsoKeys.find(activeKey => activeKey === isoKey)

                return (
                  <CheckBox
                    key={i}
                    title={language}
                    checkedColor={colors.accentSecondary}
                    checked={active}
                    onPress={() => handleSettingsUpdate(isoKey, active)}
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
