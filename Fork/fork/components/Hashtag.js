import { View, Text, StyleSheet } from 'react-native';
import { Border ,Color, GlobalStyles } from '../GlobalStyles.js';

const Hashtag = ({ tag }) => {
  return (
    <View style={styles.hashtagHolder}>
      <Text
        style={GlobalStyles.hashtag}
        numberOfLines={1}
        ellipsizeMode="tail">
        {tag}
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
