import React from 'react';
import { Header } from 'react-native-elements';
import { colors } from '../styleVariables';

export default () => (
  <Header
    outerContainerStyles={styles.outer}
    centerComponent={{ text: 'MULTI TRANSLATE', style: styles.center }}
  />
)

const styles = {
  outer: {
    backgroundColor: colors.medium,
    borderBottomWidth: 0
  },
  center: { color: colors.light },
}
