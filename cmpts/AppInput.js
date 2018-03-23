import React, { Component } from 'react';
import { Animated, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { percentScreenHeight, percentScreenWidth } from '../utils.js';
import { colors, bd } from '../styleVariables';

export default class AppInput extends Component {
  static get defualtWidth() { return percentScreenWidth(92) }

  state = {
    value: '',
    animatedWidth: new Animated.Value(AppInput.defualtWidth)
  }

  handleFocus = () => {
    this.animateWidth(percentScreenWidth(75))
  }

  handleBlur = () => {
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
    const { value, keyboardOpen, animatedWidth, animatedMargin } = this.state;
    const hasText = !!value.length;

    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden'}}>
          <Animated.View style={{width: animatedWidth}}>
            <TextInput
              placeholder="Translate"
              placeholderTextColor={colors.lightMedium}
              style={styles.input}
              value={value}

              ref={input => this._input = input}
              onChangeText={(value) => this.setState({ value })}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />

            { hasText &&
              <TouchableOpacity style={styles.clearText} onPress={this.clearValue}>
                <Icon name='clear' color={colors.light} />
              </TouchableOpacity>
            }
          </Animated.View>

          <TouchableOpacity onPress={() => this._input.blur()}>
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
    paddingLeft: 5
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
