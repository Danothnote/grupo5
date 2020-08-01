import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Reportar from '../Pantallas/reportar';
import Denuncias from '../Pantallas/denuncias';
import Denuncia from '../Pantallas/denuncia';

const DenunciasStack = createStackNavigator();

export default class DenunciasStackScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <DenunciasStack.Navigator initialRouteName={'Denuncias'}>
                <DenunciasStack.Screen
                    name="Reportar"
                    component={Reportar}
                    options={({ route }) => ({
                        headerShown: false
                    })}
                />
                <DenunciasStack.Screen
                    name="Denuncias"
                    component={Denuncias}
                    options={({ route }) => ({
                        headerShown: false
                    })}
                />
                <DenunciasStack.Screen
                    name="Denuncia"
                    component={Denuncia}
                    options={({ route }) => ({
                        headerShown: false
                    })}
                />
            </DenunciasStack.Navigator>
        );
    }
}