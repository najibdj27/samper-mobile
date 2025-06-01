import { memo } from "react"
import { Image, View } from "react-native";
import { Card, Text } from 'react-native-paper';


const EmptyAgendaCard = (props) => {
    const freeImg = require("../../assets/3f8f3f29-ea13-41c3-84bd-ad82927a6626.png")

    return (
        <Card style={{ marginVertical: 5, backgroundColor: "white", marginRight: 10 }}>
            <Card.Content>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={freeImg} style={{ height: 50, width: 80 }} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>It's Free!</Text>
                </View>
            </Card.Content>
        </Card>
    )
}

export default memo(EmptyAgendaCard)