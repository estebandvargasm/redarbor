import { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useJobsStore()

  // 👇 efecto temporal para ver qué hay en AsyncStorage
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const raw = await AsyncStorage.getItem('jobs-store')
        console.log('jobs-store en AsyncStorage:', raw)
      } catch (e) {
        console.log('Error leyendo jobs-store desde AsyncStorage', e)
      }
    }
    checkStorage()
  }, [])

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No tienes empleos guardados en favoritos.</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
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