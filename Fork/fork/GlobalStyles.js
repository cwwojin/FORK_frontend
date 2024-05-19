import { StyleSheet } from 'react-native';

/* fonts */
export const FontFamily = {
  robotoBold: 'Roboto-Bold',
  robotoMedium: 'Roboto-Medium',
  robotoRegular: 'Roboto-Regular',
  robotoLight: 'Roboto-Light',
  mulishSemiBold: 'Mulish-SemiBold',
};

/* font sizes */
export const FontSize = {
  size_xl: 24,
  size_lgi: 20,
  size_mid: 19,
  size_sm: 17,
  size_xs: 15,
  size_smi: 13,

  size_5xs: 8,
  size_mini: 17,
  size_4xl: 23,
  size_8xl: 27,
  size_2xs: 11,
  size_11xl: 30,
  size_base: 16,
  size_20xl: 39,
  size_5xl: 24,
  size_3xl: 22,
};
/* Colors */
export const Color = {
  white: '#fff',
  black: '#000',
  darkgray: '#969696',
  gray_100: '#fefefe',
  gray_200: '#202020',
  lightGrey: '#bbc8d4',
  yellow_100: '#FFF7DA',
  orange_700: '#EA7700',
  orange_100: '#F4BA7F',
};
/* border radiuses */
export const Border = {
  br_sm: 14,
  br_base: 16,
  br_lg: 20,
  br_9xs: 4,
  br_2xs: 11,
  br_3xs: 10,
};

export const GlobalStyles = StyleSheet.create({
  topIcon: {
    margin: 20,
    marginTop: 5,
    right: 0,
    width: 34,
    height: 34,
    position: 'absolute',
  },
  h1: {
    alignSelf: 'left',
    textAlign: 'left',
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
    fontSize: FontSize.size_xl,
    color: Color.colorBlack,
    margin: 10,
    marginTop: 20,
    width: '100%',
  },
  h2: {
    alignSelf: 'left',
    textAlign: 'left',
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
    fontSize: FontSize.size_lgi,
    color: Color.colorBlack,
    margin: 10,
    marginTop: 20,
    width: '100%',
  },
  h3: {
    alignSelf: 'left',
    textAlign: 'left',
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0,
    fontSize: FontSize.size_mid,
    color: Color.colorBlack,
    margin: 10,
    marginTop: 5,
    width: '100%',
  },
  h4: {
    alignSelf: 'left',
    textAlign: 'left',
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
    fontSize: FontSize.size_mid,
    color: Color.orange_700,
    margin: 10,
    marginTop: 5,
    width: '100%',
  },
  body: {
    fontSize: FontSize.size_mid,
    color: Color.colorBlack,
    fontWeight: '700',
    textTransform: 'capitalize',
    fontFamily: FontFamily.robotoBold,
    textAlign: 'left',
    letterSpacing: 0,
  },
  body2: {
    color: Color.darkgray,
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    textTransform: 'capitalize',
    textAlign: 'left',
    letterSpacing: 0,
  },
  body3: {
    fontSize: FontSize.size_sm,
    color: Color.darkgray,
  },
  body4: {
    fontSize: FontSize.size_xs,
    color: Color.colorBlack,
    fontWeight: '500',
    textTransform: 'capitalize',
    fontFamily: FontFamily.robotoBold,
    textAlign: 'left',
    letterSpacing: 0,
  },
  hashtag: {
    fontSize: FontSize.size_smi,
    color: Color.colorBlack,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontFamily: FontFamily.robotoBold,
    textAlign: 'left',
    letterSpacing: 0,
  },
  background: {
    backgroundColor: Color.white,
    flex: 1,
  },
  content: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
  },
  longImage: {
    width: '100%',
    height: 160,
    margin: 20,
    maginTop: 5,
    borderRadius: Border.br_sm,
  },
  squareImage: {
    width: 145,
    height: 145,
    margin: 10,
    borderRadius: Border.br_sm,
  },
  squareImage2: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: Border.br_sm,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileImage2: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  scroll: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
  },
  icon: {
    width: 19,
    height: 19,
  },
  authOptions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  asset: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  startButton: {
    backgroundColor: Color.yellow_100,
    paddingVertical: Border.br_3xs,
    paddingHorizontal: Border.br_lg,
    borderRadius: Border.br_2xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    marginVertical: 5,
    marginBottom: Border.br_lg,
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: Color.orange_700,
    fontSize: Border.br_base,
    fontWeight: 'bold',
  },
  startText: {
    color: Color.orange_700,
    padding: Border.br_3xs,
  },
  registerButton: {
    backgroundColor: Color.white,
    paddingVertical: Border.br_3xs,
    paddingHorizontal: Border.br_lg,
    borderRadius: Border.br_2xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    marginVertical: 5,
    marginBottom: 70,
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: Color.orange_700, // Example color
    borderWidth: 2,
  },
  registerButtonText: {
    color: Color.black,
    fontSize: Border.br_base,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: Color.orange_700,
    paddingVertical: Border.br_3xs,
    paddingHorizontal: Border.br_lg,
    borderRadius: Border.br_2xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 70,
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: Color.orange_700,
    borderWidth: 2,
    width: 120,
  },
  confirmButtonText: {
    color: Color.white,
    fontSize: Border.br_base,
    fontWeight: 'bold',
  },
  confirmButton1: {
    backgroundColor: Color.white,
    paddingVertical: Border.br_3xs,
    paddingHorizontal: Border.br_lg,
    borderRadius: Border.br_2xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 70,
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: Color.orange_700,
    borderWidth: 2,
    width: 120,
  },
  confirmButtonText1: {
    color: Color.orange_700,
    fontSize: Border.br_base,
    fontWeight: 'bold',
  },
  title: {
    color: Color.black,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  registrationInput: {
    height: 50,
    width: '90%',
    borderColor: Color.orange_700,
    padding: 10,
    fontSize: Border.br_base,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: Border.br_lg,
    paddingLeft: 40,
    borderRadius: Border.br_2xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    marginVertical: 5,
    marginBottom: 20,
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
  },
  registrationInput1: {
    height: 50,
    width: '90%',
    borderColor: 'grey',
    padding: 10,
    fontSize: Border.br_base,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: Border.br_lg,
    paddingLeft: 40,
    borderRadius: Border.br_2xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    marginVertical: 5,
    marginBottom: 10,
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
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
    height: 120,
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: 17,
    width: 25,
    height: 25,
  },
  inputIcon1: {
    position: 'absolute',
    left: 10,
    top: 17,
    width: 22,
    height: 22,
  },
  inputIcon2: {
    position: 'absolute',
    left: 12,
    top: 19,
    width: 23,
    height: 23,
  },
  inputIcon3: {
    position: 'absolute',
    left: 8,
    top: 17,
    width: 29,
    height: 24,
  },

  inputIcon4: {
    position: 'absolute',
    left: 9,
    top: 15,
    width: 22,
    height: 28,
  },
  inputIcon5: {
    position: 'absolute',
    left: 10,
    top: 17,
    width: 26,
    height: 24,
  },
  passwordIcon: {
    position: 'absolute',
    left: 13,
    top: 20,
    width: 20,
    height: 20,
  },
  eyeIcon: {
    position: 'absolute',
    left: 242,
    top: 20,
    width: 30,
    height: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputWrapper1: {
    width: 372,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputWrapper2: {
    width: 372,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginLeft: 10,
  },
  inputWrapper3: { //for write review / upload notice input
    width: '100%',
    alignItems: 'center',
},
});
