import { createNavigationContainerRef, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import { Keyboard } from 'react-native';
import { Button, Dialog, Divider, Portal, Text } from 'react-native-paper';

const DialogMessage = React.forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [type, setType] = React.useState()
  const [itemState, setItemState] = React.useState({code: null, message: null})
  const [func, setFunc] = React.useState(() => () => {})

  const errorImg = require("../../assets/11235921_11104.jpg")

  React.useImperativeHandle(ref, () => ({
    showDialog(type, code, message, func){
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
    func? func() : null
    setVisible(false)
  };

  const errorDialog = () => (
    <Portal>
      <BlurView style={{flex: 1}} intensity={10}>
        <Dialog dismissable={false} visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
          <Dialog.Icon icon="close-circle" size={75} color='#D8261D' />
          <Dialog.Title style={{textAlign: "center"}}>Error</Dialog.Title>
          <Dialog.Content>
            <Text style={{textAlign: "center"}} variant="titleMedium">Code: {itemState.code}</Text>
            <Text style={{textAlign: "center"}} variant="bodyMedium">{itemState.message}</Text>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent: "center"}}>
            <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </BlurView>
    </Portal>
  )

  const alertDialog = () => (
    <Portal>
      <BlurView style={{flex: 1}} intensity={10}>
        <Dialog dismissable={false} visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
          <Dialog.Icon icon="alert-rhombus" size={75} color='#F8C301' />
          <Dialog.Title style={{textAlign: "center"}}>Alert</Dialog.Title>
          <Dialog.Content>
            <Text style={{textAlign: "center"}} variant="bodyMedium">{itemState.message}</Text>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent: "center"}}>
            <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </BlurView>
    </Portal>
  )
  const successDialog = () => (
    <Portal>
      <BlurView style={{flex: 1}} intensity={10}>
        <Dialog dismissable={false} visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
          <Dialog.Icon icon="checkbox-marked" size={75} color='#03913E' />
          <Dialog.Title style={{textAlign: "center", fontWeight: "bold"}}>Success</Dialog.Title>
            <Divider style={{marginVertical: 10}} />
          <Dialog.Content>
            <Text style={{textAlign: "center", marginVertical: 15}} variant="bodyLarge">{itemState.message}</Text>
            <Text style={{textAlign: "center"}} variant="labelSmall">{itemState.code}</Text>
          </Dialog.Content>
            <Divider style={{marginVertical: 10}} />
          <Dialog.Actions style={{justifyContent: "center"}}>
            <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </BlurView>
    </Portal>
  )

  const show = () => {
    if (visible) {
      switch (type) {
        case 'error':
          return errorDialog()
        case 'alert':
          return alertDialog()
        case 'success':
          return successDialog()
      
        default:
          break;
      }
    } else {
      return null
    }
  }

  return show()
  
});

export default DialogMessage;