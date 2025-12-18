import { Link } from 'react-router'
import { Box, Button, Flex, Paper, Text, Title } from '@praise-app/ui-kit'
import { Navbar } from '../../components/Navbar'
import { useSongsQuery } from '../../hooks'

export function SongsPage () {
  const songsQuery = useSongsQuery()

  const songs = songsQuery.data ?? []

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
          <Button component={Link} to='/create-song' variant='light'>
            Create Song
          </Button>
        </Flex>

        <Flex direction='column' gap='sm' mt='md'>
          {songs.map((song) => (
            <Paper key={song._id} p='md' radius='md' withBorder>
              <Flex align='center' justify='space-between' gap='md'>
                <Box>
                  <Title order={4} m={0}>
                    {song.name}
                  </Title>
                  <Text c='dimmed' size='sm'>
                    {song.artist}
                  </Text>
                </Box>

                <Text c='dimmed' size='sm'>
                  {/* Key: {song.key} • BPM: {song.tempo} */}
                </Text>
              </Flex>
            </Paper>
          ))}
        </Flex>
      </Box>
    </Box>
  )
}
