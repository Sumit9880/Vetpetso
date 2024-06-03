import { StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { apiPost } from '../utils/api';
import Loader from '../components/Loader';

const ReportScreen = () => {

  const user = useSelector(state => state.user.userInfo);
  const navigation = useNavigation();

  let buttons = [
    { title: 'All Time', value: 'all' },
    { title: 'Today', value: 'today' },
    { title: 'Yesterday', value: 'yesterday' },
    { title: 'Current Week', value: 'week' },
    { title: 'Last Week', value: 'lastWeek' },
    { title: 'Current Month', value: 'month' },
    { title: 'Last Month', value: 'lastMonth' },
    { title: 'Current Year', value: 'year' },
    { title: 'Last Year', value: 'lastYear' },
  ];
  const [memberCounts, setMemberCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryFilter, setSummaryFilter] = useState({
    period: 'all',
    filter: ''
  });

  function getDateRange(period) {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];
    let startDate, endDate, filter;
    switch (period) {
      case 'today':
        startDate = new Date();
        filter = ` AND DATE(REGISTRATION_DATE) = '${formatDate(startDate)}'`;
        break;
      case 'yesterday':
        endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        filter = ` AND DATE(REGISTRATION_DATE) = '${formatDate(endDate)}'`;
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - today.getDay()));
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        filter = ` AND DATE(REGISTRATION_DATE) BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`;
        break;
      case 'lastWeek':
        startDate = new Date(today.setDate(today.getDate() - today.getDay() - 7));
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        filter = ` AND DATE(REGISTRATION_DATE) BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`;
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filter = ` AND DATE(REGISTRATION_DATE) BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`;
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        filter = ` AND DATE(REGISTRATION_DATE) BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`;
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        filter = ` AND DATE(REGISTRATION_DATE) BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`;
        break;
      case 'lastYear':
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        filter = ` AND DATE(REGISTRATION_DATE) BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`;
        break;
      default:
        filter = '';
    }
    setSummaryFilter({ period: period, filter: filter });
  }

  const FilterButton = ({ title, value }) => {
    return (
      <TouchableOpacity
        onPress={() => getDateRange(value)}
        style={{
          padding: 8,
          backgroundColor: summaryFilter.period === value ? "#4B1AFF" : "#fff",
          borderRadius: 10,
          marginRight: 10,
          borderColor: "#4B1AFF",
          borderWidth: 1,
        }}
      >
        <Text style={{ color: summaryFilter.period === value ? "#fff" : "#000" }}>{title}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getData();
  }, [summaryFilter]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const resMemberCounts = await apiPost("api/summary/getTypeWiseCount", {
        filter: `${summaryFilter.filter} AND MEMBER_ID = ${user.ID} GROUP BY CASE_TYPE ORDER BY CASE_TYPE`
      });
      setMemberCounts(resMemberCounts.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header name="Reports" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.summary, { marginTop: 15 }]}>
            <Text style={{ fontSize: 20, color: "#4a4a4a", fontFamily: "Poppins-Bold", fontWeight: "bold" }}>Type Wise Summary Report</Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 10, marginTop: 10 }}>
              <Text style={{ fontWeight: '600', color: "#000", fontSize: 14 }}>Filter : </Text>
              <FlatList
                data={buttons}
                renderItem={({ item }) => (
                  <FilterButton title={item.title} value={item.value} />
                )}
                keyExtractor={item => item.value}
                horizontal
                contentContainerStyle={{ paddingTop: 5 }}
                showsHorizontalScrollIndicator={false}
                onEndReachedThreshold={0.1}
              />
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={{ fontSize: 18, color: "#4B1AFF", fontWeight: '600' }}>Active : </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, gap: 10 }}>
                {
                  memberCounts.map((item, index) => (
                    <View key={index} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#5e81ff', textAlign: 'center' }}>{item.ACTIVE?.toString().padStart(3, '0')}</Text>
                      <Text style={{ fontSize: 13, color: '#160163', fontWeight: '600', marginTop: 2, textAlign: 'center' }}>{item.CASE_TYPE == 1 ? "Patient Case" : item.CASE_TYPE == 2 ? "Insemination" : "Vaccination"}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={{ fontSize: 18, color: "#4B1AFF", fontWeight: '600' }}>Closed : </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, gap: 10 }}>
                {
                  memberCounts.map((item, index) => (
                    <View key={index} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#ff2179', textAlign: 'center' }}>{item.CLOSED?.toString().padStart(3, '0')}</Text>
                      <Text style={{ fontSize: 13, color: '#160163', fontWeight: '600', marginTop: 2, textAlign: 'center' }}>{item.CASE_TYPE == 1 ? "Patient Case" : item.CASE_TYPE == 2 ? "Insemination" : "Vaccination"}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.summary}
            onPress={() => navigation.navigate("CaseReport")}
          >
            <Text style={{ fontSize: 19, color: "#4a4a4a", fontFamily: "Poppins-Bold", fontWeight: "bold", paddingVertical: 30 }}>Patient Case Detailed Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.summary}
            onPress={() => navigation.navigate("AiReport")}
          >
            <Text style={{ fontSize: 19, color: "#4a4a4a", fontFamily: "Poppins-Bold", fontWeight: "bold", paddingVertical: 30 }}>Artificial Insemination Detailed Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.summary}
            onPress={() => navigation.navigate("VaccinationReport")}
          >
            <Text style={{ fontSize: 19, color: "#4a4a4a", fontFamily: "Poppins-Bold", fontWeight: "bold", paddingVertical: 30 }}>Vaccination Detailed Report</Text>
          </TouchableOpacity>
        </ScrollView>
        <Loader isLoading={isLoading} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  summary: {
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    flex: 1,
    backgroundColor: "#d9ceff",
    borderRadius: 10,
    shadowColor: "#4B1AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})

export default ReportScreen;
