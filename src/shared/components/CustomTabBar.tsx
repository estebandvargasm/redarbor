import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Colors from '@/src/shared/theme/Colors'
import { useColorScheme } from '@/src/shared/components/useColorScheme'

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const isDark = colorScheme === 'dark'

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
            backgroundColor: isDark
              ? '#1a1a2e'
              : '#ffffff',

            borderColor: isDark
              ? 'rgba(255,255,255,.08)'
              : '#e5e7eb',
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
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,.12)'
                    : '#FFFFFF',
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={
                  focused
                    ? '#2563EB'
                    : isDark
                    ? 'rgba(255,255,255,.55)'
                    : 'rgba(0,0,0,.45)'
                }
              />

              <TextLabel
                text={label}
                focused={focused}
                dark={isDark}
              />
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function TextLabel({
  text,
  focused,
  dark,
}: {
  text: string
  focused: boolean
  dark: boolean
}) {
  return (
    <View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: focused
            ? '#2563EB'
            : dark
            ? 'rgba(255,255,255,.55)'
            : 'rgba(0,0,0,.45)',
        }}
      >
        {text}
      </Text>
    </View>
  )
}

import { Text } from 'react-native'

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