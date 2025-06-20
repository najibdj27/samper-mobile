import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PilotingModal from './components/PilotingModal'

const isPiloting = true

const PresenceStatisticScreen = () => {

  if (isPiloting) {
    return <PilotingModal isVisible={true} redirectScreen='BACK'   />
  }

  return (
    <View>
      <Text>PresenceStatisticScreen</Text>
    </View>
  )
}

export default PresenceStatisticScreen

const styles = StyleSheet.create({})