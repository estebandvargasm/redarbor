import { FlatList, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import { Text, View } from '@/src/shared/components/Themed'
import Colors from '@/src/shared/theme/Colors'
import { useColorScheme } from '@/src/shared/components/useColorScheme'

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useJobsStore()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={72} color="#d0d3dc" />
        <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
        <Text style={styles.emptySubtitle}>
          Guarda empleos tocando el ícono del corazón{'\n'}y los verás aquí.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Ionicons name="heart" size={14} color="#ef4444" />
            <Text style={styles.headerText}>
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
    backgroundColor: '#f5f6fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f6fa',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#8e92a2',
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
    color: '#8e92a2',
  },
})
