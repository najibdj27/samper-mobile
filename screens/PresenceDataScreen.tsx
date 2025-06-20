import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PilotingModal from './components/PilotingModal'

const isPiloting = true


const PresenceDataScreen = () => {

  if (isPiloting) {
    return <PilotingModal isVisible={true} redirectScreen='BACK'   />
  }

  return (
    <View>
      <Text>PresenceDataScreen</Text>
    </View>
  )
}

export default PresenceDataScreen

const styles = StyleSheet.create({})