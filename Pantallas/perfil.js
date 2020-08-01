import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TextInput, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const windowHeight = (Dimensions.get('window').height) / 1.5;

export default class Perfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coleccion: 'Usuarios',
            documento: '',
            email: '',
            nombreUsuario: '',
            tipoIdentificación: '',
            identificación: '',
            fechaNacimiento: '',
            uid: ''
        };
    }

    componentDidMount = () => {
        this.obtenerDatos();
    }

    obtenerDatos = () => {
        this.setState({ uid: auth().currentUser.uid })
        this.setState({ email: auth().currentUser.email })
        this.setState({ nombreUsuario: auth().currentUser.displayName })
        firestore()
            .collection(this.state.coleccion)
            .where('uid', '==', auth().currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.setState({ documento: doc.id })
                    this.setState({ tipoIdentificación: doc.data().tipoIdentificación })
                    this.setState({ identificación: doc.data().identificación })
                    this.setState({ fechaNacimiento: doc.data().fechaNacimiento })
                });
            });
    }

    modificar = async () => {
        await firestore()
            .collection(this.state.coleccion)
            .doc(this.state.documento)
            .update({
                nombreUsuario: this.state.nombreUsuario,
                tipoIdentificación: this.state.tipoIdentificación,
                identificación: this.state.identificación,
                fechaNacimiento: this.state.fechaNacimiento
            })
            .then(() => {
                auth().currentUser.updateProfile({
                    displayName: this.state.nombreUsuario
                })
                ToastAndroid.showWithGravityAndOffset(
                    'Datos modificados satisfactoriamente',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                this.props.navigation.navigate('Denuncias')
                console.log('Datos Actualizados')
            })
    }

    verificarDatos = () => {
        if (this.state.nombreUsuario == '' || this.state.tipoIdentificación == '' || this.state.identificación == '' || this.state.fechaNacimiento == '') {
            alert('Por Favor no deje datos en blanco')
        } else {
            this.modificar();
        }
    }

    logOut = async () => {
        try {
            await auth().signOut()
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor='white' barStyle='dark-content' />
                <View style={styles.top}>
                    <Text style={styles.titulo}>Mi Perfil</Text>
                    <TouchableOpacity style={styles.btnCerrar} onPress={this.logOut}>
                        <Text style={{ ...styles.btn1Texto, fontSize: 15 }}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <TextInput
                        placeholder="Modifica tu Nombre de Usuario"
                        style={styles.input}
                        value={this.state.nombreUsuario}
                        keyboardType='default'
                        textContentType='username'
                        onChangeText={(nombreUsuario) => this.setState({ nombreUsuario })}
                    />
                    <View style={{ borderBottomWidth: 1, marginHorizontal: 40 }}>
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
                        placeholder="Modifica tu Número de Identificación"
                        style={styles.input}
                        value={this.state.identificación}
                        keyboardType='default'
                        textContentType='username'
                        onChangeText={(identificación) => this.setState({ identificación })}
                    />
                    <DatePicker
                        style={{ ...styles.input, width: 310 }}
                        date={this.state.fechaNacimiento}
                        mode="date"
                        value={this.state.fechaNacimiento}
                        placeholder="Modifica tu Fecha de Nacimiento"
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
                </ScrollView>
                <View>
                    <TouchableOpacity style={styles.boton1} onPress={this.verificarDatos}>
                        <Text style={styles.btn1Texto}>Modificar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boton2} onPress={() => this.props.navigation.navigate('Denuncias')}>
                        <Text style={styles.btn2Texto}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    scroll: {
        flexGrow: 1,
        height: windowHeight,
        justifyContent: 'space-around',
        paddingVertical: 80
    },
    titulo: {
        fontSize: 25,
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 10
    },
    input: {
        height: 50,
        marginHorizontal: 40,
        paddingLeft: 10,
        marginVertical: 5,
        borderBottomWidth: 1
    },
    boton1: {
        backgroundColor: '#ff5722',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        elevation: 4
    },
    boton2: {
        height: 70,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    btn1Texto: {
        fontSize: 20,
        color: 'white',
        fontWeight: "bold"
    },
    btn2Texto: {
        fontSize: 20,
        color: 'black',
        fontWeight: "bold"
    },
    btnCerrar: {
        backgroundColor: '#ff5722',
        height: 40,
        width: 120,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        elevation: 4
    }
});