import React from 'react';
import {Image,} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import BookDonateScreen from '../screens/BookDonateScreen';
import BookRequestScreen from '../screens/BookRequestScreen';
import {AppStackNavigator} from './AppStackNavigator';

export const AppTabNavigator = createBottomTabNavigator({
    DonateBooks: {
        screen: BookDonateScreen,
        navigationOptions: {
            tabBarIcon: <Image source = {require("../assets/request-list.png")}
                                styles = {{width: 20, height: 20}}/>,
            tabBarLabel: "Donate Books"
        }
    },
    BookRequest: {
        screen: BookRequestScreen,
        navigationOptions: {
            tabBarIcon: <Image source = {require("../assets/request-book.png")}
                                styles = {{width: 20, height: 20}}/>,
            tabBarLabel: "Book Request"
        }
    }
})