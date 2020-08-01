import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Denuncia from '../Pantallas/denuncia';
import TodasDenuncias from '../Pantallas/todasDenuncias';

const DenunciasStack = createStackNavigator();

export default class AdminDenuncias extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <DenunciasStack.Navigator initialRouteName={'Denuncias'}>
                <DenunciasStack.Screen
                    name="Denuncias"
                    component={TodasDenuncias}
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