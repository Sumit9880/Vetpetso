import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, BackHandler } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setStatusBar } from '../reduxStore/userSlice';
const PolicyScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    handleBackButtonPress;
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
    };
  }, []);

  const handleBackButtonPress = () => {
    navigation.goBack();
    dispatch(setStatusBar({ backgroundColor: "#4B1AFF", barStyle: "light-content" }))
    return true;
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Privacy Policy</Text>

        <Text style={styles.subHeader}>Introduction</Text>
        <Text style={styles.text}>
          Welcome to Vetpetso, by पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
        </Text>

        <Text style={styles.subHeader}>Information We Collect</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Personal Information: When you register for a subscription, we collect personal information such as your name, email address, payment information, and veterinary license details.</Text>
          <Text style={styles.listItem}>- Case Data: Information regarding the cases you manage, including patient details, diagnosis, treatment, and reports.</Text>
          <Text style={styles.listItem}>- Usage Data: Information on how you use the app, including access times, pages viewed, and the actions taken within the app.</Text>
        </View>

        <Text style={styles.subHeader}>How We Use Your Information</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- To Provide Services: We use your personal and case data to offer our subscription services, including case management, report generation, and data export.</Text>
          <Text style={styles.listItem}>- To Improve Our Services: We analyze usage data to understand how our app is used and to enhance its functionality and user experience.</Text>
          <Text style={styles.listItem}>- To Communicate with You: We may use your contact information to send you updates, support messages, and other information related to your subscription.</Text>
          <Text style={styles.listItem}>- To Ensure Data Security: Your data is stored in a secure MySQL database on a VPS, and we implement strict security measures to protect it from unauthorized access or disclosure.</Text>
        </View>

        <Text style={styles.subHeader}>Data Sharing and Disclosure</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Third-Party Service Providers: We may share your data with third-party service providers who perform services on our behalf, such as payment processing and data storage.</Text>
          <Text style={styles.listItem}>- Legal Compliance: We may disclose your information if required by law or in response to legal requests.</Text>
        </View>

        <Text style={styles.subHeader}>Data Security</Text>
        <Text style={styles.text}>
          We prioritize the security of your data and employ various measures, including encryption, firewalls, and secure server facilities, to protect it. Regular audits and security updates are conducted to ensure the safety of your information.
        </Text>

        <Text style={styles.subHeader}>Your Rights</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Access and Update: You can access your personal information within the app settings. However, updates and deletions of data are not permitted as the records are maintained for governmental proof and compliance purposes.</Text>
        </View>

        <Text style={styles.subHeader}>Changes to this Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our app and informing you via email.
        </Text>

        <Text style={styles.subHeader}>Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy or our data practices, please contact us at sumitghatage4@gmail.com or +91 8618749880.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.header}>Terms of Use</Text>

        <Text style={styles.subHeader}>Introduction</Text>
        <Text style={styles.text}>
          These Terms of Use ("Terms") govern your access to and use of Vetpetso, by पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. By using our app, you agree to comply with these Terms.
        </Text>

        <Text style={styles.subHeader}>Subscription Plans</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Paid Membership: Our app offers two subscription plans for veterinary professionals who are members of पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. The details of each plan, including features and pricing, are available on our subscription page.</Text>
          <Text style={styles.listItem}>- Payment: Subscription fees are billed on a monthly or annual basis, depending on the chosen plan. Payment is processed securely via our third-party payment provider.</Text>
        </View>

        <Text style={styles.subHeader}>User Responsibilities</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Account Security: You are responsible for maintaining the confidentiality of your account information, including your username and password.</Text>
          <Text style={styles.listItem}>- Accurate Information: You must provide accurate and complete information when registering for a subscription and using the app.</Text>
          <Text style={styles.listItem}>- Compliance: You agree to use the app in compliance with all applicable laws and regulations.</Text>
        </View>

        <Text style={styles.subHeader}>Use of the App</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Case Management: Our app allows you to record, categorize, and save case information, generate reports, share prescriptions and case papers in PDF format, and export reports in Excel sheets.</Text>
          <Text style={styles.listItem}>- Data Storage: All data is stored in a secure MySQL database on a VPS managed by पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. We take reasonable measures to ensure the security of your data.</Text>
        </View>

        <Text style={styles.subHeader}>Prohibited Activities</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Unauthorized Access: You must not attempt to gain unauthorized access to any part of the app or its underlying systems.</Text>
          <Text style={styles.listItem}>- Malicious Activity: You must not use the app to engage in any activity that is harmful, unlawful, or violates the rights of others.</Text>
        </View>

        <Text style={styles.subHeader}>Termination</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Termination by You: You may cancel your subscription at any time through the app settings.</Text>
          <Text style={styles.listItem}>- Termination by Us: We reserve the right to terminate your access to the app if you violate these Terms or engage in any prohibited activity.</Text>
        </View>

        <Text style={styles.subHeader}>Limitation of Liability</Text>
        <Text style={styles.text}>
          To the maximum extent permitted by law, Vetpetso and पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the app.
        </Text>

        <Text style={styles.subHeader}>Changes to these Terms</Text>
        <Text style={styles.text}>
          We may update these Terms from time to time. We will notify you of any significant changes by posting the new terms on our app and informing you via email.
        </Text>

        <Text style={styles.subHeader}>Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about these Terms of Use, please contact us at sumitghatage4@gmail.com or +91 8618749880.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4FE',
  },
  card: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#4B1AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B1AFF',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#444',
  },
  text: {
    fontSize: 13,
    lineHeight: 22,
    color: '#555',
  },
  list: {
    marginLeft: 10,
    marginTop: 5,
  },
  listItem: {
    fontSize: 13,
    lineHeight: 22,
    color: '#555',
    marginBottom: 5,
  },
});

export default PolicyScreen;
