import { azureTranslatorKey } from '../secrets';
import { DOMParser } from 'xmldom';

const isoTable = {
  'es': 'Spanish',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'pt': 'Portuguese',
  'ru': 'Russian'
}

export default async (value) => {
  try {
    const translations = await Promise.all([
      // Spanish
      translate(value, 'es'),
      // Chinese
      translate(value, 'zh'),
      // Japanese
      translate(value, 'ja'),
      // Arabic
      translate(value, 'ar'),
      // Hindi
      translate(value, 'hi'),
      // Portuguese
      translate(value, 'pt'),
      // Russian
      translate(value, 'ru')
    ])

    return translations;
  } catch (err) {
    console.error(err)
  }
}

const translate = async (text = '', targetLanguage) => {
  const url = 'https://api.microsofttranslator.com/V2/Http.svc/Translate';
  const encodedText = encodeURI(text);
  const query = `?text=${encodedText}?&to=${targetLanguage}&from=en`

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

  return responseDoc.getElementsByTagName('string')[0].textContent;
}