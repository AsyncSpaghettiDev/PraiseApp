import { Box, Button, Flex, Text, Title, Modal } from '@praise-app/ui-kit'
import { Accordion } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'

interface Song {
  _id: string
  name: string
  style: string
  artist: string
  tags: string[]
  tempo: {
    variant: string
    tempo: number
    signature: string
  }[]
  key: {
    variant: string
    key: string
  }[]
  lyrics: {
    variant: string
    lyrics: string | Record<string, string>
  }[]
  structure: {
    variant: string
    structure: string[] | string
  }[]
}

interface SongDetailsModalProps {
  opened: boolean
  onClose: () => void
  song: Song | null
  onEdit: () => void
  onArchive: () => void
  onRemove: () => void
  isDeleting: boolean
}

export function SongDetailsModal ({
  opened,
  onClose,
  song,
  onEdit,
  onArchive,
  onRemove,
  isDeleting
}: SongDetailsModalProps) {
  if (!song) return null

  return (
    <Modal opened={opened} onClose={onClose} size='lg' title={song.name}>
      <Flex direction='column' gap='md'>
        <Box>
          <Title order={3}>{song.name}</Title>
          <Text c='dimmed'>{song.artist}</Text>
          <Text size='sm' c='blue' mt='xs'>
            {song.style}
          </Text>
        </Box>

        {song.tags.length > 0 && (
          <Box>
            <Text fw={500} mb='xs'>
              Tags
            </Text>
            <Flex gap='xs' wrap='wrap'>
              {song.tags.map((tag, index) => (
                <Text
                  key={index}
                  size='sm'
                  px='xs'
                  py={4}
                  bg='var(--mantine-color-gray-0)'
                  style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                >
                  {tag}
                </Text>
              ))}
            </Flex>
          </Box>
        )}

        <Box>
          <Text fw={500} mb='xs'>
            Tempo Variants
          </Text>
          {song.tempo.map((tempo, index) => (
            <Text key={index} size='sm'>
              {tempo.variant}: {tempo.tempo} BPM {tempo.signature || '4/4'}
            </Text>
          ))}
        </Box>

        <Box>
          <Text fw={500} mb='xs'>
            Key Variants
          </Text>
          {song.key.map((key, index) => (
            <Text key={index} size='sm'>
              {key.variant}: {key.key}
            </Text>
          ))}
        </Box>

        <Box>
          <Text fw={500} mb='xs'>
            Lyrics Variants
          </Text>
          <Accordion>
            {song.lyrics.map((lyric, index) => (
              <Accordion.Item key={index} value={lyric.variant}>
                <Accordion.Control>{lyric.variant}</Accordion.Control>
                <Accordion.Panel>
                  {typeof lyric.lyrics === 'string'
                    ? Object.entries(JSON.parse(lyric.lyrics)).map(([section, content]) => (
                        <Box key={section} mb='xs'>
                          <Text size='sm' fw={500} c='blue'>
                            {section}
                          </Text>
                          <pre
                            style={{
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'inherit',
                              fontSize: '14px',
                              color: 'var(--mantine-color-dimmed)',
                              margin: 0
                            }}
                          >
                            {content as string}
                          </pre>
                        </Box>
                    ))
                    : Object.entries(lyric.lyrics).map(([section, content]) => (
                        <Box key={section} mb='xs'>
                          <Text size='sm' fw={500} c='blue'>
                            {section}
                          </Text>
                          <pre
                            style={{
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'inherit',
                              fontSize: '14px',
                              color: 'var(--mantine-color-dimmed)',
                              margin: 0
                            }}
                          >
                            {content as string}
                          </pre>
                        </Box>
                    ))}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Box>

        <Box>
          <Text fw={500} mb='xs'>
            Structure Variants
          </Text>
          {song.structure.map((structure, index) => (
            <Box key={index} mb='sm'>
              <Text size='sm' fw={500}>
                {structure.variant}
              </Text>
              <Text size='sm' c='dimmed'>
                {Array.isArray(structure.structure) ? structure.structure.join(', ') : structure.structure}
              </Text>
            </Box>
          ))}
        </Box>

        <Flex gap='sm' mt='md'>
          <Button leftSection={<IconEdit size={16} />} onClick={onEdit} variant='light'>
            Edit
          </Button>
          <Button
            leftSection={<IconTrash size={16} />}
            onClick={onArchive}
            color='yellow'
            variant='light'
            loading={isDeleting}
          >
            Archive
          </Button>
          <Button
            leftSection={<IconTrash size={16} />}
            onClick={onRemove}
            color='red'
            variant='light'
            loading={isDeleting}
          >
            Remove
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
