import { googleTranslateToken } from '../secrets';

export default async (value) => {
  try {
    const translations = await Promise.all([
      // Spanish
      translate(value, 'es') //,
      // // Chinese
      // translate(value, 'zh'),
      // // Japanese
      // translate(value, 'ja'),
      // // 	Arabic
      // translate(value, 'ar'),
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
  console.log('googleTranslateToken', 'LOGGED BELLOW');
  console.log(googleTranslateToken);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya29.c.El-HBSzFfpatWXBAEH5y-KdNPyRjXSGkzOXNtsRPVPgHXQ46QYruyRrEXYaRB0wYM8KTzQ81FVNPkhFobI-lklkfnWSal212h_S7QixgbT0h7OqsebD3H5XQ54AyAVcLPQ'
      }
    });
    const payload = await response.text()

    return payload;

  } catch (err) {
    console.error(err);
  }
}