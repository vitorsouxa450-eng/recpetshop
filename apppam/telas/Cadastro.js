import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BrandMark } from "../components/BrandMark";
import { cadastrar } from "../services/auth";

const colors = {
  background: "#F7F3EC",
  surface: "#FFFFFF",
  text: "#21313A",
  secondary: "#6E7B80",
  accent: "#E77832",
  border: "#E5DED4",
  softAccent: "#FDE7D6",
  input: "#FBFAF7",
};

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const value = email.trim();

    if (!value || !password) {
      Alert.alert("Campos incompletos", "Preencha e-mail e senha.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Senha fraca", "Use pelo menos 6 caracteres.");
      return;
    }

    try {
      await cadastrar(value, password);
      Alert.alert("Conta criada", "Seu cadastro foi realizado com sucesso.", [
        { text: "Entrar", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Não foi possível cadastrar",
        "Verifique o e-mail e a senha e tente novamente.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <BrandMark compact />
        </View>

        <View style={styles.intro}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>+</Text>
          </View>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            Um cadastro simples para deixar os cuidados do seu pet mais
            organizados.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seus dados</Text>
          <Text style={styles.cardSubtitle}>
            Use um e-mail que você acessa com frequência.
          </Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@email.com"
            placeholderTextColor="#9CA7AA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo de 6 caracteres"
            placeholderTextColor="#9CA7AA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.primary}
            onPress={handleRegister}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryText}>Criar conta</Text>
            <Text style={styles.primaryArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}> Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 22 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 38,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 23, color: colors.text },
  intro: { alignItems: "center", marginBottom: 25 },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.softAccent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconText: { fontSize: 28, color: colors.accent, fontWeight: "300" },
  title: {
    fontSize: 29,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.secondary,
    textAlign: "center",
    maxWidth: 335,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 23,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 21, fontWeight: "900", color: colors.text },
  cardSubtitle: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 5,
    marginBottom: 17,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginTop: 9,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.input,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  },
  primary: {
    marginTop: 14,
    backgroundColor: colors.accent,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryText: { color: "#FFF", fontSize: 15, fontWeight: "900" },
  primaryArrow: { color: "#FFF", fontSize: 22, fontWeight: "900" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  loginText: { color: colors.secondary, fontSize: 13 },
  loginLink: { color: colors.accent, fontSize: 13, fontWeight: "900" },
});
