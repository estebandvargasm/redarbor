import { useColorScheme } from 'react-native'
import { Tabs } from 'expo-router'
import Colors from '@/src/shared/theme/Colors'
import CustomTabBar from '@/src/shared/components/CustomTabBar'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
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
          title: 'Empleos',
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
        }}
      />
    </Tabs>
  )
}