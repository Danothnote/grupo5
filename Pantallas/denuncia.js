import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default class Denuncia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coleccion: 'Denuncias',
            did: '',
            Título: '',
            Descripción: '',
            Imágen: '',
            urlImágen: require('../assets/img/Cargando.png'),
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.0009,
            longitudeDelta: 0.001,
        };
    }

    componentDidMount = () => { this.obtenerDatos(); }

    obtenerUrl = async (img) => {
        url = await storage()
            .ref(img)
            .getDownloadURL();
        this.setState({ urlImágen: { uri: url } })
    }

    obtenerDatos = () => {
        const { did } = this.props.route.params;
        const Documento = did;
        firestore()
            .collection(this.state.coleccion)
            .doc(Documento)
            .get()
            .then(documentSnapshot => {
                this.setState({ Título: documentSnapshot.data().Título })
                this.setState({ Descripción: documentSnapshot.data().Descripción })
                this.setState({ Imágen: documentSnapshot.data().Imágen })
                this.setState({ latitude: documentSnapshot.data().latitude })
                this.setState({ longitude: documentSnapshot.data().longitude })
                this.obtenerUrl(this.state.Imágen);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}> {this.state.Título} </Text>
                <ScrollView>
                    <View style={styles.item}>
                        <View style={styles.icono}>
                            <Icon
                                name='pricetags'
                                type='ionicon'
                                color='white'
                            />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.itemTitulo}>Descripción</Text>
                            </View>
                            <View>
                                <Text style={styles.itemTxt}>{this.state.Descripción}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.itemImg}>
                        <Image source={this.state.urlImágen} style={styles.imagen} />
                    </View>
                    <View style={{ ...styles.itemMap, height: 300 }}>
                        <Text style={styles.mapTitulo}>Ubicación</Text>
                        <MapView
                            style={styles.map}
                            region={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: this.state.latitudeDelta,
                                longitudeDelta: this.state.longitudeDelta
                            }}
                        >
                            <Marker
                                ref={marker => { this.marker = marker }}
                                title={'Denuncia'}
                                coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}

                            />
                        </MapView>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
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
        backgroundColor: '#ff5722',
        paddingVertical: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 20,
        elevation: 5
    },
    itemMap: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 20,
        elevation: 5
    },
    itemImg: {
        height: 300,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 20,
        elevation: 5
    },
    mapTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    itemTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    itemUsuario: {
        fontSize: 12,
        marginLeft: 5
    },
    itemTxt: {
        fontSize: 15,
        marginVertical: 10,
        color: 'white'
    },
    imagen: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'contain',
        justifyContent: "center",
        alignItems: "center"
    },
    map: {
        width: 320,
        height: 230,
        marginTop: 10
    },
});
