import React, { Component } from 'react';
import { View } from 'react-native';
import { percentScreenWidth } from '../utils.js';
import { colors } from '../styleVariables';
import Headings from './Headings';


export default class extends Component {

  render() {
    const { text, language } = this.props.translation;

    return (
      <View>
        <Headings.Two>{language}</Headings.Two>

        <View style={{ marginBottom: 10 }}>
          <Headings.One style={{ color: colors.accent }}>
            {text}
          </Headings.One>
        </View>
      </View>
    )
  }
}