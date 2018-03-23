import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const onePercentScreenWidth = width / 100;
const onePercentScreenHeight = height / 100;

export const percentScreenWidth = num => Math.floor(num * onePercentScreenWidth);
export const percentScreenHeight = num => Math.floor(num * onePercentScreenHeight);
