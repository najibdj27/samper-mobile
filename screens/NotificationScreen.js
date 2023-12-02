import { View } from "react-native";
import ComingSoon from "./components/ComingSoon";

const NotificationScreen = () => {
    const notificationComingSoonImg = require("../assets/19245722_6101668.jpg")
    return (
        <ComingSoon imageSource={notificationComingSoonImg} />
    );
}

export default NotificationScreen;