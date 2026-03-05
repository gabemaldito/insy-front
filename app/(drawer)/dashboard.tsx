import React, { useEffect, useRef } from "react";
import {
  DeviceEventEmitter,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Importa os nossos três super componentes criados na pasta components/
import { CommandCenterScreen } from "@/components/CommandCenter/CommandCenterScreen";
import { ProfileScreen } from "@/components/Profile/ProfileScreen";
import { VaultScreen } from "@/components/Vault/VaultScreen";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Escuta os gritos (eventos) disparados pelos botões da TopNavigation e do back button.
    const openVaultSub = DeviceEventEmitter.addListener("openVault", () => {
      // Vai pra tela 0 (Esquerda)
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    });

    const openCenterSub = DeviceEventEmitter.addListener("openCenter", () => {
      // Volta pra tela do meio (Dashboard)
      scrollRef.current?.scrollTo({ x: width, animated: true });
    });

    const openProfileSub = DeviceEventEmitter.addListener("openProfile", () => {
      // Vai pra tela 2 (Direita)
      scrollRef.current?.scrollTo({ x: width * 2, animated: true });
    });

    return () => {
      // Limpa pra não travar a memória quando fechar o app!
      openVaultSub.remove();
      openCenterSub.remove();
      openProfileSub.remove();
    };
  }, []);

  // 1. Criamos um "Registrador da posição do dedo", com Reanimated
  const scrollX = useSharedValue(width); // Começa na tela do meio (posição 'width')

  // 2. Manipulador Avançado do Movimento do Scroll
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Toda vez que você empurra a tela 1 milímetro que seja pro lado, salvamos aqui
      scrollX.value = event.contentOffset.x;
    },
  });

  // ========== 3. EFEITOS ESPECIAIS (Animações) ==========

  // Efeito Especial da Tela 1 (Vault)
  const vaultAnimatedStyle = useAnimatedStyle(() => {
    // Escala (cresce) quando o usuário desliza para x: 0 (posição da tela esquerda)
    const scale = interpolate(
      scrollX.value,
      [0, width, width * 2], // Qual a posição do dedo no Scroll?
      [1, 0.8, 0.8], // Qual tamanho Vault deve ter? 1 = Normal. 0.8 = Fica menor quando vc sai dele.
    );
    // Transforma um tiquinho transparente também
    const opacity = interpolate(scrollX.value, [0, width], [1, 0.3]);
    return { transform: [{ scale }], opacity };
  });

  // Efeito Especial da Tela 2 (Centro de Comando)
  const centerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [0, width, width * 2],
      [0.85, 1, 0.85], // Normal só quando está no exato meio. Menorzinho se vc for pra esquerda ou direita.
    );
    const opacity = interpolate(
      scrollX.value,
      [0, width, width * 2],
      [0.2, 1, 0.2],
    );
    return { transform: [{ scale }], opacity };
  });

  // Efeito Especial da Tela 3 (Profile)
  const profileAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, [width, width * 2], [0.8, 1]);
    const opacity = interpolate(scrollX.value, [width, width * 2], [0.3, 1]);
    return { transform: [{ scale }], opacity };
  });

  return (
    // 4. Transformar a ScrollView numa "Animated.ScrollView" para suportar magia
    <Animated.ScrollView
      ref={scrollRef as any}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      onScroll={scrollHandler} // Liga a escuta do dedo nela!
      scrollEventThrottle={16} // Capta o toque a 16 milissegundos (muito fluido)
      contentOffset={{ x: width, y: 0 }}
      style={styles.container}
    >
      {/* 5. APLICANDO A ANIMAÇÃO NAS CAIXAS (De View pra Animated.View) */}

      {/* Pagina 1: Esquerda - Vault */}
      <Animated.View style={[{ width }, vaultAnimatedStyle]}>
        <VaultScreen />
      </Animated.View>

      {/* Pagina 2: Meio - Dashboard */}
      <Animated.View style={[{ width }, centerAnimatedStyle]}>
        <CommandCenterScreen />
      </Animated.View>

      {/* Pagina 3: Direita - Configurações */}
      <Animated.View style={[{ width }, profileAnimatedStyle]}>
        <ProfileScreen />
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060608", // Cor escura raiz
  },
});
