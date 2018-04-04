import { azureTranslatorKey } from '../secrets';
import { DOMParser } from 'xmldom';

export const isoTable = {
  'es': 'Spanish',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'bn': 'Bengali',
  'de': 'German',
  'id': 'Italian',
  // Indonesion
  'ms': 'Malay',
  'vi': 'Vietnamese',
  'ko': 'Korean',
  'fr': 'French',
  'tr': 'Turkish',
  'fa': 'Persian',
  'pl': 'Polish',
  'nl': 'Dutch'
}

export default async (value, isoCodes) => {
  try {

    return await translate(value, isoCodes);
  } catch (err) {
    console.error(err)
  }
}

const translate = async (text = '', isoCodes) => {
  const encodedText = encodeURI(text);
  const encodedIsoCodes = encodeURI(
    JSON.stringify(isoCodes)
  )
  const url = 'http://0.0.0.0:4000/api/translate';
  const query = `?text=${encodedText}&iso_codes=${encodedIsoCodes}`

  try {
    const response = await fetch(`${url}${query}`);

    const payload = await response.text()

    return JSON.parse(payload).data
  } catch (err) {
    console.error(err);
    return []
  }
}
