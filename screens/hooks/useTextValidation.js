import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { HelperText } from 'react-native-paper'

const useTextValidation = () => {
    const [isValid, setIsValid] = useState(true)
    const [message, setMessage] = useState()
    
    const email = (input) => {
        const regEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
        if (regEx.test(input)) {
            setIsValid(true)
        } else {
            setIsValid(false)
            setMessage(`Your email is invalid`)
        }
    }

    const validate = (type, input) => {
        switch (type) {
            case 'email':
                email(input)
                break;
        
            default:
                break;
        }
    }
    
    return {isValid, message, validate}
}

export default useTextValidation