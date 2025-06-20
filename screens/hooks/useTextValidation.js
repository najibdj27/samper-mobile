import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { HelperText } from 'react-native-paper'

const useTextValidation = () => {
    const [isValid, setIsValid] = useState(true)
    const [message, setMessage] = useState()

    const name = (input) => {
        const regEx1 = new RegExp(/^\S+$/g)
        const regEx2 = new RegExp(/^[A-Za-z]+$/g)
        if (!regEx1.test(input)) {
            setIsValid(false)
            setMessage(`Your name cannot contain white space`)
        } else if (!regEx2.test(input)) {
            setIsValid(false)
            setMessage(`Your name must only contain alphbetic character`)
        } else {
            setIsValid(true)
        }
    }
    
    const nim = (input) => {
        const regEx1 = new RegExp(/^\d{10,}$/g)
        if (!regEx1.test(input)) {
            setIsValid(false)
            setMessage(`Your NIM has to be 10 digits and cannot contain non numeric characters`)
        } else {
            setIsValid(true)
        }
    }
    
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
        const regEx1 = new RegExp(/^(?=.*[A-Z]).+$/g) // must at least have 1 uppercase letter
        const regEx2 = new RegExp(/^(?=.*[a-z].*[a-z].*[a-z]).+$/g) // must at least have 3 lowercase letters
        const regEx3 = new RegExp(/^(?=.*[0-9].*[0-9]).+$/g) // must at least have 2 numbers
        const regEx4 = new RegExp(/^(?=.*[!@#$&*.]).+$/g) // must at least have 1 special character '!@#$&*'

        if (!regEx1.test(input)) {
            setIsValid(false)
            setMessage(`Your password must at least have 1 uppercase letter`)
        } else if (!regEx2.test(input)) {
            setIsValid(false)
            setMessage(`Your password must at least have 3 lowercase letters`)
        } else if (!regEx3.test(input)) {
            setIsValid(false)
            setMessage(`Your password  must at least have 2 numbers`)
        } else if (!regEx4.test(input)) {
            setIsValid(false)
            setMessage(`Your password must at least have 1 special character '!@#$&*'`)
        } else {
            setIsValid(true)
        }
    }

    const validate = (type, input) => {
        switch (type) {
            case 'name':
                name(input)
                break;
            case 'nim':
                nim(input)
                break;
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