import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TextInputProps,
} from "react-native";

type Props = TextInputProps & {
    label: string;
    secure?: boolean;
    error?: string | null;
};

export default function AppTextInput({ label, secure = false, error, style, ...rest }: Props) {
    const [hidden, setHidden] = useState(secure);

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputRow, error ? styles.inputError : styles.inputNormal]}>
                <TextInput
                    style={[styles.input, style]}
                    secureTextEntry={hidden}
                    placeholderTextColor="#999"
                    autoCapitalize={secure ? "none" : rest.autoCapitalize}
                    {...rest}
                />
                {secure && (
                    <TouchableOpacity onPress={() => setHidden((h) => !h)} style={styles.toggle}>
                        <Text style={styles.toggleText}>{hidden ? "Show" : "Hide"}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#fff",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#45614A",
        paddingHorizontal: 12,
    },
    inputNormal: {
        borderColor: "#45614A",
    },
    inputError: {
        borderColor: "#e53e3e",
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: "#fff",
    },
    toggle: {
        paddingLeft: 8,
    },
    toggleText: {
        fontSize: 14,
        color: "#64AE70",
        fontWeight: "600",
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: "#e53e3e",
    },
});