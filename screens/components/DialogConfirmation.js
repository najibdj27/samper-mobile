import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, Dialog, Portal } from 'react-native-paper'
import { BlurView } from 'expo-blur'
import confirmationPageData from '../../data/confirmationPageData.json'

const DialogConfirmation = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [positiveFunc, setPositiveFunc] = useState(() => () => {})
    const [negativeFunc, setNegativeFunc] = useState(() => () => {})
    const [icon, setIcon] = useState('')
    const [tittle, setTittle] = useState('')
    const [text, setText] = useState()

    useEffect(() => {
        
    }, [])
    
    useImperativeHandle(ref, () => ({
        showDialog,
    }))

    const showDialog = (icon, tittle, text, positiveFunc, negativeFunc) => {
        console.log('showDialogConfirmation')
        Keyboard.dismiss()
        setIcon(icon)
        setText(text)
        setTittle(tittle)
        setPositiveFunc(() => positiveFunc)
        setNegativeFunc(() => negativeFunc)
        setVisible(true)
    }

    const hideDialog = (isConfirmed) => {
        console.log('hideDialogConfirmation')
        if (isConfirmed) {
            console.log('confirmed')
            positiveFunc? positiveFunc() : null
        } else {
            console.log('canceled')
            negativeFunc? negativeFunc() : null
        }
        setVisible(false)
    }

        
    if (visible) {
        return (
            <Portal>
                <BlurView intensity={10} tint="dark" style={{flex: 1,justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                    <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
                        <Dialog.Icon icon={icon} size={75} color='#D8261D' />
                        <Dialog.Title style={{textAlign: "center"}}>{tittle}</Dialog.Title>
                        <Dialog.Content>
                            <Text style={{textAlign: "center"}} variant="titleMedium">{text}</Text>
                        </Dialog.Content>
                        <Dialog.Actions style={{justifyContent: "center"}}>
                            <Button onPress={() => {hideDialog(true)}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 18, fontWeight: "bold"}}>Yes</Button>
                            <Button onPress={() => {hideDialog(false)}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#D8261D" ,fontSize: 18, fontWeight: "bold"}}>No</Button>
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