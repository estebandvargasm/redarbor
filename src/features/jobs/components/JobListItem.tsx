import { router } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useHeartAnimation } from '@/src/shared/hooks/useHeartAnimation'
import { Ionicons } from '@expo/vector-icons'
import type { JobItem } from '../types/job'
import Colors from '@/src/shared/theme/Colors'

type Props = {
  job: JobItem
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function JobListItem({ job, isFavorite, onToggleFavorite }: Props) {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const { animatedStyle: animatedHeart, play: playHeart } = useHeartAnimation()

  const handleToggleFavorite = () => {
    playHeart()
    onToggleFavorite?.()
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
    >
      <View style={styles.cardInner}>
        {job.companyLogoUrl ? (
          <Image source={{ uri: job.companyLogoUrl }} style={styles.logo} />
        ) : (
          <View style={[styles.logoPlaceholder, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="business-outline" size={22} color={colors.muted} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{job.title}</Text>
          <Text style={[styles.company, { color: colors.tint }]} numberOfLines={1}>{job.companyName}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={11} color={colors.muted} />
            <Text style={[styles.location, { color: colors.muted }]} numberOfLines={1}>{job.candidateLocation}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={11} color={colors.muted} />
            <Text style={[styles.date, { color: colors.muted }]}>
              {job.category} • {job.jobType} • {new Date(job.publicationDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View style={animatedHeart}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.danger : colors.muted}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 5,
    borderRadius: 14,
  },
  cardInner: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'flex-start',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 14,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
  },
  company: {
    fontSize: 13,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  location: {
    fontSize: 12,
    flex: 1,
  },
  date: {
    fontSize: 11,
    flex: 1,
  },
  favoriteButton: {
    paddingLeft: 10,
    paddingTop: 2,
  },
})
