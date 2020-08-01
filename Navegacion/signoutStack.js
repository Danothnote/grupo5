import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Pantallas/login';
import Signup from '../Pantallas/signup';

const Stack = createStackNavigator();

export default class SignoutStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={({ route }) => ({
              headerShown:false
            })}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={({ route }) => ({
              title: 'Nuevo Usuario',
              headerTransparent: true,
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontSize: 25
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer >
    );
  }
}
