import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../AuthProvider';
import LogInScreen from '../container/login';
import SignUpScreen from '../container/signup';
import SuccessScreen from '../container/success';

const Stack = createNativeStackNavigator();

const MainNavigator = ({ parentNavigator }) => {
    const { user, userProfile } = useContext(AuthContext);
    const [isLoading, setLoading] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 3000);
    // }, []);

    // if (isLoading) {
    //     return <SplashScreen />
    // }

    return (
        <NavigationContainer>
            <>
                <Stack.Navigator
                    initialRouteName={'SignIn'}
                    screenOptions={{ headerShown: false }}
                >
                    {
                        userProfile ?
                            (
                                <Stack.Screen name="Success" component={SuccessScreen} />

                            ) : (
                                <>
                                    <Stack.Screen name="LogIn" component={LogInScreen} />
                                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                                </>
                            )
                    }
                </Stack.Navigator>
            </>
        </NavigationContainer>
    );
};

export default MainNavigator;