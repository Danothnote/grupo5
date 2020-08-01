import React, { useState, useEffect, createContext } from 'react';
import { ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import SigninStack from '../Navegacion/signinStack';
import SignoutStack from '../Navegacion/signoutStack';
import AdminStack from './adminStack';

export const AuthContext = createContext(null)

export default function AuthNavigator() {
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)

    // Handle user state changes
    function onAuthStateChanged(result) {
        setUser(result)
        setAdmin(() => {
            if (result) {
                if (auth().currentUser.uid == '8RWfVPuUHshsxSS6QlZkkT57cOm1') {
                    setAdmin(true)
                    ToastAndroid.showWithGravityAndOffset(
                        "Bienvenido Administrador",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                } else {
                    setAdmin(false)
                    ToastAndroid.showWithGravityAndOffset(
                        "Bienvenido",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
            }
        })

        if (initializing) setInitializing(false)
    }

    useEffect(() => {
        const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return authSubscriber
    }, [])

    if (initializing) {
        return null
    }

    return user ? (
        admin ? (
            <AuthContext.Provider value={user}>
                <AdminStack />
            </AuthContext.Provider>
        ) : (
                <AuthContext.Provider value={user}>
                    <SigninStack />
                </AuthContext.Provider>
            )
    ) : (
            <SignoutStack />
        )
}