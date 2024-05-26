import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { setLogin, setUser, setStatusBar } from '../reduxStore/userSlice';
import VectorIcon from '../utils/VectorIcon';
import Header from '../components/Header';
import PersonalInfoModal from '../components/PersonalInfoModal';
import ProfestionalInfoModal from '../components/ProfestionalInfoModal';
import EducationalInfoModal from '../components/EducationalInfoModal';
import { STATIC_URL } from '../utils/api';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = () => {
  const [showModal, setShowModal] = useState({
    personal: false,
    educational: false,
    professional: false
  });
  
  const user = useSelector(state => state.user.userInfo)
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setStatusBar({ backgroundColor: "#4B1AFF", barStyle: "light-content" }))
  }, [])

  const LogOut = () => {
    // route.params.login("NO")
    AsyncStorage.removeItem("LOGININFO")
    // AsyncStorage.removeItem("USER")
    dispatch(setLogin(false))
    dispatch(setUser({}))
    setTimeout(() => {
      navigation.navigate('Login')
    }, 1000);
  }

  const subscription = () => {
    navigation.navigate('Subscription')
    dispatch(setStatusBar({ backgroundColor: "#E6F4FE", barStyle: "dark-content" }))
  }

  return (

    <View style={styles.container}>
      <Header name="Profile" />
      <View style={styles.profileImageMain}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: STATIC_URL + 'ProfilePhoto/' + user.PROFILE_PHOTO }}
            style={styles.profileImage}
          />
        </View>
      </View>
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>{user.NAME}</Text>
        <Text style={styles.profileBio}>Veterinary Person</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.subscriptionContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={subscription}>
              <LinearGradient
                colors={[`${user.PLAN_DETAILS?.COLOR_1 || '#b7a3ff'}`, `${user.PLAN_DETAILS?.COLOR_2 || '#c9baff'}`, `${user.PLAN_DETAILS?.COLOR_3 || '#dbd1ff'}`]}
                start={{ x: 0.1, y: 0.7 }}
                end={{ x: 0.3, y: 0 }}
                style={[styles.subscription, { shadowColor: `${user.PLAN_DETAILS?.COLOR_3 || '#dbd1ff'}` }]}
              >
                {
                  user.PLAN_DETAILS.ID ? (
                    <View style={{ width: '70%' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000', width: 85 }}>Active Plan</Text>
                        <Text style={{ fontSize: 15, color: '#000' }}>: {user.PLAN_DETAILS.NAME}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 5 }}>
                        <Text style={{ fontSize: 13, color: '#000', fontWeight: 'bold', width: 85 }}>Price</Text>
                        <Text style={{ fontSize: 13, color: '#000' }}>: ₹ {user.PLAN_DETAILS.AMOUNT}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 13, color: '#000', fontWeight: 'bold', width: 85 }}>Validity</Text>
                        <Text style={{ fontSize: 13, color: '#000' }}>: {user.PLAN_DETAILS.END_DATE ? new Date(user.PLAN_DETAILS.END_DATE).toLocaleDateString() : 'Lifetime'}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={{ width: '70%' }}>
                      <Text style={{ fontSize: 16, fontWeight: '500', color: '#000', textAlign: 'center' }}> Currently You Dont Have Any Active Plan</Text>
                    </View>
                  )
                }
                <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 40 }}>
                  {
                    user.PLAN_DETAILS.ID ? (
                      <Image source={{ uri: STATIC_URL + 'PlanImage/' + user.PLAN_DETAILS.IMAGE }} style={{ width: 60, height: 60 }} />
                    ) : (
                      <>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#5a5a5a' }}>Buy</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#5a5a5a' }}>Now</Text>
                      </>
                    )
                  }
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.profileContent}>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Mobile       : </Text>
              <Text style={styles.sectionContent}>{user.MOBILE_NUMBER}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Email         : </Text>
              <Text style={styles.sectionContent}>{user.EMAIL}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Gender      : </Text>
              <Text style={styles.sectionContent}>Male</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>DOB           : </Text>
              <Text style={styles.sectionContent}>{user.DATE_OF_BIRTH}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Address    : </Text>
              <Text style={styles.sectionContent}>{user.ADDRESS + ", " + user.VILLAGE + ", " + user.TALUKA_NAME + ", " + user.DISTRICT_NAME + ", " + user.PIN_CODE}</Text>
            </View>
          </View>
          <View style={styles.editContainer}>
            <View style={[styles.editBar, { justifyContent: 'flex-start', gap: 10, paddingBottom: 5 }]}>
              <Text style={[styles.sectionHeader, { paddingLeft: 15 }]} >Edit</Text>
              <VectorIcon
                type="FontAwesome5"
                name="user-edit"
                color={'#5a5a5a'}
                size={20}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.editBar}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    setShowModal(prev => ({ ...prev, personal: true }))
                  }}
                >
                  <View style={styles.buttonIcon}>
                    <VectorIcon
                      type="Octicons"
                      name="person"
                      color={'#5a5a5a'}
                      size={20}
                    />
                  </View>
                  <Text style={styles.buttonText}>Personal Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    setShowModal(prev => ({ ...prev, educational: true }))
                  }}
                >
                  <View style={styles.buttonIcon}>
                    <VectorIcon
                      type="SimpleLineIcons"
                      name="graduation"
                      color={'#5a5a5a'}
                      size={20}
                    />
                  </View>
                  <Text style={styles.buttonText}>Educational Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonContainer, { marginRight: 10 }]}
                  onPress={() => {
                    setShowModal(prev => ({ ...prev, professional: true }))
                  }}
                >
                  <View style={styles.buttonIcon}>
                    <VectorIcon
                      type="Ionicons"
                      name="briefcase-outline"
                      color={'#5a5a5a'}
                      size={20}
                    />
                  </View>
                  <Text style={styles.buttonText}>Profestional Info</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity
            style={[styles.buttonContainer, { borderColor: 'red', borderWidth: 1.5, marginBottom: 20 }]}
            onPress={() => LogOut()}
          >
            <Text style={[styles.buttonText, { color: 'red', fontWeight: 'bold', fontSize: 15, }]}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={{ color: "#7a7a7a", fontSize: 12, fontWeight: 'bold', paddingTop: 10 }}>Version 1.0.0</Text>
          <Text style={{ color: "#7a7a7a", fontSize: 10, fontWeight: 'bold', paddingTop: 10 }}>Developed By</Text>
          <Text style={{ fontWeight: 'bold', color: '#5a5a5a', paddingTop: 1 }}>Sumit Ghatage</Text>
        </View >
      </ScrollView >
      <PersonalInfoModal showModal={showModal.personal} setModal={() => setShowModal(prev => ({ ...prev, personal: false }))} />
      <ProfestionalInfoModal showModal={showModal.professional} setModal={() => setShowModal(prev => ({ ...prev, professional: false }))} />
      <EducationalInfoModal showModal={showModal.educational} setModal={() => setShowModal(prev => ({ ...prev, educational: false }))} />
    </View >
  );
};

