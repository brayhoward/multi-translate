import { googleTranslateToken } from '../secrets';

export default async function(q = '') {
  const url = 'https://translation.googleapis.com/language/translate/v2';

  const data = {
    q,
    source: 'en',
    target: 'es',
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
    const payload = await response.text();

    return payload;

  } catch (error) {
    console.error(error);
  }
}