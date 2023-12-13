import { StyleSheet } from 'react-native'
import * as React from 'react'
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';

const Loader = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    
    React.useImperativeHandle(ref, () => ({
        showDialog(){setVisible(true)},
        hideDialog(){setVisible(false)}
    }))

    return (
        <Portal>
            <Modal visible={visible} dismissable={false} dismissableBackButton={false}>
                <ActivityIndicator animating={true} size={80} color="#F8C301" />
            </Modal>
        </Portal>
    )
})

export default Loader