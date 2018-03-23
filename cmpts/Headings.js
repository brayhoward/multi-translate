import React from 'react';
import { Text, View } from 'react-native';
import capitalize from 'lodash.capitalize';
import { Header } from 'react-native-elements';

const defaultStyles = {
  h1: { fontSize: 25 },
  h2: { fontSize: 20 },
  sharedStyles: { color: '#fefefe'}
};

const heading = (headerStyle) => ({ children, style = {} }) => (
  <Text style={{ ...defaultStyles.sharedStyles, ...headerStyle, ...style}}>
    {
      children
      .split(' ')
      .map(word => capitalize(word))
      .join(' ')
    }
  </Text>
)

export default {
  One: heading(defaultStyles.h1),
  Two: heading(defaultStyles.h2)
}
