import React, { PureComponent } from 'react';
import { Animated, View, TextInput, Text, TouchableOpacity } from 'react-native';
import debounce from 'lodash.debounce';
import { Icon } from 'react-native-elements';
import { percentScreenHeight, percentScreenWidth } from '../utils.js';
import { colors, bd } from '../styleVariables';

//////////////////////////////////////////////////////////////////////
// AppInput Component
// Props:
//  handleChangeText: function that returns the input value on change
//  handleClear: function that is called on cancel press
//////////////////////////////////////////////////////////////////////
export default class AppInput extends PureComponent {
  state = {
    value: '',
    animatedWidth: new Animated.Value(AppInput.defualtWidth),
    hasFocus: false
  }

  static get defualtWidth() { return percentScreenWidth(82) }

  render() {
    const { value, keyboardOpen, animatedWidth, animatedMargin, hasFocus } = this.state;
    const { handleClear, handleSettingsPress } = this.props;
    const hasText = !!value.length;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
          <TouchableOpacity
            style={{ marginHorizontal: percentScreenWidth(4) }}
            onPress={handleSettingsPress}
          >
            <Icon name="settings" color={colors.light} />
          </TouchableOpacity>

          <Animated.View style={{ width: animatedWidth }}>
            <TextInput
              placeholder={hasFocus ? '' : 'Translate'}
              placeholderTextColor={colors.lightMedium}
              style={styles.input}
              selectionColor={colors.accent}
              value={value}

              ref={input => this._input = input}
              onChangeText={(value) => {
                this.setState({ value })
                this.debouncedHandleChangeText(value)
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

  ///////////////////
  // PRIVATE METHODS
  ///////////////////
  debouncedHandleChangeText = debounce(
    this.props.handleChangeText,
    100,
    {
      leading: true,
      maxWait: 200
    }
  )

  setFocusState(hasFocus = true) { this.setState({ hasFocus }) }

  clearValue = () => this.setState({value: ''})

  handleFocus = () => {
    this.setFocusState()

    // Use slightly longer duration to account for animation timing inconsistencies
    this.animateWidth(percentScreenWidth(65), 300)
  }

  handleBlur = () => {
    this.setFocusState(false)
    this.animateWidth()
  }

  animateWidth(toValue = AppInput.defualtWidth, duration = 250) {
    Animated.timing(
      this.state.animatedWidth,
      {
        toValue,
        duration,
      }
    ).start();
  }
}

const styles = {
  container: {
    backgroundColor: colors.medLight,
    paddingBottom: percentScreenHeight(1.1),
    paddingTop: percentScreenHeight(4.5),
    // paddingLeft: 10,
    height: percentScreenHeight(10.5)
  },
  input: {
    color: colors.light,
    backgroundColor: colors.medDark,
    height: percentScreenHeight(5),
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
    marginLeft: percentScreenWidth(4)
  }
}
