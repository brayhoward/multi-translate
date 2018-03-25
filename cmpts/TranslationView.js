import React, { Component } from 'react';
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

export default class extends Component {
  state = {
    animatedWidth: new Animated.Value(percentScreenWidth(100)),
    hasFocus: false
  }

  render() {
    const { text, language } = this.props.translation;
    const { hasFocus } = this.state;

    return (
      <View
        accessible={true}
        onPress={this.setFocusState}
        style={styles.container}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Headings.Two>{language}</Headings.Two>

          <TouchableOpacity onPress={() => Clipboard.setString(text)}>
            <Icon name='content-copy' color={colors.light} />
          </TouchableOpacity>
        </View>

        <View>
          <Headings.One style={{ color: colors.accent, ...styles.translation }}>
            {text}
          </Headings.One>

          {/* {true && <Text style={{ color: colors.light }}>Delete</Text>} */}
        </View>
      </View>
    )
  }

  setFocusState(hasFocus = true) {
    this.setState({ hasFocus })
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