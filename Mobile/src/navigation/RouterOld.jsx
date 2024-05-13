import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ActiveScreen from '../screens/ActiveScreen';
import ReportScreen from '../screens/ReportScreen';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import InternetConCheck from '../screens/InternetConCheck';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetInfo } from '@react-native-community/netinfo';
import RegistrationScreen from '../screens/RegistrationScreen';
import { setLogin, setUser, setRegister, setPersonalInfo } from '../reduxStore/userSlice';
import OtpVerification from '../screens/OtpVerification';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VectorIcon from '../utils/VectorIcon';
import PatientCaseList from '../screens/PatientCaseList';
import AiList from '../screens/AiList';
import VaccinationList from '../screens/VaccinationList';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Router = () => {

  const dispatch = useDispatch();

  const { isLoggedIn,isRegister } = useSelector(state => state.user)
  const [loading, setLoading] = useState(false)
  const [isInternet, setIsInternet] = useState(true)

  const isReload = async () => {
    setLoading(true)
    var isLogined = await AsyncStorage.getItem("IS_LOGIN")
    var isRegistering = await AsyncStorage.getItem("IS_REGISTER")
    var USER = await AsyncStorage.getItem("USER")
    var newData = await JSON.parse(USER)
    var personalData = await AsyncStorage.getItem("PERSONAL_INFO")
    personalData = JSON.parse(personalData)
    dispatch(setPersonalInfo(personalData))
    dispatch(setLogin(isLogined == "Yes" ? true : false))
    dispatch(setRegister(isRegistering == "Yes" ? true : false))
    dispatch(setUser(newData))
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }
  useEffect(() => {
    isReload()
  }, [isLoggedIn])

  // useEffect(() => {
  //   NetInfo.addEventListener((state) => {
  //     setIsInternet(state.isConnected)
  //   });
  // }, []);

  return (
    <>
      {
        isLoggedIn ?
          <StatusBar backgroundColor="#4B1AFF" barStyle="light-content" />
          :
          <StatusBar backgroundColor="#E6F4FE" barStyle="dark-content" />
      }
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={() => ({
            headerShown: false,
            
          })}>
          {

            !isInternet ?
              <Stack.Screen name="InternetConCheck" component={InternetConCheck} />
              :
              isLoggedIn ?
                (
                  <>
                    <Stack.Screen name="HomeScreen">
                      {() => (
                        <Tab.Navigator initialRouteName="Home"
                          screenOptions={() => ({
                            headerShown: false,
                            headerTintColor: '#fff',
                            headerStyle: {
                              backgroundColor: '#4B1AFF',
                              // borderBottomWidth: 1,
                              // borderBottomColor: '#dcdcdc',
                            },
                            tabBarActiveTintColor: '#4D1AFF',
                            tabBarInactiveTintColor: '#5a5a5a',
                            tabBarStyle: {
                              backgroundColor: '#fff',
                              height: 60,
                              paddingBottom: 10,
                              paddingTop: 5,
                              borderTopWidth: 1,
                              borderTopColor: '#dcdcdc',
                            }
                          })}
                        >
                          <Tab.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{
                              tabBarShowLabel: true,
                              tabBarLabelStyle: {
                                fontWeight: 'semibold',
                                fontSize: 12
                              },
                              tabBarIcon: ({ color }) => (
                                <VectorIcon
                                  type="AntDesign"
                                  name="home"
                                  color={color}
                                  size={26}
                                />
                              ),
                            }} />
                          <Tab.Screen
                            name="Report"
                            component={ReportScreen}
                            options={{
                              tabBarShowLabel: true,
                              tabBarLabelStyle: {
                                fontWeight: 'semibold',
                                fontSize: 12
                              },
                              tabBarIcon: ({ color }) => (
                                <VectorIcon
                                  type="Entypo"
                                  name="list"
                                  color={color}
                                  size={26}
                                />
                              ),
                            }} />
                          <Tab.Screen
                            name="Active Cases"
                            component={ActiveScreen}
                            options={{
                              tabBarShowLabel: true,
                              tabBarLabelStyle: {
                                fontWeight: 'semibold',
                                fontSize: 12
                              },
                              tabBarIcon: ({ color }) => (
                                <VectorIcon
                                  type="MaterialCommunityIcons"
                                  name="medical-bag"
                                  color={color}
                                  size={26}
                                />
                              ),
                            }} />
                          <Tab.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{
                              tabBarShowLabel: true,
                              tabBarLabelStyle: {
                                fontWeight: 'semibold',
                                fontSize: 12
                              },
                              tabBarIcon: ({ color }) => (
                                <VectorIcon
                                  type="Octicons"
                                  name="person"
                                  color={color}
                                  size={26}
                                />
                              ),
                            }} />
                        </Tab.Navigator>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="PatientCaseList" component={PatientCaseList} />
                    <Stack.Screen name="VaccinationList" component={VaccinationList} />
                    <Stack.Screen name="AiList" component={AiList} />
                  </>
                )
                : loading ?
                  (
                    <Stack.Screen name="Splash" component={SplashScreen} />
                  ) : isRegister ?
                    (
                      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
                    ) : (
                      <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="OtpVerification" component={OtpVerification} />
                      </>
                    )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Router;
