import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class Denuncias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            did: '',
            nombreUsuario: '',
            docs: [],
            denuncias: []
        };
    }

    componentDidMount = () => {
        this.obtenerDatos();
    }

    obtenerDatos = async () => {
        let i = 0;
        this.setState({ denuncias: [] })
        await firestore()
            .collection('Denuncias')
            .where('uid', '==', auth().currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    let uid = doc.data().uid
                    await firestore()
                        .collection('Usuarios')
                        .where('uid', '==', auth().currentUser.uid)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                if (uid == doc.data().uid) {
                                    let nombre = doc.data().nombreUsuario
                                    this.setState({ nombreUsuario: nombre })
                                }
                            });
                        });
                    let Título = doc.data().Título
                    let Descripción = doc.data().Descripción
                    let nombreUsuario = this.state.nombreUsuario
                    let did = doc.id
                    i++;
                    if (i == 1) {
                        this.setState({
                            denuncias: [{
                                uid: uid,
                                did: did,
                                Título: Título,
                                Descripción: Descripción,
                                nombreUsuario: nombreUsuario
                            }]
                        });
                    } else {
                        this.setState({
                            docs: {
                                uid: uid,
                                did: did,
                                Título: Título,
                                Descripción: Descripción,
                                nombreUsuario: nombreUsuario
                            }
                        });
                        this.setState(state => {
                            state.denuncias.push(this.state.docs);
                        })
                    }
                });
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor='white' barStyle='dark-content' />
                <View style={styles.top}>
                    <Text style={styles.titulo}>Mis Denuncias</Text>
                    <TouchableOpacity onPress={() => {
                        this.obtenerDatos();
                    }}>
                        <Icon
                            name='refresh-circle'
                            type='ionicon'
                            size={30}
                            color='#ff5722'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnNuevo} onPress={() => this.props.navigation.navigate('Reportar')}>
                        <Text style={styles.btnTxtNuevo}>Nueva Denuncia</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={this.state.denuncias.sort((a, b) => a.Título.localeCompare(b.Título))}
                    renderItem={({ item }) =>
                        (<TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Denuncia', { did: item.did })}>
                            <View style={styles.icono}>
                                <Icon
                                    name='pricetags'
                                    type='ionicon'
                                    color='#517fa4'
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.itemTitulo}>{item.Título}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon
                                            name="supervisor-account"
                                            type='material'
                                            size={18}
                                            color='rgb(150,150,150)'
                                        />
                                        <Text style={styles.itemUsuario}>{item.nombreUsuario}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.itemTxt}>{item.Descripción}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>)
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
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
        justifyContent: 'space-between',
    },
    btnNuevo: {
        backgroundColor: '#ff5722',
        height: 40,
        width: 130,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        elevation: 4
    },
    btnTxtNuevo: {
        fontSize: 15,
        color: 'white',
        fontWeight: "bold"
    },
    titulo: {
        fontSize: 25,
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 10
    },
    icono: {
        paddingTop: 5,
        paddingHorizontal: 10,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 20,
        elevation: 5
    },
    itemTitulo: {
        width: 200,
        fontSize: 20,
        fontWeight: 'bold'
    },
    itemUsuario: {
        width: 75,
        fontSize: 12,
        marginLeft: 5,
        marginRight: 10
    },
    itemTxt: {
        fontSize: 15,
        marginVertical: 10
    },
});