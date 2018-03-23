import React, { Component } from 'react';
import { Animated, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { percentScreenHeight, percentScreenWidth } from '../utils.js';
import { colors, bd } from '../styleVariables';

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      inputWidth: new Animated.Value( percentScreenWidth(92) ),
      cancelBtnMarginRight: new Animated.Value( -percentScreenWidth(15) )
    }
  }

  handleFocus = () => {
    Animated.timing(                      // Animate over time
      this.state.cancelBtnMarginRight,    // The animated value to drive
      {
        toValue: 0,           // Animate to opacity: 1 (opaque)
        duration: 1000,      // Make it take a while
      }
    ).start();
  }

  handleBlur = () => this.setState({ keyboardOpen: false })

  clearValue = () => this.setState({value: ''})

  render() {
    const { value, keyboardOpen, inputWidth, cancelBtnMarginRight } = this.state;
    const hasText = !!value.length;

    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden'}}>
          <Animated.View style={{flex: 1}}>
            <TextInput
              placeholder="Translate"
              placeholderTextColor={colors.lightMedium}
              style={{...styles.input, width: inputWidth}}
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

          { !keyboardOpen &&
            <TouchableOpacity onPress={() => this._input.blur()}>
              <Text
                style={{ ...styles.cancel, marginRight: cancelBtnMarginRight }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          }
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
    marginLeft: 8
  }
}
