import React, { createContext, useRef } from 'react'
import { Provider } from 'react-native-paper'
import DialogMessage from '../components/DialogMessage'
import DialogConfirmation from '../components/DialogConfirmation'
import Loader from '../components/Loader'

export const ModalContext = createContext()

export const ModalProvider = ({ children }) => {

    const dialogMessageRef = useRef()
    const dialogConfirmationRef = useRef()
    const loaderRef = useRef()

    const loaderOn = () => {
        loaderRef.current?.showLoader()
    }

    const loaderOff = () => {
        loaderRef.current?.hideLoader()
    }

    const showDialogConfirmation = (icon, tittle, text, positiveFunc, negativeFunc) => {
        dialogConfirmationRef.current?.showDialog(icon, tittle, text, positiveFunc, negativeFunc)
    }

    const showDialogMessage = (type, code, message, func) => {
        dialogMessageRef.current?.showDialog(type, code, message, func)
    }

    return (
        <ModalContext.Provider
            value={{
                loaderOn,
                loaderOff,
                showDialogConfirmation,
                showDialogMessage,
            }}
        >
            <Provider>
                {children}
                <Loader ref={loaderRef} />
                <DialogMessage ref={dialogMessageRef} />
                <DialogConfirmation ref={dialogConfirmationRef} />
            </Provider>
        </ModalContext.Provider>
    )
}
