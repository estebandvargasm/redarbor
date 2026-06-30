import React, { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
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

  const translateX = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)
  const tabPositions = useRef<Array<{ x: number; width: number }>>([])
  const [layoutVersion, setLayoutVersion] = useState(0)

  useEffect(() => {
    const pos = tabPositions.current[state.index]
    if (!pos) return
    translateX.value = withSpring(pos.x, { damping: 20, stiffness: 200, mass: 0.8 })
    indicatorWidth.value = withSpring(pos.width, { damping: 20, stiffness: 200, mass: 0.8 })
  }, [state.index, layoutVersion])

  const indicatorStyle = useAnimatedStyle(() => ({
    left: translateX.value,
    width: indicatorWidth.value,
  }))

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 16 }]}>
      <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: isDark ? colors.inputBg : colors.background },
          ]}
        />
        {state.routes.map((route, index) => {
          const focused = state.index === index
          const { options } = descriptors[route.key]

          const label = (options.tabBarLabel as string) ?? options.title ?? route.name

          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse'

          switch (route.name) {
            case 'index':
              iconName = focused ? 'briefcase' : 'briefcase-outline'
              break
            case 'favoritesScreen':
              iconName = focused ? 'heart' : 'heart-outline'
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

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLayout={(e) => {
                tabPositions.current[index] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                }
                setLayoutVersion((v) => v + 1)
              }}
              style={styles.tab}
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
  indicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    borderRadius: 999,
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
