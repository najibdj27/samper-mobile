import { BlurView } from 'expo-blur';
import * as React from 'react';
import { Keyboard } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

const DialogMessage = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [type, setType] = React.useState()
    const [itemState, setItemState] = React.useState({ code: null, message: null })
    const [func, setFunc] = React.useState(() => () => { })

    const errorImg = require("../../assets/11235921_11104.jpg")

    React.useImperativeHandle(ref, () => ({
        showDialog: (type, code, message, func) => {
            console.log(`showDialogMessage`)
            Keyboard.dismiss()
            setVisible(true)
            setType(type)
            setItemState({
                code: code,
                message: message
            })
            setFunc(() => func)
        },
    }))


    const hideDialog = () => {
        func ? func() : null
        setVisible(false)
    };

    const context = (type) => {
        switch (type) {
            case 'error':
                return {
                    iconName: 'close-circle',
                    iconColor: '#D8261D',
                    title: 'Error',
                    buttonTextColor: 'white',
                    buttonColor: '#D8261D'
                }
            case 'alert':
                return {
                    iconName: 'alert-circle',
                    iconColor: '#F8C301',
                    title: 'Alert',
                    buttonTextColor: 'white',
                    buttonColor: '#03913E'
                }
            case 'success':
                return {
                    iconName: 'check-circle',
                    iconColor: '#03913E',
                    title: 'Success',
                    buttonTextColor: 'white',
                    buttonColor: '#03913E'
                }
            default:
                return {
                    iconName: 'information',
                    iconColor: 'black',
                    title: 'default',
                    buttonTextColor: 'white',
                    buttonColor: 'black'
                }
        }
    }

    const show = () => {
        if (visible) {
            const ctx = context(type)
            return (
                <Portal>
                    <BlurView style={{ flex: 1 }} intensity={10}>
                        <Dialog dismissable={false} visible={visible} onDismiss={hideDialog} style={{ backgroundColor: "#fff" }}>
                            <Dialog.Icon icon={ctx.iconName} size={100} color={ctx.iconColor} />
                            <Dialog.Title style={{ textAlign: "center", fontWeight: "bold" }}>
                                {ctx.title}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Text style={{ textAlign: "center", marginBottom: 5 }} variant="bodyLarge">{itemState.message}</Text>
                                {
                                    type === 'error' && (
                                        <Text style={{ textAlign: "center" }} variant="labelLarge">Code: {itemState.code}</Text>
                                    ) 
                                }
                            </Dialog.Content>
                            <Dialog.Actions style={{ justifyContent: "center", flexDirection: 'row' }}>
                                {
                                    type === 'alert' && (
                                        <Button onPress={() => { setVisible(false) }} mode='outlined' style={{width: 120}} buttonColor={'#D8261D'} labelStyle={{ color: ctx.buttonTextColor, fontSize: 18, textAlignVertical: 'center', lineHeight: 20, }}>Cancel</Button>
                                    )
                                }
                                <Button onPress={() => { hideDialog() }} mode='outlined' style={{width: 120}} buttonColor={ctx.buttonColor} labelStyle={{ color: ctx.buttonTextColor, fontSize: 18, textAlignVertical: 'center', lineHeight: 20, }}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </BlurView>
                </Portal>
            )
        } else {
            return null
        }
    }

    return show()

});

export default DialogMessage;