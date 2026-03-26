import { Box, Button, Flex, Text, Title, Modal } from '@praise-app/ui-kit'
import { Accordion } from '@mantine/core'
import { IconEdit, IconTrash, IconArchive } from '@tabler/icons-react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

interface SetlistSong {
  _id?: string
  name: string
  artist: string
  style: string
  tempo?: {
    variant: string
    tempo: number
    signature: string
  }
  key?: {
    variant: string
    key: string
  }
  lyrics?: {
    variant: string
    lyrics: string | Record<string, string>
  }
  structure?: {
    variant: string
    structure: string[] | string
  }
}

interface Setlist {
  _id: string
  name: string
  date: string
  tags: string[]
  songs: SetlistSong[]
}

interface SetlistDetailsModalProps {
  opened: boolean
  onClose: () => void
  setlist: Setlist | null
  onEdit: () => void
  onArchive: () => void
  onRemove: () => void
  isDeleting: boolean
}

export function SetlistDetailsModal ({
  opened,
  onClose,
  setlist,
  onEdit,
  onArchive,
  onRemove,
  isDeleting
}: SetlistDetailsModalProps) {
  if (!setlist) return null

  return (
    <Modal opened={opened} onClose={onClose} size='lg' title={setlist.name}>
      <Flex direction='column' gap='md'>
        <Box>
          <Title order={3}>{setlist.name}</Title>
          <Text c='dimmed' size='sm' style={{ textTransform: 'capitalize' }}>
            {dayjs(setlist.date || new Date()).format('dddd DD/MM/YY')}
          </Text>
        </Box>

        {setlist.tags && setlist.tags.length > 0 && (
          <Box>
            <Text fw={500} mb='xs'>
              Tags
            </Text>
            <Flex gap='xs' wrap='wrap'>
              {setlist.tags.map((tag, index) => (
                <Text
                  key={index}
                  size='sm'
                  px='xs'
                  py={4}
                  bg='var(--mantine-color-gray-0)'
                  style={{
                    borderRadius: 'var(--mantine-radius-sm)',
                    border: '1px solid var(--mantine-color-gray-3)'
                  }}
                >
                  {tag}
                </Text>
              ))}
            </Flex>
          </Box>
        )}

        <Box>
          <Text fw={500} mb='xs'>
            Songs ({setlist.songs.length})
          </Text>

          {setlist.songs.length === 0
            ? (
              <Text c='dimmed' size='sm'>No songs in this setlist.</Text>
              )
            : (
              <Accordion variant='separated'>
                {setlist.songs.map((song, index) => (
                  <Accordion.Item key={index} value={`song-${index}`}>
                    <Accordion.Control>
                      <Flex direction='column' gap={2}>
                        <Text fw={500} size='sm'>{song.name}</Text>
                        <Text c='dimmed' size='xs'>{song.artist} • {song.style}</Text>
                      </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Flex direction='column' gap='sm'>
                        {/* Tempo & Key info */}
                        <Flex gap='lg' wrap='wrap'>
                          {song.tempo && (
                            <Box>
                              <Text size='xs' fw={500} c='blue' tt='uppercase'>Tempo</Text>
                              <Text size='sm'>
                                {song.tempo.tempo} BPM ({song.tempo.variant}) • {song.tempo.signature || '4/4'}
                              </Text>
                            </Box>
                          )}
                          {song.key && (
                            <Box>
                              <Text size='xs' fw={500} c='blue' tt='uppercase'>Key</Text>
                              <Text size='sm'>
                                {song.key.key} ({song.key.variant})
                              </Text>
                            </Box>
                          )}
                        </Flex>

                        {/* Lyrics */}
                        {song.lyrics && (
                          <Box>
                            <Text size='xs' fw={500} c='blue' tt='uppercase' mb={4}>
                              Lyrics ({song.lyrics.variant})
                            </Text>
                            {(() => {
                              try {
                                const lyricsObj = typeof song.lyrics.lyrics === 'string'
                                  ? JSON.parse(song.lyrics.lyrics)
                                  : song.lyrics.lyrics
                                return Object.entries(lyricsObj).map(([section, content]) => (
                                  <Box key={section} mb='xs'>
                                    <Text size='sm' fw={500} c='blue'>
                                      {section}
                                    </Text>
                                    <pre
                                      style={{
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'inherit',
                                        fontSize: '13px',
                                        color: 'var(--mantine-color-dimmed)',
                                        margin: 0
                                      }}
                                    >
                                      {content as string}
                                    </pre>
                                  </Box>
                                ))
                              } catch {
                                return (
                                  <Text size='sm' c='dimmed'>
                                    {typeof song.lyrics.lyrics === 'string' ? song.lyrics.lyrics : ''}
                                  </Text>
                                )
                              }
                            })()}
                          </Box>
                        )}

                        {/* Structure */}
                        {song.structure && (
                          <Box>
                            <Text size='xs' fw={500} c='blue' tt='uppercase' mb={4}>
                              Structure ({song.structure.variant})
                            </Text>
                            <Text size='sm' c='dimmed'>
                              {(() => {
                                const struct = song.structure.structure
                                return Array.isArray(struct) ? struct.join(' → ') : struct
                              })()}
                            </Text>
                          </Box>
                        )}
                      </Flex>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
              )}
        </Box>

        <Flex gap='sm' mt='md'>
          <Button leftSection={<IconEdit size={16} />} onClick={onEdit} variant='light'>
            Edit
          </Button>
          <Button
            leftSection={<IconArchive size={16} />}
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
