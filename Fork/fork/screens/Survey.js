import React, { useState, useCallback} from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useNavigation } from '@react-navigation/native';

const Survey = ({ navigation }) => {
  const onConfirm = useCallback(() => {
    navigation.navigate("AdjustFilter"); 
  }, [navigation]);

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState([]);

  const cuisines = [
    { id: 'korean', name: 'Korean', icon: require('../assets/icons/attributes/korean.png') },
    { id: 'japanese', name: 'Japanese', icon: require('../assets/icons/attributes/japanese.png') },
    { id: 'chinese', name: 'Chinese', icon: require('../assets/icons/attributes/chinese.png') },
    { id: 'asian', name: 'Asian', icon: require('../assets/icons/attributes/asian.png') },
    { id: 'western', name: 'Western', icon: require('../assets/icons/attributes/western.png') },
    { id: 'pizza', name: 'Pizza', icon: require('../assets/icons/attributes/pizza.png') },
    { id: 'burger', name: 'Burger', icon: require('../assets/icons/attributes/burger.png') },
    { id: 'chicken', name: 'Chicken', icon: require('../assets/icons/attributes/chicken.png') },
    { id: 'salad', name: 'Salad', icon: require('../assets/icons/attributes/salad.png') },
    { id: 'cafe', name: 'Cafe', icon: require('../assets/icons/attributes/coffee.png') },
    { id: 'bar', name: 'Bar', icon: require('../assets/icons/attributes/bar.png') },
  ];

  const dietaryPreferences = [
    { id: 'vegetarian', name: 'Vegetarian', icon: require('../assets/icons/attributes/vegetarian.png')  },
    { id: 'vegan', name: 'Vegan', icon: require('../assets/icons/attributes/salad.png')  },
    { id: 'pescatarian', name: 'Pescatarian', icon: require('../assets/icons/attributes/pescatarian.png')  },
    { id: 'halal', name: 'Halal', icon: require('../assets/icons/attributes/halal.png')  },
    { id: 'lactose-free', name: 'Lactose-Free', icon: require('../assets/icons/attributes/lactosefree.png')  },
    { id: 'gluten-free', name: 'Gluten-Free', icon: require('../assets/icons/attributes/glutenfree.png')  },
  ];

  const handleSelectCuisine = (cuisine) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) return prev.filter(item => item !== cuisine);
      else return [...prev, cuisine];
    });
  };

  const handleSelectDietaryPreference = (preference) => {
    setSelectedDietaryPreferences(prev => {
      if (prev.includes(preference)) return prev.filter(item => item !== preference);
      else return [...prev, preference];
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your food preferences</Text>
      
      <Text style={styles.subHeader}>CUISINE TYPE</Text>
      <View style={styles.grid}>
        {cuisines.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.option, selectedCuisines.includes(item.id) && styles.selected]}
            onPress={() => handleSelectCuisine(item.id)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>DIETARY PREFERENCE</Text>
      <View style={styles.grid}>
        {dietaryPreferences.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.option, selectedDietaryPreferences.includes(item.id) && styles.selected]}
            onPress={() => handleSelectDietaryPreference(item.id)}
          >
            <Image 
              source={item.icon} 
              style={[
                styles.icon, 
                (item.id === 'lactose-free' || item.id === 'gluten-free') && styles.doubleIcon
              ]}
            />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mainArea}>
        <TouchableOpacity style={GlobalStyles.confirmButton}onPress={onConfirm}>
          <Text style={GlobalStyles.confirmButtonText}>Confirm</Text>
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
  }
});

export default Survey;
