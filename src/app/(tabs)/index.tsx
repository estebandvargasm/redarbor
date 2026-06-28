import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import FilterDropdown from '@/src/shared/components/FilterDropdown'
import Colors from '@/src/shared/theme/Colors'

export default function JobsListScreen() {
  const { jobs, categories, status, error, loadJobs, loadCategories, toggleFavorite, isFavorite } =
    useJobsStore()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  useEffect(() => {
    loadJobs()
    loadCategories()
  }, [loadJobs, loadCategories])

  const jobTypes = useMemo(
    () => [...new Set(jobs.map((j) => j.jobType))].sort(),
    [jobs],
  )

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return jobs.filter((job) => {
      if (query && !job.title.toLowerCase().includes(query) && !job.companyName.toLowerCase().includes(query)) {
        return false
      }
      if (categoryFilter && job.category !== categoryFilter) return false
      if (typeFilter && job.jobType !== typeFilter) return false
      return true
    })
  }, [jobs, searchQuery, categoryFilter, typeFilter])

  if (status === 'loading' && jobs.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.centeredText, { color: colors.muted }]}>Cargando empleos...</Text>
      </View>
    )
  }

  if (status === 'error') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.muted} />
        <Text style={[styles.centeredText, { color: colors.muted }]}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search-outline" size={18} color={colors.muted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar por título o empresa..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filters}>
        <FilterDropdown
          label="Categoría"
          options={categories}
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />
        <FilterDropdown
          label="Tipo de trabajo"
          options={jobTypes}
          selected={typeFilter}
          onSelect={setTypeFilter}
        />
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={loadJobs}
        refreshing={status === 'loading'}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={56} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {searchQuery || categoryFilter || typeFilter
                ? 'No se encontraron empleos con los filtros seleccionados.'
                : 'No hay empleos disponibles en este momento.'}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  centeredText: {
    fontSize: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
})
