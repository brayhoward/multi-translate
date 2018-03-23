import { googleTranslateToken } from '../secrets';

export default async (value) => {
  try {
    const translations = await Promise.all([
      // Spanish
      translate(value, 'es'),
      // Chinese
      translate(value, 'zh'),
      // Japanese
      translate(value, 'ja'),
      // 	Arabic
      translate(value, 'ar'),
    ])

    return translations;
  } catch (err) {
    console.error(err)
  }
}

const translate = async (q = '', target) => {
  const url = 'https://translation.googleapis.com/language/translate/v2';

  const data = {
    q,
    source: 'en',
    target,
    format: 'text'
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${googleTranslateToken}`
      }
    });
    const payload = await response.text()

    return JSON.parse(payload).data.translations[0];

  } catch (err) {
    console.error(err);
  }
}