const styles = StyleSheet.create({
  subscription: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    width: '95%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  subscriptionContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: 5,
    paddingBottom: 10,
  },
  profileImageMain: {
    backgroundColor: '#4B1AFF',
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 480,
    borderBottomRightRadius: 15,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: '#03B11D',
    borderColor: '#fff',
    padding: 2,
    borderWidth: 2,
    borderRadius: 120,
    backgroundColor: '#03B11D',
    // backgroundColor: '#fff',
  },
  editBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 15,
    width: '100%',
  },
  editContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 10,
    paddingTop: 10,
    padding: 15,
  },
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: 'center',
    margin: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    color: '#1e1a2a',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#03B11D',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 2,
    textAlign: 'center',
  },
  profileContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    width: '95%',
    borderRadius: 10,
    shadowColor: '#4B1AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 5,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    // marginBottom: 10,
    alignItems: 'center',
    color: '#3e3a3a',
  },
  sectionContent: {
    fontSize: 14,
    // marginBottom: 10,
    alignItems: 'center',
    maxWidth: '80%',
    color: '#5d5a5a',
  },
  section: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // backgroundColor:'red',
    gap: 10,
    padding: 10,
    alignItems: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 0.6,
  },
  buttonContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    height: 45,
    width: 165,
    borderWidth: 1,
    borderColor: '#3e3a3a',
    color: "#5a5a5a",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    color: "#7a7a7a",
    alignContent: "center",
  },
  buttonIcon: {
    borderRadius: 16.5,
    width: 37,
    height: 37,
    padding: 5,
    backgroundColor: '#efefef',
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default ProfileScreen;
