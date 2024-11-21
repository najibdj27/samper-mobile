import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PaperProvider, TextInput } from 'react-native-paper'
import InputForm from './components/InputForm'
import { AuthContext } from './contexts/AuthContext'

const AccountDetailScreen = () => {
    const auth = useContext(AuthContext)
    const {width} = useWindowDimensions()
    const [accountDetailForm, setAccountDetailForm] = useState({})

    const memoizeData = useCallback(() => {
        setAccountDetailForm({
            firstName: auth.authState.profile.user.firstName,
            lastName: auth.authState.profile.user.lastName,
            email: auth.authState.profile.user.email,
            username: auth.authState.profile.user.username,
            phoneNumber: auth.authState.profile.user.phoneNumber,
        })
    }, [auth.authState.profile])

    useEffect(() => {
        memoizeData()
    }, [memoizeData])
    return (
        <PaperProvider>
            <View style={styles.container}>
                <InputForm 
                    mode="flat"
                    label="First Name"
                    input={accountDetailForm?.firstName || null}
                    setInput={(text) => {setAccountDetailForm(prevData => ({...prevData, firstName: text}))}}
                    placeholder="Type your reason ..."
                    inputMode="text"
                    keyboardType="default"
                    useValidation={false}
                    secureTextEntry={false}
                    contentStyle={{
                        textTransform: "uppercase"
                    }}
                />
                <InputForm 
                    mode="flat"
                    label="Last Name"
                    input={accountDetailForm?.lastName || null}
                    setInput={(text) => {setAccountDetailForm(prevData => ({...prevData, lastName: text}))}}
                    placeholder="Type your reason ..."
                    inputMode="text"
                    keyboardType="default"
                    useValidation={false}
                    secureTextEntry={false}
                    contentStyle={{
                        textTransform: "uppercase"
                    }}
                />
                <InputForm 
                    mode="flat"
                    label="Email"
                    input={accountDetailForm.email}
                    setInput={(text) => {setAccountDetailForm(prevData => ({...prevData, firstName: text}))}}
                    placeholder="Type your reason ..."
                    inputMode="text"
                    keyboardType="default"
                    useValidation={false}
                    secureTextEntry={false}
                />
                <InputForm 
                    mode="flat"
                    label="Username"
                    input={accountDetailForm.username}
                    setInput={(text) => {setAccountDetailForm(prevData => ({...prevData, firstName: text}))}}
                    placeholder="Type your reason ..."
                    inputMode="text"
                    keyboardType="default"
                    useValidation={false}
                    secureTextEntry={false}
                    editable={false}
                    contentStyle={{
                        textTransform: "lowercase"
                    }}
                />
                <InputForm 
                    mode="flat"
                    label="Phone Number"
                    input={accountDetailForm.phoneNumber}
                    setInput={(text) => {setAccountDetailForm(prevData => ({...prevData, firstName: text}))}}
                    placeholder="Type your reason ..."
                    inputMode="text"
                    keyboardType="default"
                    useValidation={false}
                    secureTextEntry={false}
                    editable={false}
                    contentStyle={{
                        textTransform: "lowercase"
                    }}
                />
                
            </View>
        </PaperProvider>
    )
}

export default AccountDetailScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#f6f6f6",
        flex: 1
    }
})