import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path
import { Card, ListItem } from 'react-native-elements'; // Using react-native-elements for Card and ListItem

// Define navigation prop type based on your MainTabNavigator
// This might come from @react-navigation/bottom-tabs if you have specific types for props
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/MainTabNavigator'; // Adjust path

type DashboardScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { logout, user, accessToken } = useAuth(); // Assuming user object might contain email or name

  const menuItems = [
    {
      title: 'Frequency Mapper',
      icon: 'map-marker-path', // Example react-native-vector-icons name (MaterialCommunityIcons)
      navigateTo: 'FrequencyMapper' as keyof MainTabParamList, // Type assertion
    },
    {
      title: 'Calibration Tool',
      icon: 'tune',  // Example icon name
      navigateTo: 'CalibrationTool' as keyof MainTabParamList,
    },
    {
      title: 'Oracle Guidance',
      icon: 'chat-question', // Example icon name
      navigateTo: 'Oracle' as keyof MainTabParamList,
    },
    {
      title: 'My Astrological Chart',
      icon: 'star-circle-outline', // Example icon name
      navigateTo: 'BaseChart' as keyof MainTabParamList,
    },
    // Add more items as needed, e.g., User Profile, Settings
  ];

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.userInfoCard}>
        <Card.Title style={styles.cardTitle}>User Information</Card.Title>
        <Card.Divider />
        {user ? (
          <Text style={styles.userInfoText}>Welcome, {user.email || 'User'}!</Text>
        ) : (
          <Text style={styles.userInfoText}>Welcome! (User details not fully loaded)</Text>
        )}
        {/* <Text style={styles.tokenText}>Token: {accessToken ? accessToken.substring(0, 30) + '...' : 'No Token'}</Text> */}
        <Button title="Logout" onPress={logout} buttonStyle={styles.logoutButton} />
      </Card>

      <Card containerStyle={styles.menuCard}>
        <Card.Title style={styles.cardTitle}>Tools & Features</Card.Title>
        <Card.Divider />
        {menuItems.map((item, index) => (
          <ListItem key={index} bottomDivider onPress={() => navigation.navigate(item.navigateTo)}>
            {/* <Icon name={item.icon} type="material-community" /> */}
            {/* Icons require react-native-vector-icons setup. For now, text only or simple RN Elements Icon */}
            {/* <ListItem.Chevron /> */}
            <ListItem.Content>
              <ListItem.Title style={styles.listItemTitle}>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light background color
  },
  userInfoCard: {
    margin: 15,
    borderRadius: 10,
  },
  menuCard: {
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  tokenText: {
    fontSize: 10,
    color: 'grey',
    marginBottom: 10,
    textAlign: 'center',
    wordBreak: 'break-all',
  },
  logoutButton: {
    backgroundColor: 'tomato',
    borderRadius: 8,
    marginTop: 10,
  },
  listItemTitle: {
    fontSize: 16,
    color: '#333',
  },
});

export default DashboardScreen;
