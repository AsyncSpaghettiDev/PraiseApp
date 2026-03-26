import { Link, useNavigate } from 'react-router'
import { useState, useMemo } from 'react'
import { Box, Flex, Paper, Text, Title, Button, Input } from '@praise-app/ui-kit'
import { Navbar } from '../../components/Navbar'
import { useSetlistsQuery, useDeleteSetlistMutation } from '../../hooks'
import { SetlistDetailsModal } from './SetlistDetailsModal'
import { useDebouncedValue } from '@mantine/hooks'
import { IconMusic, IconCalendar } from '@tabler/icons-react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export function SetlistsPage () {
  const setlistsQuery = useSetlistsQuery()
  const deleteSetlistMutation = useDeleteSetlistMutation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const setlists = useMemo(() => setlistsQuery.data ?? [], [setlistsQuery.data])
  const [selectedSetlist, setSelectedSetlist] = useState<(typeof setlists)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredSetlists = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return setlists

    const query = debouncedSearchQuery?.toLowerCase()

    return setlists.filter((setlist) => {
      const nameMatch = setlist.name?.toLowerCase().includes(query)
      const tagsMatch = setlist.tags?.some((tag) => tag?.toLowerCase().includes(query))
      const songsMatch = setlist.songs?.some((song) => song.name?.toLowerCase().includes(query))
      const dateMatch = dayjs(setlist.date).format('dddd DD/MM/YY').toLowerCase().includes(query)

      return nameMatch || tagsMatch || songsMatch || dateMatch
    })
  }, [setlists, debouncedSearchQuery])

  const handleSetlistClick = (setlist: (typeof setlists)[0]) => {
    setSelectedSetlist(setlist)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSetlist(null)
  }

  const handleEditSetlist = () => {
    if (selectedSetlist) {
      navigate(`/save-setlist?id=${selectedSetlist._id}`)
    }
  }

  const handleArchiveSetlist = async () => {
    if (selectedSetlist) {
      try {
        await deleteSetlistMutation.mutateAsync({ id: selectedSetlist._id, permanent: false })
        handleCloseModal()
        setlistsQuery.refetch()
      } catch (error) {
        console.error('Failed to archive setlist:', error)
      }
    }
  }

  const handleRemoveSetlist = async () => {
    if (selectedSetlist) {
      try {
        await deleteSetlistMutation.mutateAsync({ id: selectedSetlist._id, permanent: true })
        handleCloseModal()
        setlistsQuery.refetch()
      } catch (error) {
        console.error('Failed to remove setlist:', error)
      }
    }
  }

  if (setlistsQuery.isLoading) {
    return (
      <Box>
        <Navbar />
        <Box p='md'>
          <Flex align='center' justify='space-between' gap='md'>
            <Title order={1} m={0}>
              Setlists
            </Title>
            <Button component={Link} to='/save-setlist' variant='light'>
              Create Setlist
            </Button>
          </Flex>

          <Paper mt='md' p='md' radius='md' withBorder>
            <Text c='dimmed'>Loading setlists...</Text>
          </Paper>
        </Box>
      </Box>
    )
  }

  if (setlistsQuery.isError) {
    return (
      <Box>
        <Navbar />
        <Box p='md'>
          <Flex align='center' justify='space-between' gap='md'>
            <Title order={1} m={0}>
              Setlists
            </Title>
            <Button component={Link} to='/save-setlist' variant='light'>
              Create Setlist
            </Button>
          </Flex>

          <Paper mt='md' p='md' radius='md' withBorder>
            <Title order={3} m={0}>
              Failed to load setlists
            </Title>
            <Text c='dimmed' mt='xs'>
              {setlistsQuery.error.message}
            </Text>
          </Paper>
        </Box>
      </Box>
    )
  }

  if (setlists.length === 0) {
    return (
      <Box>
        <Navbar />
        <Box p='md'>
          <Flex align='center' justify='space-between' gap='md'>
            <Title order={1} m={0}>
              Setlists
            </Title>
            <Button component={Link} to='/save-setlist' variant='light'>
              Create Setlist
            </Button>
          </Flex>

          <Paper mt='md' p='md' radius='md' withBorder>
            <Title order={3} m={0}>
              No setlists yet
            </Title>
            <Text c='dimmed' mt='xs'>
              Create a setlist to plan songs for a service.
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
            Setlists
          </Title>
          <Button component={Link} to='/save-setlist' variant='light'>
            Create Setlist
          </Button>
        </Flex>

        <Input
          placeholder='Search by name, date, tags, or songs...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mt='md'
        />

        {filteredSetlists.length === 0
          ? (
            <Paper mt='md' p='md' radius='md' withBorder>
              <Text c='dimmed'>No setlists found matching your search.</Text>
            </Paper>
            )
          : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}
            >
              {filteredSetlists.map((setlist) => (
                <Paper
                  key={setlist._id}
                  p='md'
                  radius='md'
                  withBorder
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onClick={() => handleSetlistClick(setlist)}
                >
                  <Title order={4} m={0} mb={4}>
                    {setlist.name}
                  </Title>

                  <Flex align='center' gap={6} mb='sm'>
                    <IconCalendar size={14} color='var(--mantine-color-dimmed)' />
                    <Text c='dimmed' size='sm' style={{ textTransform: 'capitalize' }}>
                      {dayjs(setlist.date || new Date()).format('dddd DD/MM/YY')}
                    </Text>
                  </Flex>

                  {setlist.tags && setlist.tags.length > 0 && (
                    <Flex gap='xs' wrap='wrap' mb='sm'>
                      {setlist.tags.map((tag, idx) => (
                        <Box
                          key={idx}
                          px={8}
                          py={4}
                          bg='var(--mantine-color-gray-0)'
                          bd='1px solid var(--mantine-color-gray-3)'
                          style={{ borderRadius: 'var(--mantine-radius-default)', fontSize: '0.75rem' }}
                        >
                          {tag}
                        </Box>
                      ))}
                    </Flex>
                  )}

                  <Box style={{ flex: 1 }} />

                  <Flex align='center' gap={6} mt='xs'>
                    <IconMusic size={14} color='var(--mantine-color-blue-6)' />
                    <Text fw={500} size='sm'>
                      {setlist.songs.length} {setlist.songs.length === 1 ? 'song' : 'songs'}
                    </Text>
                  </Flex>

                  {setlist.songs.length > 0 && (
                    <Flex direction='column' gap={4} mt='xs'>
                      {setlist.songs.slice(0, 3).map((song, idx) => (
                        <Text key={idx} size='xs' c='dimmed' lineClamp={1}>
                          {idx + 1}. {song.name}
                        </Text>
                      ))}
                      {setlist.songs.length > 3 && (
                        <Text size='xs' c='dimmed' fs='italic'>
                          +{setlist.songs.length - 3} more
                        </Text>
                      )}
                    </Flex>
                  )}
                </Paper>
              ))}
            </div>
            )}
      </Box>

      {/* Setlist Details Modal */}
      <SetlistDetailsModal
        opened={isModalOpen}
        onClose={handleCloseModal}
        setlist={selectedSetlist}
        onEdit={handleEditSetlist}
        onArchive={handleArchiveSetlist}
        onRemove={handleRemoveSetlist}
        isDeleting={deleteSetlistMutation.isPending}
      />
    </Box>
  )
}
