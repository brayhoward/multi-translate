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
    const apiCallsArray = (
      isoCodes
      .map(isoCode => (
        translate(value, isoCode)
      ))
    )

    const translations = await Promise.all( apiCallsArray )

    return translations;
  } catch (err) {
    console.error(err)
  }
}

const translate = async (text = '', targetLanguage) => {
  const url = 'https://api.microsofttranslator.com/V2/Http.svc/Translate';
  const encodedText = encodeURI(text);
  const query = `?text=${encodedText}&to=${targetLanguage}&from=en`

  try {
    const response = await fetch(
      `${url}${query}`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': azureTranslatorKey
        }
      }
    );

    const xml = await response.text()
    const text = getTextFromXml(xml)
    const language = isoTable[targetLanguage]

    return { text, language }

  } catch (err) {
    console.error(err);
    return []
  }
}

const xmlParser = new DOMParser();

function getTextFromXml(xml) {
  const responseDoc = xmlParser.parseFromString(xml);

  const element = responseDoc.getElementsByTagName('string')[0]

  return element ? element.textContent : 403
}