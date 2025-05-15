import { useEffect, useState } from "react"
import * as Location from 'expo-location';
import useModal from "./useModal";

export default useGeolocation = () => {
    const [longitudeCoords, setLongitudeCoords] = useState(null)
    const [latitudeCoords, setLatitudeCoords] = useState(null)

    const { loaderOn, loaderOff, showDialogConfirmation, hideDialogConfirmation } = useModal()
    console.log(`geo hook render`)
    console.log(`Longitude: ${longitudeCoords}`)
    console.log(`Latitude: ${latitudeCoords}`)

    useEffect(() => {
        const getCurrentLocation = async () => {
            console.log(`getCurrentLocation`)
            let {status} = await Location.requestForegroundPermissionsAsync()
            
            if (status !== 'granted') {
                console.log(`Location access not granted`)
                showDialogConfirmation('error', 'Location Permission', 'Can not access current location', null, () => {hideDialogConfirmation()})
                return;
            }
            
            loaderOn() 
            await Location.getCurrentPositionAsync().then((resp) => {
                console.log(`success getCurrentLocation`)
                const {latitude, longitude} = resp.coords;
                console.log(`Longitude: ${longitude}`)
                console.log(`Latitude: ${latitude}`)
                
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