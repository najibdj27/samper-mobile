import { FlatList, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Button, HelperText, IconButton, List, TextInput } from 'react-native-paper'
import { InputFormRef } from '../type/ref'
import { ModalPickerProps } from '../type/props'
import Modal from 'react-native-modal'

const ModalPicker = forwardRef<InputFormRef, ModalPickerProps>((props, ref) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>()
    const [isError, setIsError] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [search, setSearch] = useState('');

    const { width, height } = useWindowDimensions()
    useImperativeHandle(ref, () => ({
        setError: (err: boolean) => setIsError(err),
        setMessage: (value: string) => setErrorMessage(value),
        setFocus: () => inputInternalRef.current?.focus()
    }))

    const inputInternalRef = useRef(null);

    const filteredData = useMemo(() => {
        return props?.data?.filter((value) => {
            console.log(`value ${JSON.stringify(value)}`)
            const query = search.toLowerCase();
            return (
                value.title.toLowerCase().includes(query) || value?.subtitle?.toLowerCase().includes(query)
            );
        });
    }, [search, props?.data])

    return (
        <>
            <View style={{ alignSelf: props.centered ? 'center' : 'flex-start', alignItems: "flex-start", maxWidth: width * 0.9, flexWrap: "wrap" }}>
                <TextInput
                    ref={inputInternalRef}
                    left={props.left}
                    right={(
                        <TextInput.Icon
                            icon="chevron-down"
                            color='black'
                            onPress={() => setIsVisible(true)}
                        />)}
                    label={(
                        <>
                            <Text style={{ color: '#D8261D' }}>{props.isRequired ? '*' : null} </Text>
                            <Text>{props.label}</Text>
                        </>
                    )}
                    placeholder={props.placeholder}
                    value={props.input}
                    mode={props.mode}
                    error={isError}
                    activeOutlineColor={"#03913E"}
                    inputMode={props.inputMode}
                    keyboardType={props.keyboardType}
                    style={[{
                        height: 50,
                        marginTop: 2,
                        backgroundColor: "white",
                        width: width * 0.9,
                    }, props.style]}
                    activeUnderlineColor='#D8261D'
                    contentStyle={[props.contentStyle, {
                        fontWeight: "bold",
                        color: 'black'
                    }]}
                    outlineStyle={{ borderRadius: 16 }}
                    secureTextEntry={props.secureTextEntry}
                    disabled={props.disabled}
                    editable={false}
                    autoCapitalize={props.autoCapitalize}
                    maxLength={props.maxLength}
                />
                <View style={{ minHeight: 25 }}>
                    <HelperText type="error" style={{ position: "static" }} visible={true}>
                        {errorMessage}
                    </HelperText>
                </View>
            </View>
            <Modal
                isVisible={isVisible}
                style={{ margin: 0, justifyContent: 'flex-end' }}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                deviceWidth={width}
                deviceHeight={height}
                backdropOpacity={0.4}
            >
                <View style={[styles.modalOverlay, { maxHeight: height * 0.3 }]}>
                    <View style={styles.modalContent}>
                        <View style={styles.knob} />
                        <TextInput
                            placeholder="Search..."
                            value={search}
                            onChangeText={setSearch}
                            style={{
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                marginBottom: 16,
                                borderRadius: 5,
                                paddingHorizontal: 8,
                            }}
                        />
                        <FlatList
                            data={filteredData}
                            renderItem={({ item }: any) => (
                                <List.Item
                                    key={item.vaue}
                                    title={item.title}
                                    titleStyle={{
                                        fontWeight: 'bold'
                                    }}
                                    description={item.subtitle}
                                    onPress={() => {
                                        props.setInput(item)
                                        setIsVisible(false)
                                        setIsError(false)
                                        setErrorMessage('')
                                    }}
                                // left={props => <List.Icon {...props} icon="folder" />}
                                />
                            )}
                        />
                        <IconButton iconColor='black' size={28} style={{width: width*0.2, alignSelf: 'center'}} icon={'chevron-down'} onPress={() => setIsVisible(false)} />
                    </View>
                </View>

            </Modal>
        </>
    )
})

export default ModalPicker

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    knob: {
        width: 60,
        height: 6,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: -10,
        marginBottom: 10,
    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'flex-end', // or 'center'
    },
})