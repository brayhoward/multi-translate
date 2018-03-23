import React, { Component } from 'react';
import { percentScreenWidth } from '../utils.js';
import { SearchBar } from 'react-native-elements';

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }
  }

  render() {
    return (
      <SearchBar
        noIcon
        placeholder="Start typing to see translations..."
        containerStyle={styles.container}
        inputStyle={styles.input}
        onChangeText={(value) => console.log(value)}
        onClear={() => console.log('clear')}
        onCancel={() => console.log('cancel')}
      />
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
    color: '#fafafa'
  },
  clearSearch: {
    position: 'absolute',
    right: 14,
    top: 6,
  }
}
