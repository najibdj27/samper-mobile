export type ClassManagementStudentDataType = {
    id: number,
    name: string,
    className: string,
    majorName: string,
    isLeader: boolean,
    isActive: boolean,
    userStatus: string
}

export type StudentDetailStudentDataType = {
    id: number,
    userId: number,
    name: string,
    dob: string,
    email: string,
    phoneNumber: string,
    className: string,
    majorName: string,
    registeredFaceUrl: string,
    isLeader: boolean,
    isActive: boolean,
    userStatus: string
}

export type ClassManagementMetaDataType = {
    classSum: number,
    studentSum: number
}