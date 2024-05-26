import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Header from '../components/Header';

const ReportScreen = ({ route }) => {

  const user = useSelector(state => state.user.userInfo)
  // console.log("useruser",user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <>
    <Header name="Reports" />
      <Text>ReportScreen</Text>
    </>
  );
};

const styles = StyleSheet.create({

})

export default ReportScreen;
