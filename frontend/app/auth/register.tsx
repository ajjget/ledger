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

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleRegister = async () => {
        setUsernameError(null);
        setEmailError(null);
        setPasswordError(null);

        let valid = true;
        if (!username.trim()) { setUsernameError("Username is required"); valid = false; }
        if (!email.trim()) { setEmailError("Email is required"); valid = false; }
        if (!password) { setPasswordError("Password is required"); valid = false; }
        if (!valid) return;

        setLoading(true);

        // Check username availability
        const { data: existing } = await supabase
            .from("user")
            .select("username")
            .eq("username", username.trim())
            .single();

        if (existing) {
            setUsernameError("Username is already taken");
            setLoading(false);
            return;
        }

        // Sign up with Supabase Auth
        const { error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
            if (signUpError.message.toLowerCase().includes("already registered")) {
                setEmailError("An account with this email already exists");
            } else {
                Alert.alert("Sign up failed", signUpError.message);
            }
            setLoading(false);
            return;
        }

        // Update username in user table (trigger already created the row)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from("user")
                .update({ username: username.trim() })
                .eq("id", user.id);
        }

        router.replace("/");
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <AppTextInput
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                error={usernameError}
            />

            <AppTextInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                error={emailError}
            />

            <AppTextInput
                label="Password"
                placeholder="Choose a password"
                value={password}
                onChangeText={setPassword}
                secure
                error={passwordError}
            />

            <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.link}>Already have an account? Click here to login!</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
                <AppButton label="Register" onPress={handleRegister} loading={loading} />
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