import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 1. DADOS DE TESTE (Mock)
// Usamos isso só pra gente testar o layout sem precisar de um banco de dados real ainda.
const TRANSCRICOES = [
  {
    id: "1",
    titulo: "Reunião de Alinhamento - Q3",
    resumo:
      "Discussão sobre metas do trimestre, novos contratados e orçamento de marketing.",
    data: "Hoje",
  },
  {
    id: "2",
    titulo: "Ideias de Conteúdo para o App",
    resumo:
      "Insights rápidos sobre a criação do módulo de onboarding e paleta de cores e fluxo de navegação.",
    data: "Ontem",
  },
  {
    id: "3",
    titulo: "Resumo do Livro: Hábitos Atômicos",
    resumo:
      "Como pequenas mudanças podem gerar resultados extraordinários a longo prazo.",
    data: "22 Fev",
  },
];

import { DeviceEventEmitter } from "react-native"; // Import necessário
// ...
export const VaultScreen = () => {
  const insets = useSafeAreaInsets(); // Pra não ficar embaixo da barra de bateria do iPhone/Android

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      {/* 3. CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          // Volta pra tela do Dashboard pelo ScrollView mandando o evento!
          onPress={() => DeviceEventEmitter.emit("openCenter")}
          style={styles.backButton}
        >
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vault</Text>
      </View>
      <Text style={styles.subtitle}>Suas ideias e anotações transcritas</Text>

      {/* 4. LISTA DE CARDS */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {TRANSCRICOES.map((item) => (
          // Usamos 'TouchableOpacity' pro card inteiro ficar clicável depois
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDate}>{item.data}</Text>
            </View>
            {/* numberOfLines={2} faz com que resumos longos ganhem "..." no final da 2ª linha */}
            <Text style={styles.cardSummary} numberOfLines={2}>
              {item.resumo}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// 5. O ESTILO (TEMA RAYCAST)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060608", // Cor escura principal (Tema Raycast)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // Compensar o padding pra alinhar certinho
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800", // Bem cheinho, robusto
    color: "#ffffff",
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.45)", // Cinza estiloso
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12, // Maravilha do React Native novo: cria o teto/piso entre os cards automaticamente
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.04)", // Fundo cinza super levinho quase invisível
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)", // Bordinha super premium
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff", // Título do card em branco puro
    flex: 1,
    marginRight: 12,
  },
  cardDate: {
    fontSize: 12,
    color: "#ff1f3d", // Vermelho "Danger/Accent" que você ama
    fontWeight: "500",
  },
  cardSummary: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.35)", // Resumo bem escurecido pra dar contraste com o título
    lineHeight: 20, // Altura da linha um pouco maior pra facilitar leitura
  },
});
