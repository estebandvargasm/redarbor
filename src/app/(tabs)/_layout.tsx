import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import Colors from '@/src/shared/theme/Colors'
import { useColorScheme } from '@/src/shared/components/useColorScheme'
import { useClientOnlyValue } from '@/src/shared/components/useClientOnlyValue'
import CustomTabBar from '@/src/shared/components/CustomTabBar'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),

        headerTintColor: colors.text,

        headerStyle: {
          backgroundColor: colors.background,
        },

        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trabajos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="briefcase-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favoritesScreen"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="heart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}