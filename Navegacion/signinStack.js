import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Perfil from '../Pantallas/perfil';
import DenunciasStackScreen from './denunciasStack';

const Tab = createBottomTabNavigator();

export default class SigninStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    tabBarOptions={{
                        activeTintColor: "#517fa4",
                        pressColor: "#517fa4",
                        labelStyle: {
                            fontSize: 15,
                            textAlign: "center",
                            marginBottom: 10,
                        },
                        style: {
                            height: 70
                        }
                    }}
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === 'Perfil') {
                                iconName = focused
                                    ? 'person'
                                    : 'person-outline';
                            } else if (route.name === 'Mis Denuncias') {
                                iconName = focused ? 'flag' : 'flag-outline';
                            }
                            // You can return any component that you like here!
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                    })}>
                    <Tab.Screen
                        name="Mis Denuncias"
                        component={DenunciasStackScreen}
                        options={({ route }) => ({
                            headerShown: false
                        })}
                    />
                    <Tab.Screen
                        name="Perfil"
                        component={Perfil}
                        options={({ route }) => ({
                            headerShown: false
                        })}
                    />
                </Tab.Navigator>
            </NavigationContainer >
        );
    }
}
