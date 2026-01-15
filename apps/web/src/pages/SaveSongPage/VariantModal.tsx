import {
  Box,
  Button,
  Flex,
  Modal,
  NumberInput,
  Select,
  SelectCreatable,
  Stack,
  Text,
  Textarea
} from '@praise-app/ui-kit'
import { IconPlus } from '@tabler/icons-react'

interface VariantModalData {
  type: 'tempo' | 'key' | 'lyrics' | 'structure'
  index?: number
  variant: string
  value: string | number
  signature?: string
  lyricsSections?: { section: string; content: string; isCustom: boolean }[]
  structureSections?: { section: string; isCustom: boolean }[]
}

interface VariantModalProps {
  opened: boolean
  onClose: () => void
  data: VariantModalData
  onChange: (data: VariantModalData) => void
  onSave: () => void
  onAddLyricsSection: () => void
  onRemoveLyricsSection: (index: number) => void
  onUpdateLyricsSection: (index: number, field: 'section' | 'content', value: string) => void
  onAddStructureSection: () => void
  onRemoveStructureSection: (index: number) => void
  onUpdateStructureSection: (index: number, value: string) => void
}

export function VariantModal ({
  opened,
  onClose,
  data,
  onChange,
  onSave,
  onAddLyricsSection,
  onRemoveLyricsSection,
  onUpdateLyricsSection,
  onAddStructureSection,
  onRemoveStructureSection,
  onUpdateStructureSection
}: VariantModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Add/Edit ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`}
      size='md'
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <Stack gap='md'>
        <Flex direction='column' gap='xs'>
          <Text fw={500}>Variant Name</Text>
          <SelectCreatable
            value={data.variant}
            onChange={(value) => onChange({ ...data, variant: value || '' })}
            data={['default', 'live', 'acoustic', 'studio', 'rehearsal']}
          />
        </Flex>

        {data.type === 'tempo' && (
          <Flex direction='column' gap='xs'>
            <Text fw={500}>Time Signature</Text>
            <Select
              data={['4/4', '3/4', '2/4', '6/8', '5/4', '7/8', '12/8'].map((sig) => ({
                value: sig,
                label: sig
              }))}
              value={data.signature || '4/4'}
              onChange={(value) => onChange({ ...data, signature: value || '4/4' })}
            />
          </Flex>
        )}

        <Flex direction='column' gap='xs'>
          <Text fw={500}>
            {data.type === 'tempo'
              ? 'Tempo (BPM)'
              : data.type === 'key'
                ? 'Key'
                : data.type === 'lyrics'
                  ? 'Lyrics'
                  : 'Structure'}
          </Text>
          {data.type === 'tempo'
            ? (
            <NumberInput
              placeholder='Enter tempo'
              value={typeof data.value === 'number' ? data.value : Number(data.value) || ''}
              onChange={(value) => onChange({ ...data, value: value || 0 })}
              min={40}
              max={200}
            />
              )
            : data.type === 'key'
              ? (
            <SelectCreatable
              data={['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']}
              value={String(data.value)}
              onChange={(value) => onChange({ ...data, value: value || '' })}
            />
                )
              : data.type === 'lyrics'
                ? (
            <Box>
              <Flex direction='column' gap='md'>
                {data.lyricsSections?.map((section, index) => (
                  <Flex key={index} direction='column' gap='xs'>
                    <Flex gap='xs' align='center'>
                      <Box style={{ flex: 1 }}>
                        <SelectCreatable
                          data={[
                            'verse',
                            'verse 1',
                            'verse 2',
                            'verse 3',
                            'verse 4',
                            'verse 5',
                            'chorus',
                            'chorus 1',
                            'chorus 2',
                            'chorus 3',
                            'chorus 4',
                            'chorus 5',
                            'post chorus',
                            'bridge',
                            'pre-chorus',
                            'intro',
                            'outro',
                            'tag'
                          ]}
                          value={section.section}
                          onChange={(value) => onUpdateLyricsSection(index, 'section', value || '')}
                        />
                      </Box>
                      <Button
                        type='button'
                        size='sm'
                        variant='light'
                        color='red'
                        onClick={() => onRemoveLyricsSection(index)}
                      >
                        Remove
                      </Button>
                    </Flex>
                    <Textarea
                      placeholder='Enter lyrics for this section'
                      value={section.content}
                      onChange={(e) => onUpdateLyricsSection(index, 'content', e.target.value)}
                      minRows={3}
                    />
                  </Flex>
                ))}
                <Button
                  type='button'
                  variant='light'
                  leftSection={<IconPlus size={14} />}
                  onClick={onAddLyricsSection}
                >
                  Add Section
                </Button>
              </Flex>
            </Box>
                  )
                : data.type === 'structure'
                  ? (
            <Box>
              <Flex direction='column' gap='md'>
                {data.structureSections?.map((section, index) => (
                  <Flex key={index} gap='xs' align='center'>
                    <Box style={{ flex: 1 }}>
                      <SelectCreatable
                        data={[
                          'intro',
                          'verse',
                          'verse 1',
                          'verse 2',
                          'verse 3',
                          'verse 4',
                          'verse 5',
                          'pre-chorus',
                          'chorus',
                          'chorus 1',
                          'chorus 2',
                          'post chorus',
                          'bridge',
                          'bridge 2',
                          'solo',
                          'instrumental',
                          'outro',
                          'tag',
                          'ending'
                        ]}
                        value={section.section}
                        onChange={(value) => onUpdateStructureSection(index, value || '')}
                      />
                    </Box>
                    <Button
                      type='button'
                      size='sm'
                      variant='light'
                      color='red'
                      onClick={() => onRemoveStructureSection(index)}
                    >
                      Remove
                    </Button>
                  </Flex>
                ))}
                <Button
                  type='button'
                  variant='light'
                  leftSection={<IconPlus size={14} />}
                  onClick={onAddStructureSection}
                >
                  Add Section
                </Button>
              </Flex>
            </Box>
                    )
                  : null}
        </Flex>

        <Flex gap='sm' justify='flex-end'>
          <Button variant='light' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {data.index !== undefined ? 'Update' : 'Add'} {data.type}
          </Button>
        </Flex>
      </Stack>
    </Modal>
  )
}

export type { VariantModalData }
