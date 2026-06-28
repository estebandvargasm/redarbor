import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'
import { Text, View } from '@/src/shared/components/Themed'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import Colors from '@/src/shared/theme/Colors'

function wrapHtml(html: string, dark: boolean): string {
  const bg = dark ? '#12121f' : '#f5f6fa'
  const text = dark ? '#d1d3db' : '#3d3f4e'
  const link = dark ? '#6b8fff' : '#3b6df0'
  const cardBg = dark ? '#1a1a2e' : '#ffffff'

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
  body {
    margin: 0;
    padding: 10px;
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: ${text};
    background: ${cardBg};
  }
  strong, b { font-weight: 600; }
  em, i { font-style: italic; }
  a { color: ${link}; text-decoration: underline; }
  ul, ol { padding-left: 20px; margin: 8px 0; }
  li { margin-bottom: 4px; }
  p { margin: 0 0 10px 0; }
  h1, h2, h3, h4, h5, h6 { font-weight: 600; margin: 14px 0 8px 0; }
  h1 { font-size: 1.4em; } h2 { font-size: 1.25em; } h3 { font-size: 1.15em; }
  img { display: none; }
</style>
<script>
  window.onload = function() {
    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
  };
  window.onresize = function() {
    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
  };
</script>
</head>
<body>${html}</body>
</html>`
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const jobs = useJobsStore((s) => s.jobs)
  const favorites = useJobsStore((s) => s.favorites)
  const toggleFavorite = useJobsStore((s) => s.toggleFavorite)
  const isFavorite = useJobsStore((s) => s.isFavorite)

  const jobId = Number(id)
  const job = [...favorites, ...jobs].find((j) => j.id === jobId)
  const [webHeight, setWebHeight] = useState(400)

  if (!job) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Empleo',
            headerTintColor: colors.text,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          }}
        />
        <Ionicons name="alert-circle-outline" size={48} color={colors.muted} />
        <Text style={[styles.notFoundText, { color: colors.muted }]}>No se encontró el empleo solicitado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const fav = isFavorite(job.id)

  const handleApply = () => {
    WebBrowser.openBrowserAsync(job.applyUrl)
  }

  const handleShare = () => {
    Share.share({
      message: `${job.title} en ${job.companyName}\n${job.applyUrl}`,
    })
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: job.companyName,
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontWeight: '700', fontSize: 20 },
        }}
      />

      <View style={styles.header}>
        {job.companyLogoUrl ? (
          <Image source={{ uri: job.companyLogoUrl }} style={styles.logo} />
        ) : (
          <View style={[styles.logoPlaceholder, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="business-outline" size={36} color={colors.muted} />
          </View>
        )}

        <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
        <Text style={styles.companyName}>{job.companyName}</Text>
      </View>

      <View style={styles.chipsRow}>
        <View style={[styles.chip, { backgroundColor: colors.card }]}>
          <Ionicons name="location-outline" size={14} color={colors.tint} />
          <Text style={[styles.chipText, { color: colors.muted }]}>{job.candidateLocation}</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: colors.card }]}>
          <Ionicons name="time-outline" size={14} color={colors.tint} />
          <Text style={[styles.chipText, { color: colors.muted }]}>
            {new Date(job.publicationDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.chip, { backgroundColor: colors.card }]}>
          <Ionicons name="pricetag-outline" size={14} color={colors.tint} />
          <Text style={[styles.chipText, { color: colors.muted }]}>{job.category}</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: colors.card }]}>
          <Ionicons name="briefcase-outline" size={14} color={colors.tint} />
          <Text style={[styles.chipText, { color: colors.muted }]}>{job.jobType}</Text>
        </View>
      </View>

      {job.tags && job.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {job.tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {job.salary ? (
        <View style={[styles.salaryCard, { backgroundColor: colors.card }]}>
          <Ionicons name="cash-outline" size={24} color={colors.success} />
          <View style={styles.salaryTextCol} lightColor={colors.card} darkColor={colors.card}>
            <Text style={styles.salaryLabel}>Salario</Text>
            <Text style={[styles.salaryValue, { color: colors.text }]}>{job.salary}</Text>
          </View>
        </View>
      ) : null}

      <View style={[styles.descriptionCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Descripción</Text>
        <WebView
          style={[styles.webview, { height: webHeight }]}
          source={{ html: wrapHtml(job.descriptionHtml, colorScheme === 'dark') }}
          scrollEnabled={false}
          originWhitelist={['*']}
          onMessage={(e) => {
            const h = Number(e.nativeEvent.data)
            if (h > 0) setWebHeight(h)
          }}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.85}>
          <Ionicons name="open-outline" size={20} color="#fff" />
          <Text style={styles.applyButtonText}>Aplicar ahora</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={() => toggleFavorite(job)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={24}
              color={fav ? colors.danger : colors.muted}
            />
            <Text style={[styles.iconButtonText, fav ? { color: colors.danger } : { color: colors.muted }]}>
              {fav ? 'Guardado' : 'Favorito'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={24} color={colors.muted} />
            <Text style={[styles.iconButtonText, { color: colors.muted }]}>Compartir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  notFoundText: {
    fontSize: 15,
    textAlign: 'center',
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#3b6df0',
    borderRadius: 10,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b6df0',
    textAlign: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 6,
  },
  tagChip: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#3b6df0',
    fontWeight: '500',
  },
  salaryCard: {
    marginHorizontal: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    padding: 18,
  },
  salaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22c55e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  salaryTextCol: {
    flex: 1,
  },
  salaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  descriptionCard: {
    margin: 12,
    borderRadius: 14,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  webview: {
    backgroundColor: 'transparent',
  },
  actions: {
    padding: 12,
    gap: 10,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b6df0',
    paddingVertical: 16,
    borderRadius: 14,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  iconButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
})
