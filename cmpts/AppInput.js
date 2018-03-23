import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { percentScreenHeight } from '../utils.js';
import { colors, bd } from '../styleVariables';

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }
  }

  handleFocus = () => this.setState({ keyboardOpen: true })

  handleBlur = () => this.setState({ keyboardOpen: false })

  clearValue = () => this.setState({value: ''})

  render() {
    const { value, keyboardOpen } = this.state;
    const hasText = !!value.length;

    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
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
          </View>

          { keyboardOpen &&
            <TouchableOpacity onPress={() => this._input.blur()}>
              <Text style={styles.cancel}>Cancel</Text>
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
    paddingHorizontal: 15,
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
    paddingLeft: 8
  }
}