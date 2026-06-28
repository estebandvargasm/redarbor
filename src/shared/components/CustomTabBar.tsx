import React from 'react'
import { View, Pressable, Text, StyleSheet, useColorScheme } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '@/src/shared/theme/Colors'

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[colorScheme ?? 'light']

  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + 16,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index

          const { options } = descriptors[route.key]

          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name

          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse'

          switch (route.name) {
            case 'index':
              iconName = focused
                ? 'briefcase'
                : 'briefcase-outline'
              break

            case 'favoritesScreen':
              iconName = focused
                ? 'heart'
                : 'heart-outline'
              break
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tab,
                focused && {
                  backgroundColor: isDark ? '#ffffff12' : '#FFFFFF',
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={focused ? colors.tint : colors.tabIconDefault}
              />

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: focused ? colors.tint : colors.tabIconDefault,
                }}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  container: {
    flexDirection: 'row',

    borderRadius: 999,

    borderWidth: 1,

    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 999,

    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
})