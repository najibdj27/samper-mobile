import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { TextInputProps } from "react-native-paper"
import { ModalPickerDataType } from "./form"
import { ClassManagementStudentDataType } from "./data"

export type InputFormProps = {
  label: string
  input?: any
  setInput?: (text: string) => void
  setInputObject?: (input: any) => void
  isRequired?: boolean
  placeholder?: string
  centered?: boolean
  useValidation?: boolean
  validationMode?: string
  mode?: TextInputProps["mode"]
  inputMode?: TextInputProps["inputMode"]
  keyboardType?: TextInputProps["keyboardType"]
  left?: React.ReactNode
  right?: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  contentStyle?: TextStyle
  secureTextEntry?: boolean
  disabled?: boolean
  editable?: boolean
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  maxLength?: number
  activeOutlineColor?: string
  outlineStyle?: ViewStyle
}

export type ModalPickerProps = {
  label: string
  input?: any
  setInput?: (text: any) => void
  isRequired?: boolean
  placeholder?: string
  centered?: boolean
  useValidation?: boolean
  validationMode?: string
  mode?: TextInputProps["mode"]
  inputMode?: TextInputProps["inputMode"]
  keyboardType?: TextInputProps["keyboardType"]
  left?: React.ReactNode
  right?: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  contentStyle?: TextStyle
  secureTextEntry?: boolean
  disabled?: boolean
  editable?: boolean
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  maxLength?: number
  activeOutlineColor?: string
  outlineStyle?: ViewStyle
  data: ModalPickerDataType[]
}

export type DashboardToolsProps = {
  item: {
    name: string,
    icon: string,
    redirectScreen: never
  },
  isLoading?: boolean,
  isEmpty?: boolean
}

export type DataSurfaceProps = {
  icon: string,
  title: string,
  value: string | number
}

export type StudentListProps = {
  item: ClassManagementStudentDataType
}

export type PilotingModalProps = {
  isVisible: boolean,
  redirectScreen: string
}