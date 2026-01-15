import { Link, useNavigate } from 'react-router'
import { useState, useMemo } from 'react'
import { Box, Button, Flex, Paper, Text, Title, Input } from '@praise-app/ui-kit'
import { Navbar } from '../../components'
import { SongDetailsModal } from './SongDetailsModal'
import { useSongsQuery, useDeleteSongMutation } from '../../hooks'
import { useDebouncedValue } from '@mantine/hooks'

export function SongsPage () {
  const songsQuery = useSongsQuery()
  const deleteSongMutation = useDeleteSongMutation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const songs = useMemo(() => songsQuery.data ?? [], [songsQuery.data])
  const [selectedSong, setSelectedSong] = useState<(typeof songs)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredSongs = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return songs

    const query = debouncedSearchQuery?.toLowerCase()

    return songs.filter((song) => {
      // Search by name
      const nameMatch = song.name?.toLowerCase().includes(query)

      // Search by artist
      const artistMatch = song.artist?.toLowerCase().includes(query)

      // Search by tags
      const tagsMatch = song.tags.some((tag) => tag?.toLowerCase().includes(query))

      // Search by lyrics
      const lyricsMatch = song.lyrics.some((lyric) => lyric.lyrics?.toLowerCase().includes(query))

      return nameMatch || artistMatch || tagsMatch || lyricsMatch
    })
  }, [songs, debouncedSearchQuery])

  const handleSongClick = (song: (typeof songs)[0]) => {
    setSelectedSong(song)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSong(null)
  }

  const handleEditSong = () => {
    if (selectedSong) {
      navigate(`/save-song?id=${selectedSong._id}`)
    }
  }

  const handleArchiveSong = async () => {
    if (selectedSong) {
      try {
        await deleteSongMutation.mutateAsync({ id: selectedSong._id, permanent: false })
        handleCloseModal()
        // Refresh the songs list
        songsQuery.refetch()
      } catch (error) {
        console.error('Failed to archive song:', error)
      }
    }
  }

  const handleRemoveSong = async () => {
    if (selectedSong) {
      try {
        await deleteSongMutation.mutateAsync({ id: selectedSong._id, permanent: true })
        handleCloseModal()
        // Refresh the songs list
        songsQuery.refetch()
      } catch (error) {
        console.error('Failed to remove song:', error)
      }
    }
  }

  if (songsQuery.isLoading) {
    return (
      <Box>
        <Navbar />
        <Box p='md'>
          <Flex align='center' justify='space-between' gap='md'>
            <Title order={1} m={0}>
              Songs
            </Title>
            <Button component={Link} to='/create-song' variant='light'>
              Create Song
            </Button>
          </Flex>

          <Paper mt='md' p='md' radius='md' withBorder>
            <Text c='dimmed'>Loading songs...</Text>
          </Paper>
        </Box>
      </Box>
    )
  }

  if (songsQuery.isError) {
    return (
      <Box>
        <Navbar />
        <Box p='md'>
          <Flex align='center' justify='space-between' gap='md'>
            <Title order={1} m={0}>
              Songs
            </Title>
            <Button component={Link} to='/create-song' variant='light'>
              Create Song
            </Button>
          </Flex>

          <Paper mt='md' p='md' radius='md' withBorder>
            <Title order={3} m={0}>
              Failed to load songs
            </Title>
            <Text c='dimmed' mt='xs'>
              {songsQuery.error.message}
            </Text>
          </Paper>
        </Box>
      </Box>
    )
  }

  if (songs.length === 0) {
    return (
      <Box>
        <Navbar />
        <Box p='md'>
          <Flex align='center' justify='space-between' gap='md'>
            <Title order={1} m={0}>
              Songs
            </Title>
            <Button component={Link} to='/create-song' variant='light'>
              Create Song
            </Button>
          </Flex>

          <Paper mt='md' p='md' radius='md' withBorder>
            <Title order={3} m={0}>
              No songs yet
            </Title>
            <Text c='dimmed' mt='xs'>
              Create your first song to start building your library.
            </Text>
          </Paper>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Navbar />
      <Box p='md'>
        <Flex align='center' justify='space-between' gap='md'>
          <Title order={1} m={0}>
            Songs
          </Title>
          <Button component={Link} to='/save-song' variant='light'>
            Save Song
          </Button>
        </Flex>

        <Input
          placeholder='Search by name, artist, tags, or lyrics...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mt='md'
        />

        <Flex direction='column' gap='sm' mt='md'>
          {filteredSongs.length === 0 ? (
            <Paper p='md' radius='md' withBorder>
              <Text c='dimmed'>No songs found matching your search.</Text>
            </Paper>
          ) : (
            filteredSongs.map((song) => (
              <Paper
                key={song._id}
                p='md'
                radius='md'
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => handleSongClick(song)}
              >
                <Flex align='center' justify='space-between' gap='md'>
                  <Box>
                    <Title order={4} m={0}>
                      {song.name}
                    </Title>
                    <Text c='dimmed' size='sm'>
                      {song.artist}
                    </Text>
                    {song.tags.length > 0 && (
                      <Text c='dimmed' size='sm' mt='xs'>
                        Tags: {song.tags.join(', ')}
                      </Text>
                    )}
                  </Box>

                  <Text c='dimmed' size='sm'>
                    {/* Key: {song.key} • BPM: {song.tempo} */}
                  </Text>
                </Flex>
              </Paper>
            ))
          )}
        </Flex>
      </Box>

      {/* Song Details Modal */}
      <SongDetailsModal
        opened={isModalOpen}
        onClose={handleCloseModal}
        song={selectedSong}
        onEdit={handleEditSong}
        onArchive={handleArchiveSong}
        onRemove={handleRemoveSong}
        isDeleting={deleteSongMutation.isPending}
      />
    </Box>
  )
}
