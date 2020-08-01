import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

export default class TodasDenuncias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            did: '',
            nombreUsuario: '',
            docs: {},
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
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    let uid = doc.data().uid
                    await firestore()
                        .collection('Usuarios')
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
                    <Text style={styles.titulo}>Denuncias</Text>
                    <TouchableOpacity onPress={this.obtenerDatos} style={styles.btnNuevo}>
                        <Icon
                            name='refresh-circle'
                            type='ionicon'
                            size={30}
                            color='white'
                        />
                        <Text style={styles.btnTxtNuevo}>Recargar</Text>
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
        flexDirection: 'row',
        backgroundColor: '#ff5722',
        height: 40,
        width: 110,
        marginHorizontal: 20,
        paddingHorizontal: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 5,
        elevation: 4
    },
    btnTxtNuevo: {
        fontSize: 15,
        marginRight: 5,
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