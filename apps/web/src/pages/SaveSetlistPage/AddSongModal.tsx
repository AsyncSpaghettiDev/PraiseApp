import { useState } from 'react'
import { Modal, Flex, Button, Select } from '@praise-app/ui-kit'
import { useSongsQuery } from '../../hooks'
import type { Song } from '../../api/songs/get'

interface AddSongModalProps {
  opened: boolean
  onClose: () => void
  onAdd: (song: any) => void
}

export function AddSongModal ({ opened, onClose, onAdd }: AddSongModalProps) {
  const songsQuery = useSongsQuery()
  const songs = songsQuery.data ?? []

  const [selectedSongId, setSelectedSongId] = useState<string | null>(null)
  const [selectedTempo, setSelectedTempo] = useState<string | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [selectedLyrics, setSelectedLyrics] = useState<string | null>(null)
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null)

  const selectedSong = songs.find((s) => s._id === selectedSongId)

  // Options for the song select
  const songOptions = songs.map((s: Song) => ({
    value: s._id,
    label: `${s.name} - ${s.artist}`
  }))

  const handleClose = () => {
    setSelectedSongId(null)
    setSelectedTempo(null)
    setSelectedKey(null)
    setSelectedLyrics(null)
    setSelectedStructure(null)
    onClose()
  }

  const handleAdd = () => {
    if (!selectedSong || !selectedTempo || !selectedKey || !selectedLyrics || !selectedStructure) {
      return
    }

    const tempoInfo = selectedSong.tempo.find((t) => t.variant === selectedTempo)
    const keyInfo = selectedSong.key.find((k) => k.variant === selectedKey)
    const lyricsInfo = selectedSong.lyrics.find((l) => l.variant === selectedLyrics)
    const structureInfo = selectedSong.structure.find((s) => s.variant === selectedStructure)

    if (tempoInfo && keyInfo && lyricsInfo && structureInfo) {
      onAdd({
        _id: selectedSong._id,
        name: selectedSong.name,
        style: selectedSong.style,
        artist: selectedSong.artist,
        tempo: {
          variant: tempoInfo.variant,
          tempo: tempoInfo.tempo,
          signature: tempoInfo.signature || '4/4'
        },
        key: {
          variant: keyInfo.variant,
          key: keyInfo.key
        },
        lyrics: {
          variant: lyricsInfo.variant,
          lyrics: typeof lyricsInfo.lyrics === 'string' ? lyricsInfo.lyrics : JSON.stringify(lyricsInfo.lyrics)
        },
        structure: {
          variant: structureInfo.variant,
          structure: structureInfo.structure
        }
      })
      handleClose()
    }
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Add Song to Setlist" size="md">
      <Flex direction="column" gap="md">
        <Select
          label="Select Song"
          placeholder="Choose a song"
          data={songOptions}
          value={selectedSongId}
          onChange={(val) => {
            setSelectedSongId(val)
            setSelectedTempo(null)
            setSelectedKey(null)
            setSelectedLyrics(null)
            setSelectedStructure(null)
          }}
          searchable
          error={songsQuery.isError ? 'Failed to load songs' : undefined}
        />

        {selectedSong && (
          <>
            <Select
              label="Tempo Variant"
              placeholder="Select tempo"
              data={selectedSong.tempo.map((t: any) => ({
                value: t.variant,
                label: `${t.variant} (${t.tempo} BPM ${t.signature || '4/4'})`
              }))}
              value={selectedTempo}
              onChange={setSelectedTempo}
            />

            <Select
              label="Key Variant"
              placeholder="Select key"
              data={selectedSong.key.map((k: any) => ({
                value: k.variant,
                label: `${k.variant} (${k.key})`
              }))}
              value={selectedKey}
              onChange={setSelectedKey}
            />

            <Select
              label="Lyrics Variant"
              placeholder="Select lyrics"
              data={selectedSong.lyrics.map((l: any) => ({
                value: l.variant,
                label: l.variant
              }))}
              value={selectedLyrics}
              onChange={setSelectedLyrics}
            />

            <Select
              label="Structure Variant"
              placeholder="Select structure"
              data={selectedSong.structure.map((s: any) => ({
                value: s.variant,
                label: s.variant
              }))}
              value={selectedStructure}
              onChange={setSelectedStructure}
            />
          </>
        )}

        <Flex justify="flex-end" gap="sm" mt="md">
          <Button variant="light" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedSong || !selectedTempo || !selectedKey || !selectedLyrics || !selectedStructure}
          >
            Add Song
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
