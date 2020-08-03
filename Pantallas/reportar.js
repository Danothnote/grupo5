import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, ScrollView, Image, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';

export default class Reportar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coleccion: 'Denuncias',
            uid: '',
            Título: '',
            Descripción: '',
            Imágen: '',
            nombreImágen: '',
            nombreUsuario: '',
            latitude: 0,
            longitude: 0,
            latitudMarker: null,
            longitudMarker: null,
            latitudeDelta: 0.0009,
            longitudeDelta: 0.001,
            imagePickerOptions: {
                noData: true,
            }
        };
    }

    componentDidMount() {
        this.permisosUbicación();
    }

    permisosUbicación = async () => {
        var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('Permisos: ' + response);

        if (response === 'granted') {
            this.posiciónActual();
        }
    }

    posiciónActual = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(JSON.stringify(position));
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudMarker: position.coords.latitude,
                    longitudMarker: position.coords.longitude
                })
            }
        )
        ToastAndroid.showWithGravityAndOffset(
            "Mantenga presionado el Marcador para cambiar su posición",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    }

    log = (eventName, e) => {
        this.setState({ longitudMarker: e.nativeEvent.coordinate.longitude })
        this.setState({ latitudMarker: e.nativeEvent.coordinate.latitude })
    }

    camara = () => {
        ImagePicker.launchCamera(this.state.imagePickerOptions, response => {
            if (response.didCancel) {
                alert('Post canceled');
            } else if (response.error) {
                alert('An error occurred: ', response.error);
            } else {
                this.setState({ Imágen: response.path });
                this.setState({ nombreImágen: response.fileName });
            }
        }
        );
    }

    galeria = () => {
        ImagePicker.launchImageLibrary(this.state.imagePickerOptions, response => {
            if (response.didCancel) {
                alert('Post canceled');
            } else if (response.error) {
                alert('An error occurred: ', response.error);
            } else {
                const data = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({ Imágen: response.path });
                this.setState({ nombreImágen: response.fileName });
            }
        }
        );
    }

    addImagen = async () => {
        const pathToFile = this.state.Imágen
        const reference = storage().ref(this.state.nombreImágen);
        await reference.putFile(pathToFile);
    }

    addDenuncia = async () => {
        await firestore()
            .collection(this.state.coleccion)
            .add({
                uid: auth().currentUser.uid,
                Título: this.state.Título,
                Descripción: this.state.Descripción,
                latitude: this.state.latitudMarker,
                longitude: this.state.longitudMarker,
                Imágen: this.state.nombreImágen
            })
            .then(() => {
                this.addImagen();
                ToastAndroid.showWithGravityAndOffset(
                    'Denuncia Añadida!',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                console.log('Denuncia Añadida!');
                this.props.navigation.navigate('Denuncias')
            });
    }

    verificarDatos = () => {
        if (this.state.Título == '' || this.state.Descripción == '' || this.state.latitude == '' || this.state.longitude == '' || this.state.Imágen == '') {
            alert('Por Favor rellene todos los datos para continuar')
        } else {
            this.addDenuncia();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor='white' barStyle='dark-content' />
                <View style={styles.top}>
                    <Text style={styles.titulo}>Nueva Denuncia</Text>
                    <TouchableOpacity style={styles.btnNuevo} onPress={() => this.props.navigation.navigate('Denuncias')}>
                        <Text style={styles.btnTxtNuevo}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={{ ...styles.items, height: 150, flexDirection: 'row' }}>
                        <View>
                            <Text style={styles.itemsTxt}>Subir Imágen</Text>
                            <TouchableOpacity style={styles.btnImagen} onPress={this.camara}>
                                <Text style={styles.itemsTxt}>Tomar Foto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnImagen} onPress={this.galeria}>
                                <Text style={styles.itemsTxt}>Abrir Galería</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewImagen}>
                            <Image source={{ uri: 'file://' + this.state.Imágen }} style={styles.imagen} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.items}>
                        <Text style={styles.itemsTxt}>Título</Text>
                        <TextInput
                            placeholder='Escribe aquí el título'
                            style={styles.input}
                            onChangeText={(Título) => this.setState({ Título })}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.items, height: 150 }}>
                        <Text style={styles.itemsTxt}>Descripción</Text>
                        <TextInput
                            placeholder='Escribe aquí la descripción'
                            style={styles.input}
                            multiline
                            onChangeText={(Descripción) => this.setState({ Descripción })}
                        />
                    </TouchableOpacity>
                    <View style={{ ...styles.items, height: 300 }}>
                        <Text style={styles.itemsTxt}>Ubicación</Text>
                        <MapView
                            style={styles.map}
                            showsCompass
                            showsUserLocation
                            initialRegion={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: this.state.latitudeDelta,
                                longitudeDelta: this.state.longitudeDelta
                            }}
                        >
                            <Marker
                                title={'Denuncia'}
                                coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                                onSelect={e => this.log('onSelect', e)}
                                onDrag={e => this.log('onDrag', e)}
                                onDragStart={e => this.log('onDragStart', e)}
                                onDragEnd={e => this.log('onDragEnd', e)}
                                onPress={e => this.log('onPress', e)}
                                draggable
                            >
                            </Marker>
                        </MapView>
                    </View>
                </ScrollView>
                <View style={{ alignItems: 'flex-end', marginRight: 30 }}>
                    <TouchableOpacity style={styles.boton} onPress={this.verificarDatos}>
                        <Text style={styles.btnTxt}>+</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        paddingBottom: 5
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
    viewImagen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 40
    },
    imagen: {
        width: 120,
        height: 120,
        resizeMode: 'center',
        justifyContent: "center",
        alignItems: "center"
    },
    items: {
        height: 100,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 10,
        paddingHorizontal: 40,
        paddingVertical: 10
    },
    itemsTxt: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        fontSize: 20
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 20
    },
    btnImagen: {
        height: 40,
        width: 130,
        backgroundColor: 'rgb(200,200,200)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 5
    },
    boton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#ff5722',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -80,
        position: 'absolute',
        elevation: 5
    },
    btnTxt: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white'
    }
});