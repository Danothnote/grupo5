import React, { Component, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-datepicker';
import { Picker } from '@react-native-community/picker';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coleccion: 'Usuarios',
      email: '',
      password: '',
      nombreUsuario: '',
      tipoIdentificación: 'Cédula',
      identificación: '',
      fechaNacimiento: ''
    };
  }

  signupFunc = async () => {
    await auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        auth().currentUser.updateProfile({
          displayName: this.state.nombreUsuario
        })
        auth().currentUser.sendEmailVerification();
        console.log('Credenciales de usuario correctas!');
      })
      .then(this.addDatos)
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

  addDatos = async () => {
    await firestore()
      .collection(this.state.coleccion)
      .add({
        uid: auth().currentUser.uid,
        nombreUsuario: this.state.nombreUsuario,
        tipoIdentificación: this.state.tipoIdentificación,
        identificación: this.state.identificación,
        fechaNacimiento: this.state.fechaNacimiento
      })
      .then(() => {
        console.log('User added!');
      });
  }

  verificarDatos = () => {
    if (this.state.nombreUsuario == '' || this.state.email == '' || this.state.password == '' || this.state.identificación == '' || this.state.fechaNacimiento == '') {
      alert('Por Favor rellene todos los datos para continuar')
    } else {
      this.signupFunc();
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <StatusBar translucent backgroundColor='#ff5722' />
        <View style={styles.container}>
          <TextInput
            placeholder="Nombre de usuario"
            style={styles.input}
            keyboardType='default'
            textContentType='username'
            onChangeText={(nombreUsuario) => this.setState({ nombreUsuario })}
          />
          <TextInput
            placeholder="E-mail"
            style={styles.input}
            keyboardType='email-address'
            textContentType="emailAddress"
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            textContentType="password"
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry
          />
          <View style={{ borderBottomWidth: 1, marginHorizontal: 20 }}>
            <Picker
              selectedValue={this.state.tipoIdentificación}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ tipoIdentificación: itemValue })
              }>
              <Picker.Item label="Cédula" value="Cédula" />
              <Picker.Item label="Pasaporte" value="Pasaporte" />
            </Picker>
          </View>
          <TextInput
            placeholder="Identificación"
            style={styles.input}
            keyboardType='decimal-pad'
            onChangeText={(identificación) => this.setState({ identificación })}
          />
          <DatePicker
            style={{ ...styles.input, width: 310 }}
            date={this.state.fechaNacimiento}
            mode="date"
            placeholder="Fecha de Nacimiento"
            format="DD-MM-YYYY"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            customStyles={{
              dateIcon: {
                display: 'none'
              },
              dateInput: {
                borderWidth: 0
              }
            }}
            onDateChange={(fechaNacimiento) => this.setState({ fechaNacimiento: fechaNacimiento })}
          />
          <TouchableOpacity style={styles.boton} onPress={this.verificarDatos}>
            <Text style={styles.btnText}>Crear</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#ff5722',
    paddingTop: 100,
    paddingBottom: 60
  },
  container: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
  },
  input: {
    height: 50,
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 5,
    borderBottomWidth: 1
  },
  boton: {
    backgroundColor: '#ff5722',
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    elevation: 4,
    marginTop: 80
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }
});