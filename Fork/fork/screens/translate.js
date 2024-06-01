import axios from 'axios';

const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: 'en', // Assuming the source language is English; you can change it as needed
      target: targetLang,
      format: 'text'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response.data); // Log the full response

    if (response.data && response.data.translatedText) {
      return response.data.translatedText;
    } else {
      throw new Error('Translation response format is incorrect');
    }
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Error fetching translation:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Error fetching translation: No response received');
    } else {
      // Something else caused the error
      console.error('Error fetching translation:', error.message);
    }
    return text; // Fallback to original text if there's an error
  }
};

export default translateText;
