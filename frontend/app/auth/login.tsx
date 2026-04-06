import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import AppTextInput from "../../components/TextInput";
import AppButton from "../../components/Button";

export default function LoginScreen() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState(""); // username or email
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [identifierError, setIdentifierError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIdentifierError(null);
        setPasswordError(null);

        if (!identifier.trim()) {
            setIdentifierError("Please enter your username or email");
            return;
        }
        if (!password) {
            setPasswordError("Please enter your password");
            return;
        }

        setLoading(true);

        // If they typed a username, look up their email first
        let email = identifier.trim();
        if (!identifier.includes("@")) {
            const { data, error } = await supabase
                .from("user")
                .select("email")
                .eq("username", identifier.trim())
                .single();

            if (error || !data) {
                setIdentifierError("No account found with that username");
                setLoading(false);
                return;
            }
            email = data.email;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            if (error.message.toLowerCase().includes("invalid")) {
                setPasswordError("Incorrect password");
            } else {
                Alert.alert("Login failed", error.message);
            }
        } else {
            router.replace("/"); // navigate to home on success
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

            <AppTextInput
                label="Username or Email"
                placeholder="Enter your username or email"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
                error={identifierError}
            />

            <AppTextInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secure
                error={passwordError}
            />

            <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.link}>Need to create an account? Click here to register!</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
                <AppButton label="Login" onPress={handleLogin} loading={loading} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#213A21",
        padding: 28,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 32,
    },
    link: {
        color: "#64AE70",
        fontSize: 14,
        marginTop: 8,
        marginBottom: 8,
    },
    buttonRow: {
        alignItems: "flex-end",
        marginTop: 16,
    },
});