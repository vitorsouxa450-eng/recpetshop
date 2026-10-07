import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BrandMark } from "../components/BrandMark";
import { auth } from "../firebase/firebase";
import { sair } from "../services/auth";

const colors = {
  background: "#F7F3EC",
  white: "#FFFFFF",
  text: "#21313A",
  secondary: "#6E7B80",
  accent: "#E77832",
  border: "#E5DED4",
  orangeSoft: "#FDE7D6",
  blueSoft: "#E8EFF5",
  greenSoft: "#E8F0E7",
  lilacSoft: "#EFEAF3",
  red: "#C75A4A",
};

const services = [
  {
    id: "Banho",
    icon: "✦",
    title: "Agende o banho",
    desc: "Higiene, conforto e aquele cheirinho bom.",
    tone: "orange",
  },
  {
    id: "Tosa",
    icon: "⌁",
    title: "Agende a tosa",
    desc: "Um visual bonito, leve e confortável.",
    tone: "blue",
  },
  {
    id: "Consulta",
    icon: "+",
    title: "Agende a consulta",
    desc: "Cuidados de saúde no momento certo.",
    tone: "green",
  },
];

const products = [
  {
    name: "Petisco Natural",
    desc: "Petisco saboroso para cães.",
    price: "R$ 19,90",
    icon: "●",
  },
  {
    name: "Ração Premium",
    desc: "Alimentação completa e balanceada.",
    price: "R$ 89,90",
    icon: "▣",
  },
  {
    name: "Brinquedo para Pets",
    desc: "Diversão para seu melhor amigo.",
    price: "R$ 29,90",
    icon: "◆",
  },
  {
    name: "Shampoo Pet",
    desc: "Higiene e cuidado para os pelos.",
    price: "R$ 34,90",
    icon: "✦",
  },
];

