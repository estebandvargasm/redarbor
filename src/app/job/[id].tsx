import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { useState } from 'react'
import Animated from 'react-native-reanimated'
import { useHeartAnimation } from '@/src/shared/hooks/useHeartAnimation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import Colors from '@/src/shared/theme/Colors'

function wrapHtml(html: string, dark: boolean): string {
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
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const jobs = useJobsStore((s) => s.jobs)
  const favorites = useJobsStore((s) => s.favorites)
  const toggleFavorite = useJobsStore((s) => s.toggleFavorite)
  const isFavorite = useJobsStore((s) => s.isFavorite)

  const jobId = Number(id)
  const job = [...favorites, ...jobs].find((j) => j.id === jobId)
  const [webHeight, setWebHeight] = useState(400)

  const { animatedStyle: animatedHeart, play: playHeart } = useHeartAnimation()

  const handleToggleFavorite = () => {
    playHeart()
    if (job) toggleFavorite(job)
  }

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
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.tint }]}>
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: job.companyName,
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={{ marginRight: 16 }} activeOpacity={0.7}>
              <Ionicons name="share-social-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          {job.companyLogoUrl ? (
            <Image source={{ uri: job.companyLogoUrl }} style={styles.logo} />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="business-outline" size={36} color={colors.muted} />
            </View>
          )}

          <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
          <Text style={[styles.companyName, { color: colors.tint }]}>{job.companyName}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.tint} />
            <Text style={[styles.infoText, { color: colors.text }]}>{job.candidateLocation}</Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={18} color={colors.tint} />
            <Text style={[styles.infoText, { color: colors.text }]}>{job.jobType}</Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={18} color={colors.tint} />
            <Text style={[styles.infoText, { color: colors.text }]}>{job.category}</Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={colors.tint} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              {new Date(job.publicationDate).toLocaleDateString()}
            </Text>
          </View>
          {job.salary ? (
            <>
              <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={18} color={colors.tint} />
                <Text style={[styles.infoText, { color: colors.text }]}>{job.salary}</Text>
              </View>
            </>
          ) : null}
        </View>

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

        {job.tags && job.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {job.tags.map((tag) => (
              <View key={tag} style={[styles.tagChip, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.tagText, { color: colors.tint }]}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom || 12 }]}>
        <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.tint }]} onPress={handleApply} activeOpacity={0.85}>
          <Text style={styles.applyButtonText}>Aplicar ahora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.favButton, { backgroundColor: colors.inputBg }]}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Animated.View style={animatedHeart}>
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={24}
              color={fav ? colors.danger : colors.muted}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    textAlign: 'center',
  },
  infoCard: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 14,
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  infoDivider: {
    height: 1,
    marginHorizontal: 14,
  },
  infoText: {
    fontSize: 14,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
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
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  favButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
