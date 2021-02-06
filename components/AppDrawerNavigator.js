import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import MyRecievedBooksScreen from '../screens/MyRecievedBooksScreen';
import {Icon} from 'react-native-elements'

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions: {
      drawerIcon: <Icon
      name = "home" type = "fontawesomefive"/>
    }
    },
  MyDonations : {
    screen : MyDonationScreen,
    navigationOptions: {
      drawerIcon: <Icon
      name = "gift" type = "font-awesome"/>,
      drawerLabel: "my donations"
    }
  },
  Notification : {
    screen : NotificationScreen,
    navigationOptions: {
      drawerIcon: <Icon
      name = "bell" type = "font-awesome"/>,
      drawerLabel: "notifications"
    }
  },
  MyReceivedBooks :{
    screen: MyRecievedBooksScreen,
    navigationOptions: {
      drawerIcon: <Icon
      name = "gift" type = "font-awesome"/>,
      drawerLabel: "my recieved books"
    }
  },
  Setting : {
    screen : SettingScreen,
    navigationOptions: {
      drawerIcon: <Icon
      name = "settings" type = "fontawesomefive"/>,
      drawerLabel: "settings"
    }
  }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })

