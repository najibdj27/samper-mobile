import { SignUpFormDataType } from "./form";
import { StudentDetailScreenRoute } from "./route";

type SignUpParamType = {
    type: string
    formData: SignUpFormDataType
    token: string
}

export type RootStackParamList = {
    SignUpFR: SignUpParamType
    SignUpOTP: SignUpParamType
    StudentDetail: {
        studentId: number 
    }
};