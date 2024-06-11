import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Border, Color, GlobalStyles } from '../GlobalStyles.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addUserPreference } from '../screens/api';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const Survey = ({ navigation }) => {
  const route = useRoute();
  const id = route.params.id;
  // const id = 9;
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );

  const cuisines = [
    {
      id: 1,
      type: 0,
      name: 'Korean',
      icon: require('../assets/icons/attributes/korean.png'),
    },
    {
      id: 2,
      type: 0,
      name: 'Japanese',
      icon: require('../assets/icons/attributes/japanese.png'),
    },
    {
      id: 3,
      type: 0,
      name: 'Chinese',
      icon: require('../assets/icons/attributes/chinese.png'),
    },
    {
      id: 4,
      type: 0,
      name: 'Asian',
      icon: require('../assets/icons/attributes/asian.png'),
    },
    {
      id: 5,
      type: 0,
      name: 'Western',
      icon: require('../assets/icons/attributes/western.png'),
    },
    {
      id: 6,
      type: 0,
      name: 'Pizza',
      icon: require('../assets/icons/attributes/pizza.png'),
    },
    {
      id: 7,
      type: 0,
      name: 'Burger',
      icon: require('../assets/icons/attributes/burger.png'),
    },
    {
      id: 8,
      type: 0,
      name: 'Chicken',
      icon: require('../assets/icons/attributes/chicken.png'),
    },
    {
      id: 9,
      type: 0,
      name: 'Salad',
      icon: require('../assets/icons/attributes/salad.png'),
    },
    {
      id: 10,
      type: 0,
      name: 'Cafe',
      icon: require('../assets/icons/attributes/coffee.png'),
    },
    {
      id: 11,
      type: 0,
      name: 'Bar',
      icon: require('../assets/icons/attributes/bar.png'),
    },
  ];

  const dietaryPreferences = [
    {
      id: 12,
      type: 1,
      name: 'Vegetarian',
      icon: require('../assets/icons/attributes/vegetarian.png'),
    },
    {
      id: 13,
      type: 1,
      name: 'Vegan',
      icon: require('../assets/icons/attributes/salad.png'),
    },
    {
      id: 14,
      type: 1,
      name: 'Pescatarian',
      icon: require('../assets/icons/attributes/pescatarian.png'),
    },
    {
      id: 15,
      type: 1,
      name: 'Halal',
      icon: require('../assets/icons/attributes/halal.png'),
    },
    {
      id: 16,
      type: 1,
      name: 'LactoseFree',
      icon: require('../assets/icons/attributes/lactosefree.png'),
    },
    {
      id: 17,
      type: 1,
      name: 'GlutenFree',
      icon: require('../assets/icons/attributes/glutenfree.png'),
    },
  ];

  const handleSelectCuisine = (cuisine) => {
    setSelectedCuisines((prev) => {
      if (prev.includes(cuisine))
        return prev.filter((item) => item !== cuisine);
      else return [...prev, cuisine];
    });
  };

  const handleSelectDietaryPreference = (preference) => {
    setSelectedDietaryPreferences((prev) => {
      if (prev.includes(preference))
        return prev.filter((item) => item !== preference);
      else return [...prev, preference];
    });
  };

  const handlePreferences = useCallback(async () => {
    try {
      const allPreferences = [
        ...selectedCuisines,
        ...selectedDietaryPreferences,
      ];
      await Promise.all(
        allPreferences.map((preferenceId) =>
          addUserPreference(id, preferenceId)
        )
      );
      navigation.navigate('SuccessfulRegistration');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
      console.error('Error saving preferences:', error);
    }
  }, [selectedCuisines, selectedDietaryPreferences, navigation, id]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{translations.foodPreferences}</Text>

      <Text style={styles.subHeader}>{translations.cuisineTypes}</Text>
      <View style={styles.grid}>
        {cuisines.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.option,
              selectedCuisines.includes(item.id) && styles.selected,
            ]}
            onPress={() => handleSelectCuisine(item.id)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text>{item.name}</Text>
            {/* <Text>{translations.pref[item.name]}</Text> */}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>{translations.dietaryPreferences}</Text>
      <View style={styles.grid}>
        {dietaryPreferences.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.option,
              selectedDietaryPreferences.includes(item.id) && styles.selected,
            ]}
            onPress={() => handleSelectDietaryPreference(item.id)}
          >
            <Image
              source={item.icon}
              style={[
                styles.icon,
                (item.id === 16 || item.id === 17) && styles.doubleIcon,
              ]}
            />
            <Text>{item.name}</Text>
            {/* <Text>{translations.pref[item.name]}</Text> */}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mainArea}>
        <TouchableOpacity
          style={GlobalStyles.confirmButton}
          onPress={handlePreferences}
        >
          <Text style={GlobalStyles.confirmButtonText}>
            {translations.confirm}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  mainArea: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 40,
  },
  option: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    width: '30%',
    borderRadius: 10,
  },
  selected: {
    borderColor: 'orange',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  doubleIcon: {
    width: 50,
    height: 30,
    marginBottom: 5,
  },
});

export default Survey;
