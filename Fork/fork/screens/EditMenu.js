import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TextInput,
  Button
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { GlobalStyles, Color, Border, FontSize } from '../GlobalStyles';
import { createFacilityMenu, sendBugReport, updateFacilityMenu, uploadMenuImage } from './api';

import placeholderImage from '../assets/placeholders/long_image.png';

const EditMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { facilityID, menu, facilityInfo } = route.params;

  const [menuImage, setMenuImage] = useState(menu ? menu.img_uri : "");
  const [menuImageEdit, setMenuImageEdit] = useState(false);
  const [menuData, setMenuData] = useState(menu ? menu : { name: "", description: "", price: "", quantity: "" });


  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    try {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) return;

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Result object:", result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const source = { uri: result.assets[0].uri };

        // Compress the image
        const uncompressedImage = await ImageManipulator.manipulateAsync(
          source.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        console.log("Compressed image uri:", uncompressedImage.uri);

        setMenuImage(uncompressedImage.uri);
        setMenuImageEdit(true);
      } else {
        console.log("Image selection was canceled");
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const handleUpdateMenu = async () => {
    try {
      if (menu.id) {
        if (menuImageEdit) {
          await uploadMenuImage({ facilityId: facilityID, menuId: menu.id, imageUri: menuImage });
        }
        await updateFacilityMenu({ facilityID: facilityID, menuID: menu.id, menuData: menuData });
        Alert.alert('Success', 'Menu Information Successfully updated');
        navigation.goBack();
        navigation.replace("FacilityInformationEdit", { facilityINFO: facilityInfo, userEmail: facilityInfo.email });
      } else {
        const response = await createFacilityMenu({ facilityID: facilityID, menuData: [menuData] });
        console.log(response);
        if (menuImageEdit) {
          await uploadMenuImage({ facilityId: facilityID, menuId: response[0].id, imageUri: menuImage });
        }
        Alert.alert('Success', 'Menu Information Successfully updated');
        navigation.goBack();
        navigation.replace("FacilityInformationEdit", { facilityINFO: facilityInfo, userEmail: facilityInfo.email });
      }

    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', 'Failed to send facility edits request. Please try again.');
      console.error('Error sending facility edit request:', error);
    }
  };

  const updateMenuItem = (field, value) => {
    setMenuData(prevMenuData => ({
      ...prevMenuData,
      [field]: field === 'price' ? (isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10)) : value
    }));
  };

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.content}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={GlobalStyles.icon}
              source={require('../assets/icons/navigate_left.png')}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -27, paddingBottom: 10 }}>
            <Text style={GlobalStyles.h1}>Update Menu</Text>
          </View>
        </View>

        <View style={styles.container}>
          <TouchableOpacity onPress={selectImage}>
            <Image
              source={menuImage ? { uri: menuImage } : placeholderImage}
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={{ ...GlobalStyles.inputWrapper2, marginLeft: '10%' }}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem('name', text)}
              value={menuData.name}
              placeholder="Menu Item Name"
            />
            <Image source={require("../assets/icons/service.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={{ ...GlobalStyles.inputWrapper2, marginLeft: '10%' }}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem('description', text)}
              value={menuData.description}
              placeholder="Service Description"
            />
            <Image source={require("../assets/icons/menuDescription.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={{ ...GlobalStyles.inputWrapper2, marginLeft: '10%' }}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem('price', text)}
              keyboardType="numeric"
              value={menuData.price?.toString()}
              placeholder="Price"
            />
            <Image source={require("../assets/icons/price.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={{ ...GlobalStyles.inputWrapper2, marginLeft: '10%' }}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem('quantity', text)}
              value={menuData.quantity?.toString()}
              placeholder="Quantity"
            />
            <Image source={require("../assets/icons/number.png")} style={GlobalStyles.inputIcon1} />
          </View>
          <TouchableOpacity style={{ paddingLeft: 10 }} onPress={handleUpdateMenu}>
            <Text style={{ ...GlobalStyles.h1, color: Color.orange_700 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    borderRadius: Border.br_2xs,
    marginBottom: 17,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayTouchable: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: '50%',
    width: '90%',
    justifyContent: 'flex-start',
    backgroundColor: Color.white,
    borderRadius: Border.br_lg,
    padding: 30,
    paddingTop: 15,
    alignItems: 'center'
  },
  inputSection: {
    width: '100%',
    paddingVertical: 10,
  },
  registrationInput1: {
    width: '100%',
    borderColor: Color.lightGrey,
    paddingVertical: 20,
    paddingTop: 20,
    fontSize: FontSize.size_sm,
    color: Color.black,
    paddingHorizontal: 25,
    borderRadius: Border.br_9xs,
    borderWidth: 2,
    height: 60,
  },
  registrationInput2: {
    width: '100%',
    borderColor: Color.lightGrey,
    paddingVertical: 20,
    paddingTop: 20,
    fontSize: FontSize.size_sm,
    color: Color.black,
    paddingHorizontal: 25,
    borderRadius: Border.br_9xs,
    borderWidth: 2,
    height: 180,
  },
});

export default EditMenu;




