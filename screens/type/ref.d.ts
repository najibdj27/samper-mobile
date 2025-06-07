
type CommonFormRef = {
    setError: (value: boolean) => void
    setMessage: (value: string) => void
    setFocus: () => void
}

export type DropDownCompRef = CommonFormRef
export type InputFormRef = CommonFormRef