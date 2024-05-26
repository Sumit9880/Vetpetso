import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import NoticeCard from '../components/NoticeCard';
import { apiPost } from '../utils/api';
import VectorIcon from '../utils/VectorIcon';
import LinearGradient from 'react-native-linear-gradient';


const HomeScreen = () => {
  const user = useSelector(state => state.user.userInfo);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [memberCounts, setMemberCounts] = useState({});

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const resEvents = await apiPost("api/notice/get", {
        pageIndex: 1,
        sortKey: "ID",
        sortValue: "ASC",
        pageSize: 10
      });
      const resCounts = await apiPost("api/summary/getDashboardCount");
      const resMemberCounts = await apiPost("api/summary/getMemberWiseCount", {
        filter: " AND MEMBER_ID = " + user.ID
      });
      setEvents(resEvents.data);
      setCounts(resCounts.data);
      setMemberCounts(resMemberCounts.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <View style={styles.container}>
      <Header name="Home" />
      {isLoading ?
        <ActivityIndicator size="large" color="#4B1AFF" style={{ flex: 1 }} /> :
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={['#7c97f9', '#4B1AFF']} style={styles.greetingContainer}>
              <View>
                <Text style={styles.greetingText}>Welcome,</Text>
                <Text style={[styles.greetingText, { fontSize: 20 }]}>{user.NAME}</Text>
                <Text style={[styles.greetingText, { fontSize: 14, fontWeight: '400' }]}>Member ID : {user.MEMBER_REGISTRATION_NO}</Text>
                <View style={styles.greetingStat}>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.statsText, { fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }]}>{memberCounts?.ACTIVE?.toString().padStart(3, '0')}</Text>
                    <Text style={styles.statsText}>Active</Text>
                  </View>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.statsText, { fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }]}>{memberCounts?.CLOSED?.toString().padStart(3, '0')}</Text>
                    <Text style={styles.statsText}>Closed</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={require('../assets/stethoscope.png')}
                  style={{ width: 120, height: 120 }}
                />
              </View>
            </LinearGradient>
            <View >
              <View style={styles.noticeHeader}>
                <Text style={styles.noticeText}>Statistics : </Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.stats}>
                  <View style={styles.statCard}>
                    <Image
                      source={require('../assets/workgroup.png')}
                      style={{ width: 40, height: 40 }}
                    />
                    <View style={styles.stat}>
                      <Text style={[styles.statsText, { fontWeight: 'bold', fontSize: 20, color: '#3c65fc' }]}>{counts?.MEMBERS?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}> Members </Text>
                    </View>
                  </View>
                  <View style={styles.statCard}>
                    <Image
                      source={require('../assets/clipboard.png')}
                      style={{ width: 40, height: 40 }}
                    />
                    <View style={styles.stat}>
                      <Text style={[styles.statsText, { fontWeight: 'bold', fontSize: 20, color: '#3c65fc' }]}>{counts?.CASES?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>   Cases   </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.stats}>
                  <View style={styles.statCard}>
                    <Image
                      source={require('../assets/insemination1.png')}
                      style={{ width: 40, height: 40 }}
                    />
                    <View style={styles.stat}>
                      <Text style={[styles.statsText, { fontWeight: 'bold', fontSize: 20, color: '#ff0c6c' }]}>{counts?.AI?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Inseminations</Text>
                    </View>
                  </View>
                  <View style={styles.statCard}>
                    <Image
                      source={require('../assets/immunization.png')}
                      style={{ width: 40, height: 40 }}
                    />
                    <View style={styles.stat}>
                      <Text style={[styles.statsText, { fontWeight: 'bold', fontSize: 20, color: '#ff0c6c' }]}>{counts?.VACCINATIONS?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Vaccinations</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.noticeContainer}>
              <View style={[styles.noticeHeader, { marginBottom: 0 }]}>
                <Text style={styles.noticeText}>Notice</Text>
                <VectorIcon
                  name="arrowright"
                  type="AntDesign"
                  size={24}
                  color="#000"
                  onPress={() => navigation.navigate('Notice')}
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.noticeBar}>
                  {events.map(event => (
                    <NoticeCard key={event.ID} data={event} />
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  greetingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    width: '77%',
    height: 80,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  greetingText: {
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
    fontFamily: 'Poppins-SemiBold',
  },
  statsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#000',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '40%',
    height: 80,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#4B1AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    gap: 10,
    marginBottom: 10,
    marginLeft: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    height: '30%',
    backgroundColor: '#7c97f9',
    padding: 20,
    marginTop: 35,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    // paddingHorizontal: 20,
  },
  noticeContainer: {
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  noticeBar: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default HomeScreen;
