import * as React from 'react';
import { Image } from 'react-native';
import { Button, Dialog, Portal, Text, PaperProvider } from 'react-native-paper';

const DialogMessage = React.forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);

  const errorImg = require("../../assets/11235921_11104.jpg")

  
  React.useImperativeHandle(ref, () => ({
    showDialog(){setVisible(true)}
  }))
  const hideDialog = () => {setVisible(false)};

  const errorDialog = () => (
    <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
      <Dialog.Icon icon="close-circle" size={75} color='#D8261D' />
      <Dialog.Title style={{textAlign: "center"}}>Error</Dialog.Title>
      <Dialog.Content>
        <Text style={{textAlign: "center"}} variant="titleMedium">Code: 000</Text>
        <Text style={{textAlign: "center"}} variant="bodyMedium">Your email is not recognized by our server. Make sure your email is correct or call the admin.</Text>
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
          <Text style={{textAlign: "center"}} variant="bodyMedium">Please enter the correct email address.</Text>
        </Dialog.Content>
        <Dialog.Actions style={{justifyContent: "center"}}>
          <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
  const succesDialog = () => (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
        <Dialog.Icon icon="checkbox-marked" size={75} color='#03913E' />
        <Dialog.Title style={{textAlign: "center"}}>Success</Dialog.Title>
        <Dialog.Content>
          <Text style={{textAlign: "center"}} variant="bodyMedium">Successfully send your request.</Text>
        </Dialog.Content>
        <Dialog.Actions style={{justifyContent: "center"}}>
          <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )

  return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: "#fff"}}>
          <Dialog.Icon icon="checkbox-marked" size={75} color='#03913E' />
          <Dialog.Title style={{textAlign: "center"}}>Success</Dialog.Title>
          <Dialog.Content>
            <Text style={{textAlign: "center"}} variant="bodyMedium">Successfully send your request.</Text>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent: "center"}}>
            <Button onPress={() => {hideDialog()}} mode='text'  style={{borderRadius: 10, width: 60}} labelStyle={{color: "#03913E" ,fontSize: 16}}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
  );
});

export default DialogMessage;