import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Clipboard
} from 'react-native';
import { Icon } from 'react-native-elements';
import { percentScreenWidth, percentScreenHeight } from '../utils.js';
import { colors } from '../styleVariables';
import Headings from './Headings';

//////////////////////////////////////////////////////////////////////
// TranslationView Component
// Props:
//  Tranlastion: { text: string, language: string }
//  copyTextCallback: callback to fire when text is copied to clipboard
//////////////////////////////////////////////////////////////////////
export default class extends PureComponent {

  render() {
    const { translation, copyTextCallback } = this.props;
    const { text, language } = translation;

    return (
      <View
        accessible={true}
        onPress={this.setFocusState}
        style={styles.container}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Headings.Two>{language}</Headings.Two>

          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(text);
              copyTextCallback()
            }}
          >
            <Icon name='content-copy' color={colors.light} />
          </TouchableOpacity>
        </View>

        <View>
          <Headings.One style={{ color: colors.accent, ...styles.translation }}>
            {text}
          </Headings.One>
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    marginBottom: percentScreenHeight(4.5),
    paddingBottom: percentScreenHeight(3),
    borderBottomWidth: 1,
    borderColor: colors.medium
  },
  translation: {
    borderTopWidth: 5,
    borderStyle: 'dashed',
    borderColor: '#fff'
  }
}