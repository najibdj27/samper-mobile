import { Platform, StatusBar, View } from "react-native";
import ComingSoon from "./components/ComingSoon";

const NotificationScreen = () => {
    const notificationComingSoonImg = require("../assets/19245722_6101668.jpg")
    return (
        <>
            <View style={{backgroundColor: '#D8261D',  paddingTop: Platform.OS === 'android'? StatusBar.currentHeight : 0, width: '100%'}} />
            <ComingSoon imageSource={notificationComingSoonImg} />
        </>
    );
}

export default NotificationScreen;