import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from "react-native";

type Props = {
    label: string;
    onPress: () => void;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function AppButton({ label, onPress, loading = false, style, textStyle }: Props) {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={[styles.label, textStyle]}>{label}</Text>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#64AE70",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});