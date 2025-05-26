import { useEffect, useState } from "react"
import * as Location from 'expo-location';
import useModal from "./useModal";

export default useGeolocation = () => {
    const [longitudeCoords, setLongitudeCoords] = useState(null)
    const [latitudeCoords, setLatitudeCoords] = useState(null)

    const { loaderOn, loaderOff, showDialogConfirmation, hideDialogConfirmation } = useModal()

    useEffect(() => {
        const getCurrentLocation = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync()
            
            if (status !== 'granted') {
                showDialogConfirmation('error', 'Location Permission', 'Can not access current location', null, () => {hideDialogConfirmation()})
                return;
            }
            
            loaderOn() 
            await Location.getCurrentPositionAsync().then((resp) => {
                const {latitude, longitude} = resp.coords;                
                setLongitudeCoords(longitude)
                setLatitudeCoords(latitude)
            }).catch((err) => {
                showDialogConfirmation('error', 'Error Get Location', 'Can not get current location', null, () => {hideDialogConfirmation()})
            }).finally(() => {
                loaderOff()
            })
        }
        
        getCurrentLocation()
    }, [])
    
    return {longitudeCoords, latitudeCoords}
}