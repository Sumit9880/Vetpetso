import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ActiveScreen from '../screens/ActiveScreen';
import ReportScreen from '../screens/ReportScreen';
import LoginScreen from '../screens/LoginScreen';
import { useSelector } from 'react-redux';
import RegistrationScreen from '../screens/RegistrationScreen';
import OtpVerification from '../screens/OtpVerification';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VectorIcon from '../utils/VectorIcon';
import PatientCaseList from '../screens/PatientCaseList';
import AiList from '../screens/AiList';
import VaccinationList from '../screens/VaccinationList';
import SplashScreen from '../screens/SplashScreen';
import VaccinationFormModal from '../components/VaccinationFormModal';
import AIFormModal from '../components/AIFormModal';
import CaseFormModal from '../components/CaseFormModal';
import ForgotPass from '../screens/ForgotPass';

const AppRouter = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  return (
    <>
      <StatusBar backgroundColor="#4B1AFF" barStyle="light-content" />
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS
        })}>
        <Stack.Screen name="HomeScreen">
          {() => (
            <Tab.Navigator initialRouteName="Home"
              screenOptions={() => ({
                headerShown: false,
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#4B1AFF',
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
                      name="briefcase-plus-outline"
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
        <Stack.Screen name="VaccinationFormModal" component={VaccinationFormModal} />
        <Stack.Screen name="AIFormModal" component={AIFormModal} />
        <Stack.Screen name="CaseFormModal" component={CaseFormModal} />
      </Stack.Navigator>
    </>
  )
}

const LoginRoute = () => {
  const Stack2 = createStackNavigator();
  const { loginInfo } = useSelector(state => state.user);
  return (
    <>
      <StatusBar backgroundColor="#E6F4FE" barStyle="dark-content" />
      <Stack2.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}>
        {
          loginInfo?.IS_REGISTER ?
            <Stack2.Screen name="RegistrationScreen" component={RegistrationScreen} />
            :
            <>
              <Stack2.Screen name="Login" component={LoginScreen} />
              <Stack2.Screen name="OtpVerification" component={OtpVerification} />
              <Stack2.Screen name="ForgotPass" component={ForgotPass} />
            </>
        }
      </Stack2.Navigator>
    </>
  )
}

const Router = () => {
  const { splashscreen, loginInfo } = useSelector(state => state.user);
  if (splashscreen) {
    return <SplashScreen />
  } else {
    return (
      <NavigationContainer>
        {loginInfo?.UserId ? <AppRouter /> : <LoginRoute />}
      </NavigationContainer>
    )
  }
}

export default Router;
