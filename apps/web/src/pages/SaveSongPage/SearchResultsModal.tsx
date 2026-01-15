import { Box, Button, Flex, Group, Modal, Paper, Stack, Text } from '@praise-app/ui-kit'
import { IconBrandApple, IconBrandSpotify } from '@tabler/icons-react'
import type { ScrapeSongResult } from '../../api/songs/scrape/post'

interface SearchResultsModalProps {
  opened: boolean
  onClose: () => void
  results: ScrapeSongResult[]
  onApplyResult: (result: ScrapeSongResult) => void
}

export function SearchResultsModal ({
  opened,
  onClose,
  results,
  onApplyResult
}: SearchResultsModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title='Search Results' size='lg'>
      <Stack gap='md'>
        <Text>Select a result to autofill the form:</Text>
        {results.map((result, index) => (
          <Paper key={index} p='md' radius='md' withBorder>
            <Flex justify='space-between' align='flex-start'>
              <Box style={{ flex: 1 }}>
                <Text fw={500}>{result.title}</Text>
                <Text c='dimmed'>{result.artist}</Text>
                <Group gap='md' mt='xs'>
                  <Text size='sm'>Key: {result.key || '-'}</Text>
                  <Text size='sm'>BPM: {result.bpm || '-'}</Text>
                  <Text size='sm'>Duration: {result.duration || '-'}</Text>
                </Group>

                {/* Music Service Links */}
                <Flex gap='xs' mt='sm'>
                  {result.links?.spotify && (
                    <Button
                      component='a'
                      href={result.links.spotify}
                      target='_blank'
                      rel='noopener noreferrer'
                      size='xs'
                      variant='light'
                      leftSection={<IconBrandSpotify size={12} />}
                    >
                      Listen on Spotify
                    </Button>
                  )}
                  {result.links?.apple && (
                    <Button
                      component='a'
                      href={result.links.apple}
                      target='_blank'
                      rel='noopener noreferrer'
                      size='xs'
                      variant='light'
                      leftSection={<IconBrandApple size={12} />}
                    >
                      Listen on Apple Music
                    </Button>
                  )}
                </Flex>
              </Box>
              <Button onClick={() => onApplyResult(result)}>Use This</Button>
            </Flex>
          </Paper>
        ))}
      </Stack>
    </Modal>
  )
}
