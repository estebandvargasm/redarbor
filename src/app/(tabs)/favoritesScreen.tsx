import { FlatList, StyleSheet, Text, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import { View } from '@/src/shared/components/Themed'
import Colors from '@/src/shared/theme/Colors'

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useJobsStore()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="heart-outline" size={72} color={colors.muted} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Sin favoritos aún</Text>
        <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
          Guarda empleos tocando el ícono del corazón{'\n'}y los verás aquí.
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Ionicons name="heart" size={14} color="#ef4444" />
            <Text style={[styles.headerText, { color: colors.muted }]}>
              {favorites.length} empleo{favorites.length === 1 ? '' : 's'} guardado{favorites.length === 1 ? '' : 's'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <JobListItem
            job={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
  },
})
