import { View, Text, StyleSheet } from 'react-native';
import React, { useCallback, useState, useEffect }  from 'react';
import { Border ,Color, GlobalStyles } from '../GlobalStyles.js';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';


const Hashtag = ({ tag }) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const preferences = [
    { id: 1, type: 0, name: 'Korean', icon: require('../assets/icons/attributes/korean.png') },
    { id: 2, type: 0, name: 'Japanese', icon: require('../assets/icons/attributes/japanese.png') },
    { id: 3, type: 0, name: 'Chinese', icon: require('../assets/icons/attributes/chinese.png') },
    { id: 4, type: 0, name: 'Asian', icon: require('../assets/icons/attributes/asian.png') },
    { id: 5, type: 0, name: 'Western', icon: require('../assets/icons/attributes/western.png') },
    { id: 6, type: 0, name: 'Pizza', icon: require('../assets/icons/attributes/pizza.png') },
    { id: 7, type: 0, name: 'Burger', icon: require('../assets/icons/attributes/burger.png') },
    { id: 8, type: 0, name: 'Chicken', icon: require('../assets/icons/attributes/chicken.png') },
    { id: 9, type: 0, name: 'Salad', icon: require('../assets/icons/attributes/salad.png') },
    { id: 10, type: 0, name: 'Cafe', icon: require('../assets/icons/attributes/coffee.png') },
    { id: 11, type: 0, name: 'Bar', icon: require('../assets/icons/attributes/bar.png') },
    { id: 12, type: 1, name: 'Vegetarian', icon: require('../assets/icons/attributes/vegetarian.png') },
    { id: 13, type: 1, name: 'Vegan', icon: require('../assets/icons/attributes/salad.png') },
    { id: 14, type: 1, name: 'Pescatarian', icon: require('../assets/icons/attributes/pescatarian.png') },
    { id: 15, type: 1, name: 'Halal', icon: require('../assets/icons/attributes/halal.png') },
    { id: 16, type: 1, name: 'LactoseFree', icon: require('../assets/icons/attributes/lactosefree.png') },
    { id: 17, type: 1, name: 'GlutenFree', icon: require('../assets/icons/attributes/glutenfree.png') },
  ];

    // Check if tag is an integer within the range of 0 to 17
    if (Number.isInteger(tag) && tag >= 0 && tag <= 17) {
      // Find the corresponding name from the preferences array
      const tagName = preferences[tag].name;
      // Assign the tagName to the tag variable
      tag = translations.pref[tagName];
    }


  return (
    <View style={styles.hashtagHolder}>
      <Text
        style={GlobalStyles.hashtag}
        numberOfLines={1}
        ellipsizeMode="tail">
        {tag?.name ? tag?.name : tag}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hashtagHolder: {
    backgroundColor: Color.yellow_100,
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 9,
    justifyContent: 'center',
    borderRadius: Border.br_lg,
  },
});

export default Hashtag;
