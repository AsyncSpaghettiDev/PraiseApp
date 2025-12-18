import { Box, Flex, Paper, Text, Title } from '@praise-app/ui-kit'
import { Navbar } from '../../components/Navbar'
import { useSetlistsQuery } from '../../hooks'

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
        </Flex>

        {setlistsQuery.isLoading
          ? (
          <Paper mt='md' p='md' radius='md' withBorder>
            <Text c='dimmed'>Loading setlists...</Text>
          </Paper>
            )
          : setlistsQuery.isError
            ? (
          <Paper mt='md' p='md' radius='md' withBorder>
            <Title order={3} m={0}>
              Failed to load setlists
            </Title>
            <Text c='dimmed' mt='xs'>
              {setlistsQuery.error.message}
            </Text>
          </Paper>
              )
            : setlists.length === 0
              ? (
          <Paper mt='md' p='md' radius='md' withBorder>
            <Title order={3} m={0}>
              No setlists yet
            </Title>
            <Text c='dimmed' mt='xs'>
              Create a setlist to plan songs for a service.
            </Text>
          </Paper>
                )
              : (
          <Flex direction='column' gap='sm' mt='md'>
            {setlists.map((setlist) => (
              <Paper key={setlist._id} p='md' radius='md' withBorder>
                <Flex align='center' justify='space-between' gap='md'>
                  <Box>
                    <Title order={4} m={0}>
                      {setlist.name}
                    </Title>
                    <Text c='dimmed' size='sm'>
                      {setlist.date}
                    </Text>
                  </Box>

                  <Text c='dimmed' size='sm'>
                    {setlist.songs.length} songs
                  </Text>
                </Flex>

                <Text c='dimmed' size='sm' mt='xs'>
                  {setlist.songs.map((s) => s.name).join(' • ')}
                </Text>
              </Paper>
            ))}
          </Flex>
                )}
      </Box>
    </Box>
  )
}
