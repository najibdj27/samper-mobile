import { SignUpFormDataType } from "./form";

type SignUpParamType = {
    type: string
    formData: SignUpFormDataType
    token: string
}

export type RootStackParamList = {
    SignUpFR: SignUpParamType
    SignUpOTP: SignUpParamType
};