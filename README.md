# Grupo 5 UTPL

Aplicación para Android creada con React Native y Firebase, que permite el reporte de eventos con una posición georeferenciada, una imágen que podrá tener como origen el almacenamiento del celular, una nube como la de Google Fotos o la cámara del dispositivo, título y descripción, cada usuario podrá visualizar sus reportes en la pantalla de inicio, realizar nuevas denuncias o editar su perfil, mientras que el administrador visualizará todas las denuncias creadas, junto con el nombre del usuario que las creó.

Al iniciar la aplicación se requiere el ingreso con un usuario y contraseña, los mismos podrán ser credos desde la pantalla de registro, una vez que el usuario se haya creado e iniciado su sesión, se verificará si es un administrador o un usuario normal, por defecto el usuario NO será administrador. Si el usuario quiere modificar su información, se lo podrá realizar desde la pantalla de perfil, en donde habrá un boton de cerrar sesión. Finalmente para visualizar las nuevas consultas que se vayan generando es necesario presionar el boton de recargar de la pantalla de denuncias.

Para descargar la aplicación release, se ha subido la ultima versión a este mismo github o se puede clonar el repositorio y correr el siguiente comando en la carpeta del proyecto para instalar todas las librerías que se utilziaron:

npm install --save @react-navigation/native react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view @react-navigation/stack @react-navigation/bottom-tabs @react-native-firebase/app @react-native-firebase/analytics @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage react-native-elements react-native-vector-icons react-native-maps --save-exact @react-native-community/picker react-native-datepicker @react-native-community/geolocation react-native-permissions react-native-image-picker
npx react-native link react-native-vector-icons

Una vez se hayan descargado todas sin fallos, se podrá correr la aplicación en un dispositivo físico o un emulador escribiendo en una terminal: npx react-native run-android

# Importante

Si no ha utilizado nunca React Native, seguir las instrucciones para instalar todo lo necesario que se encuentran la documentación oficial:

https://reactnative.dev/docs/environment-setup

# Integrantes
- GUACHISACA APOLO CARLOS ANDRES
- SALAZAR VACA DANIEL ALEXANDER
- SALAZAR CORDOVA VLADIMIR OSWALDO
- JARAMILLO LOPEZ CESAR GUILLERMO
