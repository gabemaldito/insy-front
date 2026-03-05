import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";

// Importando os componentes
import { CommandCenterScreen } from "@/components/CommandCenter/CommandCenterScreen";
import { ProfileScreen } from "@/components/Profile/ProfileScreen";
import { VaultScreen } from "@/components/Vault/VaultScreen";

// 1. Criando os dois navegadores de Drawer independentes
const LeftDrawer = createDrawerNavigator();
const RightDrawer = createDrawerNavigator();

/**
 * 2. GAVETA DA ESQUERDA (Vault)
 * Esta gaveta envolve a Dashboard. Quando aberta pela esquerda, mostra o VaultScreen.
 */
function LeftDrawerNavigator() {
  return (
    <LeftDrawer.Navigator
      id="LeftDrawer" // <-- ID super importante para conseguirmos acessar de longe!
      drawerContent={() => <VaultScreen />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "left", // <-- Abre da Esquerda
        drawerStyle: {
          width: "85%", // Ocupa uma boa parte da tela, deixando um cantinho solto
          backgroundColor: "#060608",
        },
      }}
    >
      {/* O "Filho" da gaveta esquerda é a tela principal Dashboard (CommandCenter) */}
      <LeftDrawer.Screen name="CommandCenter" component={CommandCenterScreen} />
    </LeftDrawer.Navigator>
  );
}

/**
 * 3. GAVETA DA DIREITA (Profile)
 * Este é o Root da nossa tela "dashboard". Ele envolve TUDO (incluindo a Gaveta Esquerda e a Dashboard em si)
 */
export default function DashboardScreen() {
  return (
    <RightDrawer.Navigator
      id="RightDrawer" // <-- ID para acessarmos da TopNavigation
      drawerContent={() => <ProfileScreen />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right", // <-- Abre da Direita
        drawerStyle: {
          width: "85%",
          backgroundColor: "#060608",
        },
      }}
    >
      {/* O "Filho" da gaveta direita é TODA a infraestrutura da gaveta esquerda! (Nested Drawers) */}
      <RightDrawer.Screen
        name="LeftDrawerNavigator"
        component={LeftDrawerNavigator}
      />
    </RightDrawer.Navigator>
  );
}
