import { VaultScreen } from "@/components/Vault/VaultScreen";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={() => <VaultScreen />}
    >
      {/* Tela principal do app; a gaveta lateral mostra o Vault */}
      <Drawer.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
    </Drawer>
  );
}
