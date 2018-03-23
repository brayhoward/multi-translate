import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const onePercentScreenWidth = width / 100;

export const percentScreenWidth = num => Math.floor(num * onePercentScreenWidth);
