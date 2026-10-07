import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function BrandMark({ compact = false, dark = false }) {
  return (
    <View style={[styles.wrapper, compact && styles.wrapperSmall]}>
      <View style={[styles.symbol, compact && styles.symbolSmall]}>
        <Text style={[styles.heart, compact && styles.heartSmall]}>♥</Text>
        <View style={styles.paws}>
          <View style={styles.paw} />
          <View style={styles.paw} />
        </View>
      </View>

      <Text
        style={[
          styles.name,
          dark && styles.nameLight,
          compact && styles.nameSmall,
        ]}
      >
        Pata <Text style={styles.accent}>& Cia</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  wrapperSmall: { gap: 7 },
  symbol: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#21313A",
    alignItems: "center",
    justifyContent: "center",
  },
  symbolSmall: { width: 38, height: 38, borderRadius: 13 },
  heart: { fontSize: 25, color: "#E77832", lineHeight: 28 },
  heartSmall: { fontSize: 20, lineHeight: 23 },
  paws: { position: "absolute", bottom: 7, flexDirection: "row", gap: 3 },
  paw: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#FFF8EF" },
  name: {
    fontSize: 24,
    fontWeight: "900",
    color: "#21313A",
    letterSpacing: -0.7,
  },
  nameLight: { color: "#FFF" },
  nameSmall: { fontSize: 18 },
  accent: { color: "#E77832" },
});
