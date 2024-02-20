import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Image } from 'react-native';
import { Button, Dialog, Portal, Text, PaperProvider } from 'react-native-paper';

const DialogMessage = React.forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [type, setType] = React.useState()
  const [itemState, setItemState] = React.useState({})
  const [navigateTo, setNavigateTo] = React.useState()

  const errorImg = require("../../assets/11235921_11104.jpg")

  React.useImperativeHandle(ref, () => ({
    showDialog(type, code, message, navigateTo){
      console.log(`showDialog`)
      setVisible(true)
      setType(type)
      setItemState({
        code: code,
        message: message
      })
      setNavigateTo(navigateTo)
    },
  }))

  const navigation = useNavigation()

  const hideDialog = () => {
    if (navigateTo) {
      navigation.navigate(navigateTo)
    }
    setVisible(false)
  };

  const errorDialog = () => (
    <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
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
  )

  const alertDialog = () => (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
        <Dialog.Icon icon="alert-rhombus" size={75} color='#F8C301' />
        <Dialog.Title style={{textAlign: "center"}}>Alert</Dialog.Title>
        <Dialog.Content>
          <Text style={{textAlign: "center"}} variant="bodyMedium">{itemState.message}</Text>
        </Dialog.Content>
        <Dialog.Actions style={{justifyContent: "center"}}>
          <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
  const successDialog = () => (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
        <Dialog.Icon icon="checkbox-marked" size={75} color='#03913E' />
        <Dialog.Title style={{textAlign: "center"}}>Success</Dialog.Title>
        <Dialog.Content>
          <Text style={{textAlign: "center"}} variant="bodyMedium">{itemState.message}</Text>
        </Dialog.Content>
        <Dialog.Actions style={{justifyContent: "center"}}>
          <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )

  const show = () => {
    switch (type) {
      case 'error':
        return errorDialog()
        break;
      case 'alert':
        return alertDialog()
        break;
      case 'success':
        return successDialog()
        break;
    
      default:
        break;
    }
  }

  return show()
  
});

export default DialogMessage;