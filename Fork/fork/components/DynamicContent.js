/* import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import i18n from '../i18n';
import { translateText } from '../translateService';

const DynamicContent = ({ content }) => {
  const [translatedContent, setTranslatedContent] = useState(content);

  useEffect(() => {
    const translate = async () => {
      const targetLang = i18n.locale === 'en' ? 'ko' : 'en';
      const translated = await translateText(content, targetLang);
      setTranslatedContent(translated);
    };

    if (content) {
      translate();
    }
  }, [content, i18n.locale]);

  return (
    <View>
      <Text>{translatedContent}</Text>
    </View>
  );
};

export default DynamicContent;
 */