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
import { entrar } from "../services/auth";

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

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Campos incompletos", "Preencha e-mail e senha.");
      return;
    }

    try {
      await entrar(email.trim(), password);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível entrar", "Confira seu e-mail e sua senha.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <BrandMark />
          <Text style={styles.kicker}>CUIDADO QUE CABE NA PALMA DA MÃO</Text>
        </View>

        <View style={styles.introduction}>
          <View style={styles.heartBadge}>
            <Text style={styles.heart}>♥</Text>
          </View>
          <Text style={styles.title}>Seu pet em boas mãos.</Text>
          <Text style={styles.subtitle}>
            Agende cuidados, acompanhe novidades e encontre produtos para o seu
            melhor amigo.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>
          <Text style={styles.cardSubtitle}>Acesse sua conta Pata & Cia.</Text>

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
            placeholder="Sua senha"
            placeholderTextColor="#9CA7AA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.primary}
            onPress={handleLogin}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryText}>Entrar</Text>
            <Text style={styles.primaryArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>ou</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => navigation.navigate("Cadastro")}
            activeOpacity={0.82}
          >
            <Text style={styles.secondaryText}>Criar uma conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Firebase Authentication • acesso seguro
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: "center", padding: 22 },
  brandBlock: { alignItems: "center", marginBottom: 30 },
  kicker: {
    marginTop: 12,
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  introduction: { alignItems: "center", marginBottom: 26 },
  heartBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.softAccent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  heart: { color: colors.accent, fontSize: 28 },
  title: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.7,
    textAlign: "center",
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 330,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 23,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: "900" },
  cardSubtitle: {
    color: colors.secondary,
    marginTop: 5,
    marginBottom: 20,
    fontSize: 13,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 9,
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
    marginBottom: 7,
  },
  primary: {
    marginTop: 14,
    backgroundColor: colors.text,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryText: { color: "#FFF", fontSize: 15, fontWeight: "900" },
  primaryArrow: { color: colors.accent, fontSize: 22, fontWeight: "900" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginVertical: 18,
  },
  line: { height: 1, flex: 1, backgroundColor: colors.border },
  or: { color: colors.secondary, fontSize: 12, fontWeight: "700" },
  secondary: {
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FCFBF8",
  },
  secondaryText: { color: colors.text, fontSize: 14, fontWeight: "800" },
  footer: {
    textAlign: "center",
    color: "#9BA3A4",
    fontSize: 11,
    marginTop: 17,
  },
});
