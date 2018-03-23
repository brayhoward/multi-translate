import React, { Component } from 'react';
import { Animated, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { percentScreenHeight, percentScreenWidth } from '../utils.js';
import { colors, bd } from '../styleVariables';

//////////////////////////////////////////////////////////////////////
// AppInput Component
// Props:
//  handleChangeText: function that returns the input value on change
//  handleClear: function that is called on cancel press
//////////////////////////////////////////////////////////////////////
export default class AppInput extends Component {
  static get defualtWidth() { return percentScreenWidth(92) }

  state = {
    value: '',
    animatedWidth: new Animated.Value(AppInput.defualtWidth),
    hasFocus: false
  }
  setFocusState(hasFocus = true) { this.setState({ hasFocus }) }

  handleFocus = () => {
    this.setFocusState()
    this.animateWidth(percentScreenWidth(75))
  }

  handleBlur = () => {
    this.setFocusState(false)
    this.animateWidth()
  }

  animateWidth(toValue = AppInput.defualtWidth) {
    Animated.timing(
      this.state.animatedWidth,
      {
        toValue,
        duration: 250,
      }
    ).start();
  }

  clearValue = () => this.setState({value: ''})

  render() {
    const { value, keyboardOpen, animatedWidth, animatedMargin, hasFocus } = this.state;
    const { handleChangeText, handleClear } = this.props;
    const hasText = !!value.length;

    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden'}}>
          <Animated.View style={{width: animatedWidth}}>
            <TextInput
              placeholder={hasFocus ? '' : 'Translate'}
              placeholderTextColor={colors.lightMedium}
              style={styles.input}
              selectionColor={colors.accent}
              value={value}

              ref={input => this._input = input}
              onChangeText={(value) => {
                this.setState({ value })
                handleChangeText(value)
              }}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />

            { hasText &&
              <TouchableOpacity
                style={styles.clearText}
                onPress={() => {
                  this.clearValue()
                  handleClear()
                }}
              >
                <Icon name='clear' color={colors.light} />
              </TouchableOpacity>
            }
          </Animated.View>

          <TouchableOpacity onPress={() => this._input.blur()} >
            <Text style={styles.cancel}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    backgroundColor: colors.medLight,
    paddingVertical: 10,
    paddingLeft: 15,
    minHeight: percentScreenHeight(6)
  },
  input: {
    color: colors.light,
    backgroundColor: colors.medDark,
    height: 30,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 29
  },
  clearSearch: {
    position: 'absolute',
    right: 14,
    top: 6,
  },
  clearText: { position: 'absolute', right: 5, top: 3 },
  cancel: {
    color: colors.light,
    marginLeft: 17
  }
}
