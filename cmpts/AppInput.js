import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { percentScreenWidth } from '../utils.js';
import { colors } from '../styleVariables';

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }
  }

  render() {
    const { value } = this.state;

    return (
      <View
        style={{
          backgroundColor: colors.medLight,
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
      >
        <TextInput
          placeholder="Start typing to see translations..."
          placeholderTextColor={colors.lightMedium}
          onChangeText={(value) => this.setState({ value })}
          style={{
            color: colors.light,
            backgroundColor: colors.medDark,
            height: 30,
            borderRadius: 4,
            paddingLeft: 5
          }}
        />

        {/* <Icon name='clear' color={colors.light}/> */}
      </View>
    )
  }
}

const borderWidth = 0;
const padding = percentScreenWidth(2);
const styles = {
  container: {
    paddingLeft: padding,
    paddingRight: padding,
    borderLeftWidth: borderWidth,
    borderTopWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderBottomWidth: borderWidth
  },
  input: {
    color: 'colors.light'
  },
  clearSearch: {
    position: 'absolute',
    right: 14,
    top: 6,
  }
}
