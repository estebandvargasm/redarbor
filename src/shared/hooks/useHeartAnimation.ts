import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

export function useHeartAnimation() {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const play = () => {
    scale.value = withSpring(0.4, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 6 })
    })
  }

  return { animatedStyle, play }
}
