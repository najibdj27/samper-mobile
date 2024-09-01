import * as React from 'react'
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { BlurView } from 'expo-blur';

const Loader = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    
    React.useImperativeHandle(ref, () => ({
        showLoader(){setVisible(true)},
        hideLoader(){setVisible(false)}
    }))

    if (visible) {
        return (
            <Portal>
                <BlurView intensity={10} tint="dark" style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Modal visible={visible} dismissable={false} dismissableBackButton={false}>
                        <ActivityIndicator animating={true} size={80} color="#F8C301" />
                    </Modal>
                </BlurView>
            </Portal>
        )
    } else {
        null
    }
})

export default Loader