export default function Home({ navigation }) {
  const [tab, setTab] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [petName, setPetName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [alerts, setAlerts] = useState([]);

  const email = auth.currentUser?.email || "Usuário";
  const rawName = (email.split("@")[0] || "amigo").replace(/[._-]+/g, " ");
  const firstName = rawName.split(" ")[0];
  const displayName = rawName.replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );

  useEffect(() => {
    if (Platform.OS === "web") return;

    const prepareNotifications = async () => {
      try {
        const Notifications = await import("expo-notifications");
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("petamigo", {
            name: "Pata & Cia",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
          });
        }

        const permission = await Notifications.getPermissionsAsync();
        if (permission.status !== "granted") {
          await Notifications.requestPermissionsAsync();
        }
      } catch (error) {
        console.warn("Notificações do sistema indisponíveis neste ambiente.", error?.message || error);
      }
    };

    prepareNotifications();
  }, []);

  const addAlert = (title, message) => {
    setAlerts((current) => [
      {
        id: Date.now().toString(),
        title,
        message,
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...current,
    ]);
  };

  const sendNotification = async (title, message) => {
    addAlert(title, message);

    if (Platform.OS === "web") return;

    try {
      const Notifications = await import("expo-notifications");
      await Notifications.scheduleNotificationAsync({
        content: { title, body: message, sound: true },
        trigger: null,
      });
    } catch (error) {
      console.warn("A notificação foi adicionada à lista do aplicativo, mas o sistema não está disponível neste ambiente.", error?.message || error);
    }
  };

  const chooseService = (service) => setSelectedService(service);

  const scheduleService = async () => {
    if (!petName.trim() || !date.trim() || !time.trim()) {
      Alert.alert(
        "Campos incompletos",
        "Preencha o nome do pet, a data e o horário.",
      );
      return;
    }

    await sendNotification(
      "Agendamento confirmado",
      `Seu ${selectedService.toLowerCase()} para ${petName} foi agendado para ${date} às ${time}.`,
    );

    Alert.alert(
      "Agendamento realizado",
      "Seu horário foi registrado com sucesso.",
    );
    setPetName("");
    setDate("");
    setTime("");
    setSelectedService(null);
    setTab("notificacoes");
  };

  const buyProduct = async (product) => {
    await sendNotification(
      "Compra registrada",
      `${product.name} — ${product.price} foi adicionado à sua compra.`,
    );
    Alert.alert("Compra registrada", `Você selecionou ${product.name}.`);
    setTab("notificacoes");
  };

  const handleLogout = async () => {
    try {
      await sair();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  const ServiceCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.service, styles[`service${item.tone}`]]}
      onPress={() => chooseService(item.id)}
      activeOpacity={0.84}
    >
      <View style={styles.serviceTop}>
        <View style={styles.serviceIcon}>
          <Text style={styles.serviceIconText}>{item.icon}</Text>
        </View>
        <Text style={styles.arrow}>↗</Text>
      </View>
      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Text style={styles.serviceDesc}>{item.desc}</Text>
      <Text style={styles.serviceLink}>Agendar</Text>
    </TouchableOpacity>
  );

  const HomeTab = () => (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.overline}>PATA & CIA / INÍCIO</Text>
          <Text style={styles.heading}>Olá, {firstName}.</Text>
          <Text style={styles.subheading}>
            Vamos cuidar de quem está sempre com você.
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.brandStrip}>
        <BrandMark compact dark />
        <Text style={styles.brandStripText}>Cuidado em todas as fases.</Text>
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerLabel}>AGENDE SEM COMPLICAÇÃO</Text>
          <Text style={styles.bannerTitle}>Um app, todos os cuidados.</Text>
          <Text style={styles.bannerSub}>
            Banho, tosa, consulta e produtos para o seu pet.
          </Text>
        </View>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerHeart}>♥</Text>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Serviços</Text>
        <Text style={styles.sectionHint}>Escolha um cuidado</Text>
      </View>

      <View style={styles.grid}>
        {services.map((item) => (
          <ServiceCard item={item} key={item.id} />
        ))}

        <TouchableOpacity
          style={[styles.service, styles.serviceLilac]}
          onPress={() => setTab("produtos")}
          activeOpacity={0.84}
        >
          <View style={styles.serviceTop}>
            <View style={styles.serviceIcon}>
              <Text style={styles.serviceIconText}>▣</Text>
            </View>
            <Text style={styles.arrow}>↗</Text>
          </View>
          <Text style={styles.serviceTitle}>Compre produtos</Text>
          <Text style={styles.serviceDesc}>
            Rações, higiene, brinquedos e mais.
          </Text>
          <Text style={styles.serviceLink}>Ver loja</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.accountBar}>
        <View>
          <Text style={styles.accountLabel}>CONTA CONECTADA</Text>
          <Text style={styles.accountEmail}>{email}</Text>
        </View>
        <Text style={styles.accountDot}>●</Text>
      </View>
    </ScrollView>
  );

  const BookingTab = () => {
    const icons = { Banho: "✦", Tosa: "⌁", Consulta: "+" };

    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          onPress={() => setSelectedService(null)}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.pageIntro}>
          <View style={styles.pageIcon}>
            <Text style={styles.pageIconText}>{icons[selectedService]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Agendar {selectedService}</Text>
            <Text style={styles.pageSubtitle}>
              Escolha um horário para seu pet.
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Nome do pet</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Thor"
          placeholderTextColor="#9CA7AA"
          value={petName}
          onChangeText={setPetName}
        />

        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 10/10/2026"
          placeholderTextColor="#9CA7AA"
          value={date}
          onChangeText={setDate}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Horário</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 14:00"
          placeholderTextColor="#9CA7AA"
          value={time}
          onChangeText={setTime}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>RESUMO DO PEDIDO</Text>
          <Text style={styles.summaryText}>
            Serviço <Text style={styles.summaryStrong}>{selectedService}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Pet{" "}
            <Text style={styles.summaryStrong}>
              {petName || "Não informado"}
            </Text>
          </Text>
          <Text style={styles.summaryText}>
            Data{" "}
            <Text style={styles.summaryStrong}>{date || "Não informada"}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Horário{" "}
            <Text style={styles.summaryStrong}>{time || "Não informado"}</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={scheduleService}
          activeOpacity={0.84}
        >
          <Text style={styles.confirmText}>Confirmar agendamento</Text>
          <Text style={styles.confirmArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const ProductsTab = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <TouchableOpacity
        onPress={() => setTab("home")}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Loja Pata & Cia</Text>
      <Text style={styles.pageSubtitle}>
        Produtos escolhidos para facilitar a rotina de cuidado.
      </Text>

      {products.map((product) => (
        <View style={styles.product} key={product.name}>
          <View style={styles.productIcon}>
            <Text style={styles.productIconText}>{product.icon}</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDesc}>{product.desc}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => buyProduct(product)}
            >
              <Text style={styles.buyText}>Comprar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const NotificationsTab = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.pageTop}>
        <Text style={styles.overline}>ATIVIDADE</Text>
        <Text style={styles.pageTitle}>Notificações</Text>
        <Text style={styles.pageSubtitle}>
          Agendamentos e compras recentes aparecem aqui.
        </Text>
      </View>

      <View style={styles.notificationSummary}>
        <Text style={styles.notificationNumber}>{alerts.length}</Text>
        <View>
          <Text style={styles.notificationSummaryTitle}>novidade(s)</Text>
          <Text style={styles.notificationSummaryText}>
            registrada(s) nesta sessão
          </Text>
        </View>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyBell}>○</Text>
          </View>
          <Text style={styles.emptyTitle}>Nada novo por aqui</Text>
          <Text style={styles.emptyText}>
            Quando você fizer um agendamento ou compra, o registro aparecerá
            nesta tela.
          </Text>
        </View>
      ) : (
        alerts.map((item) => (
          <View style={styles.notification} key={item.id}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationIconText}>
                {item.title.includes("Compra") ? "▣" : "✓"}
              </Text>
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationTime}>Hoje às {item.time}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const ProfileTab = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>Meu perfil</Text>
      <Text style={styles.pageSubtitle}>
        Dados de acesso e sua conta Pata & Cia.
      </Text>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{displayName}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.profileInfoTitle}>Conta Pata & Cia</Text>
        <Text style={styles.profileInfoText}>
          Use o app para agendar serviços, comprar produtos e receber
          notificações.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
        activeOpacity={0.84}
      >
        <Text style={styles.logoutText}>Sair da conta</Text>
        <Text style={styles.logoutArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTab = () => {
    if (selectedService) return <BookingTab />;
    if (tab === "produtos") return <ProductsTab />;
    if (tab === "notificacoes") return <NotificationsTab />;
    if (tab === "perfil") return <ProfileTab />;
    return <HomeTab />;
  };

  const NavItem = ({ id, label, icon }) => {
    const active = tab === id;

    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setTab(id)}
        activeOpacity={0.8}
      >
        <View style={[styles.navIcon, active && styles.navIconActive]}>
          <Text
            style={[styles.navIconText, active && styles.navIconTextActive]}
          >
            {icon}
          </Text>
          {id === "notificacoes" && alerts.length > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{alerts.length}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.navLabel, active && styles.navLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderTab()}</View>
      {!selectedService ? (
        <View style={styles.bottomNav}>
          <NavItem id="home" label="Home" icon="⌂" />
          <NavItem id="notificacoes" label="Notificações" icon="◔" />
          <NavItem id="perfil" label="Perfil" icon="○" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  headerText: { flex: 1 },
  overline: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: colors.accent,
    marginBottom: 6,
  },
  heading: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.8,
    color: colors.text,
  },
  subheading: {
    fontSize: 14,
    color: colors.secondary,
    lineHeight: 20,
    marginTop: 5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  avatarText: { color: "#FFF", fontSize: 19, fontWeight: "900" },
  brandStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.text,
    borderRadius: 18,
    padding: 12,
    paddingRight: 15,
    marginBottom: 12,
  },
  brandStripText: { color: "#D9E0E2", fontSize: 12, fontWeight: "700" },
  banner: {
    borderRadius: 24,
    backgroundColor: colors.accent,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  bannerCopy: { flex: 1 },
  bannerLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#FFF0E5",
    marginBottom: 7,
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 27,
    maxWidth: 250,
  },
  bannerSub: {
    color: "#FFF3EA",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    maxWidth: 245,
  },
  bannerBadge: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "#FBE6D6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  bannerHeart: { color: colors.accent, fontSize: 36 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: "900" },
  sectionHint: { color: colors.secondary, fontSize: 12, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  service: {
    width: "48.2%",
    minHeight: 188,
    borderRadius: 20,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
  },
  serviceorange: { backgroundColor: colors.orangeSoft, borderColor: "#F5C4A1" },
  serviceblue: { backgroundColor: colors.blueSoft, borderColor: "#C9D8E5" },
  servicegreen: { backgroundColor: colors.greenSoft, borderColor: "#C9D8C8" },
  serviceLilac: { backgroundColor: colors.lilacSoft, borderColor: "#DBD0E4" },
  serviceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  serviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIconText: { fontSize: 23, color: colors.text, fontWeight: "900" },
  arrow: { fontSize: 18, color: colors.text, fontWeight: "900" },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    lineHeight: 20,
  },
  serviceDesc: {
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 17,
    marginTop: 7,
    flex: 1,
  },
  serviceLink: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "900",
    marginTop: 11,
  },
  accountBar: {
    marginTop: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountLabel: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  accountEmail: { color: colors.text, fontSize: 12, marginTop: 4 },
  accountDot: { color: "#7FA17D", fontSize: 12 },
  backButton: { marginBottom: 22 },
  backText: { color: colors.accent, fontSize: 14, fontWeight: "900" },
  pageIntro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 20,
  },
  pageIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  pageIconText: { fontSize: 25, color: colors.accent, fontWeight: "900" },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.7,
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.secondary,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
    marginTop: 7,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 9,
  },
  summary: {
    backgroundColor: colors.text,
    borderRadius: 19,
    padding: 17,
    marginVertical: 9,
  },
  summaryTitle: {
    color: "#DCE4E7",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 11,
  },
  summaryText: { color: "#CBD5D9", fontSize: 13, marginBottom: 6 },
  summaryStrong: { color: "#FFF", fontWeight: "900" },
  confirmButton: {
    backgroundColor: colors.accent,
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 9,
  },
  confirmText: { color: "#FFF", fontSize: 15, fontWeight: "900" },
  confirmArrow: { color: "#FFF", fontSize: 21, fontWeight: "900" },
  product: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    marginBottom: 12,
  },
  productIcon: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  productIconText: { fontSize: 26, color: colors.text, fontWeight: "900" },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "900", color: colors.text },
  productDesc: {
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 17,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.accent,
    marginTop: 7,
  },
  buyButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: colors.text,
    borderRadius: 11,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  buyText: { color: "#FFF", fontSize: 12, fontWeight: "900" },
  pageTop: { marginBottom: 2 },
  notificationSummary: {
    backgroundColor: colors.text,
    borderRadius: 19,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  notificationNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.accent,
    marginRight: 12,
  },
  notificationSummaryTitle: { color: "#FFF", fontSize: 15, fontWeight: "900" },
  notificationSummaryText: { color: "#BAC6CA", fontSize: 11, marginTop: 3 },
  empty: { alignItems: "center", paddingTop: 55, paddingHorizontal: 28 },
  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  emptyBell: { fontSize: 38, color: colors.accent },
  emptyTitle: { fontSize: 17, fontWeight: "900", color: colors.text },
  emptyText: {
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },
  notification: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    marginBottom: 10,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  notificationIconText: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: "900",
  },
  notificationContent: { flex: 1 },
  notificationTitle: { fontSize: 14, fontWeight: "900", color: colors.text },
  notificationMessage: {
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 17,
    marginTop: 4,
  },
  notificationTime: { fontSize: 10, color: "#9AA3A5", marginTop: 7 },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    alignItems: "center",
    marginBottom: 13,
  },
  profileAvatar: {
    width: 84,
    height: 84,
    borderRadius: 27,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileInitial: { fontSize: 34, color: "#FFF", fontWeight: "900" },
  profileName: { fontSize: 21, color: colors.text, fontWeight: "900" },
  profileEmail: { fontSize: 13, color: colors.secondary, marginTop: 4 },
  profileInfo: {
    backgroundColor: colors.greenSoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#C9D8C8",
    padding: 16,
    marginBottom: 15,
  },
  profileInfoTitle: { fontSize: 13, color: colors.text, fontWeight: "900" },
  profileInfoText: {
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 18,
    marginTop: 5,
  },
  logout: {
    borderWidth: 1,
    borderColor: "#E6B7AE",
    backgroundColor: "#FFF9F8",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutText: { color: colors.red, fontSize: 14, fontWeight: "900" },
  logoutArrow: { fontSize: 20, color: colors.red },
  bottomNav: {
    height: 74,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 5,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navIcon: {
    width: 42,
    height: 32,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navIconActive: { backgroundColor: colors.orangeSoft },
  navIconText: { color: "#8E999C", fontSize: 20, fontWeight: "700" },
  navIconTextActive: { color: colors.accent },
  navLabel: { fontSize: 10, color: "#899397", fontWeight: "700", marginTop: 2 },
  navLabelActive: { color: colors.text, fontWeight: "900" },
  badge: {
    position: "absolute",
    right: -1,
    top: -4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#FFF", fontSize: 9, fontWeight: "900" },
});
