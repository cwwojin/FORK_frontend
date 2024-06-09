/* import axios from 'axios';

const apiUrl = 'https://libretranslate.com/translate';

export const translateText = async (text, targetLang) => {
  const response = await axios.post(apiUrl, {
    q: text,
    source: 'en', // Source language code
    target: targetLang,
    format: 'text'
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data.translatedText;
};
 */