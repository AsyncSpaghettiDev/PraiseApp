import { Link } from 'react-router'
import { Box, Flex, Paper, Text, Title, Button } from '@praise-app/ui-kit'
import { Navbar } from '../../components/Navbar'
import { useSetlistsQuery } from '../../hooks'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export function SetlistsPage () {
  const setlistsQuery = useSetlistsQuery()

  const setlists = setlistsQuery.data ?? []

  return (
    <Box>
      <Navbar />
      <Box p='md'>
        <Flex align='center' justify='space-between' gap='md'>
          <Title order={1} m={0}>
            Setlists
          </Title>
          <Button component={Link} to="/save-setlist">
            Create Setlist
          </Button>
        </Flex>

        {setlistsQuery.isLoading
          ? (
          <Paper mt="md" p="md" radius="md" withBorder>
            <Text c="dimmed">Loading setlists...</Text>
          </Paper>
            )
          : setlistsQuery.isError
            ? (
          <Paper mt="md" p="md" radius="md" withBorder>
            <Title order={3} m={0}>
              Failed to load setlists
            </Title>
            <Text c="dimmed" mt="xs">
              {setlistsQuery.error.message}
            </Text>
          </Paper>
              )
            : setlists.length === 0
              ? (
          <Paper mt="md" p="md" radius="md" withBorder>
            <Title order={3} m={0}>
              No setlists yet
            </Title>
            <Text c="dimmed" mt="xs">
              Create a setlist to plan songs for a service.
            </Text>
          </Paper>
                )
              : (
          <Box mt="md">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {setlists.map((setlist) => (
                <Paper key={setlist._id} p="md" radius="md" withBorder>
                  <Flex align="center" justify="space-between" mb="xs">
                    <Title order={4} m={0}>
                      {setlist.name}
                    </Title>
                  </Flex>

                  <Text c="dimmed" size="sm" mb="md" style={{ textTransform: 'capitalize' }}>
                    {dayjs(setlist.date || new Date()).format('dddd DD/MM/YY')}
                  </Text>

                  {setlist.tags && setlist.tags.length > 0 && (
                    <Flex gap="xs" wrap="wrap" mb="md">
                      {setlist.tags.map((tag, idx) => (
                        <Box
                          key={idx}
                          px={8}
                          py={4}
                          bg="var(--mantine-color-gray-0)"
                          bd="1px solid var(--mantine-color-gray-3)"
                          style={{ borderRadius: 'var(--mantine-radius-default)', fontSize: '0.75rem' }}
                        >
                          {tag}
                        </Box>
                      ))}
                    </Flex>
                  )}

                  <Text fw={500} size="sm" mb="xs">
                    Songs ({setlist.songs.length})
                  </Text>

                  <Flex direction="column" gap="xs">
                    {setlist.songs.map((song, idx) => (
                      <Box key={idx} p="xs" bg="var(--mantine-color-gray-0)" style={{ borderRadius: 'var(--mantine-radius-default)' }}>
                        <Text fw={500} size="sm">{song.name}</Text>
                        {(song as any).tempo && (song as any).key
                          ? (
                          <Text c="dimmed" size="xs">
                            {`${(song as any).tempo.tempo} BPM (${(song as any).tempo.variant}) • Key: ${(song as any).key.key} (${(song as any).key.variant})`}
                          </Text>
                            )
                          : (
                          <Text c="dimmed" size="xs">{song.artist}</Text>
                            )}
                      </Box>
                    ))}
                  </Flex>
                </Paper>
              ))}
            </div>
          </Box>
                )}
      </Box>
    </Box>
  )
}
