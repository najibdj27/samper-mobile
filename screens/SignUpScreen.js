import { Image, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, FAB, SegmentedButtons, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
    const studentImage = require("../assets/12699126_Happy students learning in college flat vector illustration.jpg")
    
    const [buttonValue, setButtonValue] = useState('student')

    const navigation = useNavigation()

    const handleNext = () => {
        navigation.navigate('SignUpForm', {type: buttonValue})
    }

    return (
        <View style={styles.container}>
            <Text variant='displayMedium' style={{fontWeight: "bold", paddingBottom: "80", position: "absolute", top: 150, color: 'black'}}>
                Sign Up
            </Text>
            <Image
                source={studentImage}
                style={{
                    marginVertical: 50,
                    width: 360,
                    height: 200
                }}
            />
            <SegmentedButtons 
                theme={
                    {
                        colors: {
                            secondaryContainer: '#03913E',
                            onSurface: 'black',
                            outline: '#ffff'
                        }
                    }
                }
                value={buttonValue}
                onValueChange={setButtonValue}
                style= {{
                    width: "80%"
                }}
                buttons={[
                    {
                        value: 'student',
                        label: 'Student',
                        labelStyle: { 
                            "fontSize": 36,
                            "fontWeight": "400",
                            "letterSpacing": 0,
                            "lineHeight": 44,
                        },
                        checkedColor: "#ffff"
                    },
                    {
                        value: 'lecture',
                        label: 'Lecture',
                        labelStyle: { 
                            "fontSize": 36,
                            "fontWeight": "400",
                            "letterSpacing": 0,
                            "lineHeight": 44,
                        },
                        checkedColor: "#ffff"
                    },
                ]}
            />
            <FAB 
                icon='arrow-right' 
                mode='flat'
                customSize={46}
                style={styles.nextButton}
                color='#ffff'
                onPress={handleNext}
            >
            </FAB>
        </View>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffff",
        paddingTop: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    nextButton: {
        position: 'absolute',
        bottom: 50,
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#03913E'
    }
})