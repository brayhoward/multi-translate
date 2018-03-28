// @flow
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { CheckBox, Icon } from 'react-native-elements';
import { isoTable } from '../services/translate';
import { percentScreenWidth, percentScreenHeight } from '../utils.js';
import { colors, bd } from '../styleVariables';
import Headings from './Headings';

//////////////////////////////////////////////////////////////////////
// Settings Component (Modal)
// Props:
//  showSettings: boolean
//  hideSettings: function called on modal close actions
//  handleSettingsUpdate: function called on settings update
//  activeIsoKeys: Array of the selected languages
//  handleUnselectAll: function to call when unselcting all languages
//  handleSelectAll: function to call when selcting all languages
//////////////////////////////////////////////////////////////////////
type Props = {
  showSettings: boolean,
  activeIsoKeys: Array<string>,
  hideSettings(): void,
  handleSettingsUpdate(isoKey: string, active: boolean): void,
  handleUnselectAll(): void,
  handleSelectAll(): void
}

export default class extends Component<Props> {
  render() {
    const {
      showSettings,
      hideSettings,
      handleSettingsUpdate,
      activeIsoKeys,
      handleUnselectAll,
      handleSelectAll
    } = this.props;

    const selectableIsoKeys    = Object.keys(isoTable);
    const allLanguagesSelected = activeIsoKeys.length === selectableIsoKeys.length

    const handleMultiSelectPress = () => allLanguagesSelected ? handleUnselectAll() : handleSelectAll();

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

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start'
              }}
            >
              <CheckBox
                checkedColor={colors.accentSecondary}
                uncheckedColor={colors.accentSecondary}
                containerStyle={{ maxWidth: 45, borderWidth: 0 }}
                uncheckedIcon="minus-square"
                checkedIcon="check-square"

                checked={!allLanguagesSelected}
                onPress={handleMultiSelectPress}
              />

              <Headings.Two style={{ color: colors.dark, fontWeight: 'bold'}}>
                select languages
              </Headings.Two>
            </View>
          </View>

          <ScrollView>
            {
              selectableIsoKeys.map((isoKey, i) => {
                const language = isoTable[isoKey];
                const active = activeIsoKeys.includes(isoKey)

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
