import { Image, StyleSheet, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Button, FAB, SegmentedButtons, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const SignUpScreen = () => {
    const studentImage = require("../assets/12699126_Happy students learning in college flat vector illustration.jpg")
    
    const [buttonValue, setButtonValue] = useState('student')

    const navigation = useNavigation()

    const {width, height} = useWindowDimensions()

    const handleNext = () => {
        navigation.navigate('SignUpForm', {type: buttonValue})
    }

    return (
        <View style={styles.container}>
            <Text variant='displayMedium' style={{fontWeight: "bold", paddingBottom: "80", color: 'black'}}>
                Sign Up
            </Text>
            <Image
                source={studentImage}
                style={{
                    width: scale(width),
                    height: verticalScale(height * 0.25)
                }}
                resizeMode='contain'
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
                    width: scale(200),
                    height: verticalScale(50)
                }}
                buttons={[
                    {
                        value: 'student',
                        label: 'Student',
                        labelStyle: { 
                            "fontSize": scale(18),
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
                            "fontSize": scale(18),
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
        justifyContent: "space-around",
        alignItems: "center"
    },
    nextButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#03913E'
    }
})