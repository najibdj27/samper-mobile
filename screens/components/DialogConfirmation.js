import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, Dialog, Portal } from 'react-native-paper'
import { BlurView } from 'expo-blur'
import confirmationPageData from '../../data/confirmationPageData.json'

const DialogConfirmation = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [positiveFunc, setPositiveFunc] = useState(() => () => {})
    const [negativeFunc, setNegativeFunc] = useState(() => () => {})
    const [data, setData] = useState({})
    const [type, setType] = useState()

    useEffect(() => {
        
    }, [])
    
    useImperativeHandle(ref, () => ({
        showDialog,
    }))

    const showDialog = (type, positiveFunc, negativeFunc) => {
        console.log('showDialogConfirmation')
        Keyboard.dismiss()
        setType(type)
        setPositiveFunc(() => positiveFunc)
        setNegativeFunc(() => negativeFunc)
        setVisible(true)
    }

    const hideDialog = (isConfirmed) => {
        console.log('hideDialogConfirmation')
        if (isConfirmed) {
            positiveFunc? positiveFunc() : null
        } else {
            negativeFunc? negativeFunc() : null
        }
        setVisible(false)
    }

        
    if (visible) {
        return (
            <Portal>
                <BlurView intensity={10} tint="dark" style={{flex: 1,justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                    <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
                        <Dialog.Icon icon="alert-rhombus" size={75} color='#F8C301' />
                        <Dialog.Title style={{textAlign: "center"}}>Logout</Dialog.Title>
                        <Dialog.Content>
                            <Text style={{textAlign: "center"}} variant="titleMedium">{confirmationPageData[type]?.content || ''}</Text>
                        </Dialog.Content>
                        <Dialog.Actions style={{justifyContent: "center"}}>
                            <Button onPress={() => {hideDialog(true)}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 18, fontWeight: "bold"}}>{confirmationPageData[type]?.positiveText || ''}</Button>
                            <Button onPress={() => {hideDialog(false)}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#D8261D" ,fontSize: 18, fontWeight: "bold"}}>{confirmationPageData[type]?.negativeText || ''}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </BlurView>
            </Portal>
        )
    } else {
        null
    }    
})

export default DialogConfirmation

const styles = StyleSheet.create({})