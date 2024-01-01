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

    const newPassword = (input) => {
        const regEx1 = new RegExp(/^(?=.*[A-Z].*[A-Z]).+$/g) // must at least have 1 uppercase letter
        const regEx2 = new RegExp(/^(?=.*[a-z].*[a-z].*[a-z]).+$/g) // must at least have 3 lowercase letters
        const regEx3 = new RegExp(/^(?=.*[0-9].*[0-9]).+$/g) // must at least have 2 numbers
        const regEx4 = new RegExp(/^(?=.*[!@#$&*]).+$/g) // must at least have 1 special character '!@#$&*'
        if (regEx1.test(input)) {
            if (regEx2.test(input)) {
                if (regEx3.test(input)) {
                    if (regEx4.test(input)) {
                        setIsValid(true)
                    } else {
                        setIsValid(false)
                        setMessage(`Your password must at least have 1 special character '!@#$&*'`)
                    }
                } else {
                    setIsValid(false)
                    setMessage(`Your password  must at least have 2 numbers`)
                }
            } else {
                setIsValid(false)
                setMessage(`Your password must at least have 3 lowercase letters`)
            }
        } else {
            setIsValid(false)
            setMessage(`Your password must at least have 1 uppercase letter`)
        }
    }

    const validate = (type, input) => {
        switch (type) {
            case 'email':
                email(input)
                break;
            
            case 'newPassword':
                newPassword(input)
                break;
        
            default:
                break;
        }
    }
    
    return {isValid, message, validate}
}

export default useTextValidation