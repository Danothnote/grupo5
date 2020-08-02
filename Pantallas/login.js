import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    loginFunc = async () => {
        await auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                console.log('Credenciales de usuario correctas!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('Ese correo ya existe, por favor intentar con otro');
                }
                if (error.code === 'auth/invalid-email') {
                    alert('Dirección de correo inválida');
                }
                if (error.code === 'auth/wrong-password') {
                    alert('Contraseña Incorrecta');
                }
                if (error.code === 'auth/user-not-found') {
                    alert('El usuario no existe');
                }
            });
    }

    verificarDatos = () => {
        if (this.state.email == '' || this.state.password == '') {
            alert('Por Favor rellene todos los datos para continuar')
        } else {
            this.loginFunc();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <StatusBar translucent backgroundColor='white' barStyle='dark-content' />
                    <View style={styles.sec1}>
                        <View style={styles.logo}>
                            <Text style={styles.txtLogo}>Grupo 5</Text>
                        </View>
                        <Text style={styles.titulo}>Bienvenido</Text>
                    </View>
                    <View style={styles.sec2}>
                        <TextInput
                            placeholder="E-mail"
                            style={styles.input}
                            placeholderTextColor='black'
                            keyboardType='email-address'
                            textContentType="emailAddress"
                            onChangeText={(email) => this.setState({ email })}
                        />
                        <TextInput
                            placeholder="Contrseña"
                            style={styles.input}
                            placeholderTextColor='black'
                            textContentType="password"
                            onChangeText={(password) => this.setState({ password })}
                            secureTextEntry
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.boton1} onPress={this.verificarDatos}>
                            <Text style={styles.btn1Texto}>Iniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boton2} onPress={() => this.props.navigation.navigate('Signup')}>
                            <Text style={styles.btn2Texto}>Crear Usuario</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scroll: {
        flexGrow: 1,
        paddingVertical: 60,
        paddingBottom: 100,
        justifyContent: "space-between"
    },
    sec1: {
        paddingTop: 40,
        alignItems: 'center'
    },
    sec2: {
        justifyContent: 'flex-end',
        paddingVertical: 80
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#ff5722',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtLogo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white'
    },
    titulo: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    input: {
        height: 50,
        marginHorizontal: 20,
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
        backgroundColor: 'white',
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
    }
});