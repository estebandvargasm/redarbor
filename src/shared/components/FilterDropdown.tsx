import { useState } from 'react'
import { Modal, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/src/shared/theme/Colors'

interface FilterDropdownProps {
  label: string
  options: string[]
  selected: string | null
  onSelect: (value: string | null) => void
}

export default function FilterDropdown({ label, options, selected, onSelect }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const displayText = selected ?? label

  return (
    <>
      <Pressable style={[styles.trigger, { backgroundColor: colors.card }]} onPress={() => setOpen(true)}>
        <Text
          style={[
            styles.triggerText,
            { color: selected ? colors.text : colors.muted },
            !!selected && styles.triggerTextActive,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={12} color={selected ? colors.tint : colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>{label}</Text>

            <FlatList
              data={['All', ...options]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isAll = item === 'All'
                const isSelected = isAll ? selected === null : item === selected
                return (
                  <Pressable
                    style={[
                      styles.option,
                      isSelected && { backgroundColor: colorScheme === 'dark' ? colors.surface : '#eef2ff' },
                    ]}
                    onPress={() => {
                      onSelect(isAll ? null : item)
                      setOpen(false)
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: isSelected ? colors.tint : colors.text },
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={colors.tint} />}
                  </Pressable>
                )
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
  },
  triggerText: {
    fontSize: 13,
    flex: 1,
  },
  triggerTextActive: {
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 15,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
})
