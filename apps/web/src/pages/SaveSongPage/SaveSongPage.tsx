import { useState, useEffect, useMemo, type KeyboardEvent } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  Flex,
  Paper,
  Text,
  Title,
  Input,
  Select,
  ActionIcon
  , SelectCreatable
} from '@praise-app/ui-kit'
import { Navbar } from '../../components/Navbar'
import { useSaveSongMutation, useUpdateSongMutation, useSongsQuery } from '../../hooks'
import { useScrapeSongMutation } from '../../hooks/songs/useScrapeSongMutation'
import { type UpdateSongRequest } from '../../api/songs/put'
import type { ScrapeSongResult } from '../../api/songs/scrape/post'
import type { Song } from '../../api/songs/get'
import { IconPlus, IconX } from '@tabler/icons-react'
import { VariantModal, type VariantModalData } from './VariantModal'
import { SearchResultsModal } from './SearchResultsModal'

interface SaveSongFormData {
  name: string
  style: Song['style']
  artist: string
  tags: Song['tags']
  tempo: Song['tempo']
  key: Song['key']
  lyrics: {
    variant: string
    lyrics: Record<string, string>
  }[]
  structure: Song['structure']
}

export function SaveSongPage () {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const songId = searchParams.get('id')
  const isEditing = !!songId

  const saveSongMutation = useSaveSongMutation()
  const updateSongMutation = useUpdateSongMutation()
  const scrapeSongMutation = useScrapeSongMutation()
  const songsQuery = useSongsQuery()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scrapeResults, setScrapeResults] = useState<ScrapeSongResult[]>([])
  const [variantModalOpen, setVariantModalOpen] = useState(false)
  const [variantModalData, setVariantModalData] = useState<VariantModalData>({
    type: 'tempo',
    variant: '',
    value: '',
    signature: '4/4',
    lyricsSections: [],
    structureSections: []
  })

  const [currentTag, setCurrentTag] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SaveSongFormData>({
    defaultValues: {
      name: '',
      style: 'praise',
      artist: '',
      tags: [],
      tempo: [],
      key: [],
      lyrics: [],
      structure: []
    }
  })

  const songName = watch('name')

  // Get unique artists from existing songs
  const uniqueArtists = useMemo(() => {
    if (!songsQuery.data) return []
    const artists = songsQuery.data.map((song) => song.artist).filter(Boolean)
    return [...new Set(artists)].sort()
  }, [songsQuery.data])

  // Load song data when editing
  useEffect(() => {
    if (isEditing && songId && songsQuery.data) {
      const song = songsQuery.data.find((s) => s._id === songId)
      if (song) {
        // Convert the song data to form format
        setValue('name', song.name, { shouldValidate: true })
        setValue('style', song.style, { shouldValidate: true })
        setValue('artist', song.artist, { shouldValidate: true })
        setValue('tags', song.tags, { shouldValidate: true })

        // Convert tempo data
        const tempoData = song.tempo.map((t) => ({
          variant: t.variant,
          tempo: t.tempo,
          signature: t.signature || '4/4'
        }))
        setValue('tempo', tempoData, { shouldValidate: true })

        // Convert key data
        setValue('key', song.key, { shouldValidate: true })

        // Convert lyrics data (parse JSON strings back to objects)
        const lyricsData = song.lyrics.map((l) => ({
          variant: l.variant,
          lyrics: typeof l.lyrics === 'string' ? JSON.parse(l.lyrics) : l.lyrics
        }))
        setValue('lyrics', lyricsData, { shouldValidate: true })

        // Convert structure data (parse JSON strings back to arrays)
        const structureData = song.structure.map((s) => ({
          variant: s.variant,
          structure: typeof s.structure === 'string' ? JSON.parse(s.structure) : s.structure
        }))
        setValue('structure', structureData, { shouldValidate: true })
      }
    }
  }, [isEditing, songId, songsQuery.data, setValue])

  const applyScrapeResult = (result: ScrapeSongResult) => {
    const bpmNumber = Number(String(result.bpm ?? '').replace(/[^0-9.]/g, ''))

    if (result.title) setValue('name', result.title, { shouldValidate: true })
    if (result.artist) setValue('artist', result.artist, { shouldValidate: true })
    if (Number.isFinite(bpmNumber) && bpmNumber > 0) {
      setValue('tempo', [{ variant: 'default', tempo: bpmNumber, signature: '4/4' }], {
        shouldValidate: true
      })
    }
    if (result.key) {
      setValue('key', [{ variant: 'default', key: result.key }], { shouldValidate: true })
    }

    setIsModalOpen(false)
    toast.success('Song details applied!')
  }

  const openVariantModal = (type: VariantModalData['type'], index?: number) => {
    const currentValue = watch(type)
    const existingVariant = index !== undefined ? currentValue[index] : null

    if (type === 'lyrics') {
      // Convert lyrics object back to sections array for editing
      const lyricsObj =
        (existingVariant as { variant: string; lyrics: Record<string, string> })?.lyrics || {}
      const lyricsSections = Object.entries(lyricsObj).map(([section, content]) => ({
        section,
        content: String(content),
        isCustom: ![
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
        ].includes(section)
      }))

      setVariantModalData({
        type,
        index,
        variant: existingVariant?.variant || '',
        value: '',
        lyricsSections,
        structureSections: []
      })
    } else if (type === 'structure') {
      // Convert structure array back to sections array for editing
      const structureArray = (existingVariant as Song['structure'][0])?.structure || []
      const structureSections = structureArray.map((section) => ({
        section,
        isCustom: ![
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
        ].includes(section)
      }))

      setVariantModalData({
        type,
        index,
        variant: existingVariant?.variant || '',
        value: '',
        lyricsSections: [],
        structureSections
      })
    } else {
      setVariantModalData({
        type,
        index,
        variant: existingVariant?.variant || '',
        value: existingVariant
          ? type === 'tempo'
            ? (existingVariant as Song['tempo'][0]).tempo
            : type === 'key'
              ? (existingVariant as Song['key'][0]).key
              : ''
          : '',
        signature:
          type === 'tempo' ? (existingVariant as Song['tempo'][0])?.signature || '4/4' : undefined,
        lyricsSections: [],
        structureSections: []
      })
    }
    setVariantModalOpen(true)
  }

  const saveVariant = () => {
    const { type, index, variant, value, signature, lyricsSections, structureSections } =
      variantModalData

    if (!variant.trim()) {
      toast.error('Please fill in variant name')
      return
    }

    if (type === 'lyrics' && (!lyricsSections || lyricsSections.length === 0)) {
      toast.error('Please add at least one lyrics section')
      return
    }

    if (type === 'structure' && (!structureSections || structureSections.length === 0)) {
      toast.error('Please add at least one structure section')
      return
    }

    if ((type === 'tempo' || type === 'key') && !value) {
      toast.error('Please fill in the value')
      return
    }

    const currentValue = watch(type)

    if (type === 'tempo') {
      const tempoValue: SaveSongFormData['tempo'][number] = {
        variant,
        tempo: Number(value),
        signature: signature || '4/4'
      }
      const tempoArray = currentValue as SaveSongFormData['tempo']
      const updatedArray =
        index !== undefined
          ? tempoArray.map((item, i) => (i === index ? tempoValue : item))
          : [...tempoArray, tempoValue]
      setValue(type, updatedArray, { shouldValidate: true })
    } else if (type === 'key') {
      const keyValue: SaveSongFormData['key'][number] = { variant, key: String(value) }
      const keyArray = currentValue as SaveSongFormData['key']
      const updatedArray =
        index !== undefined
          ? keyArray.map((item, i) => (i === index ? keyValue : item))
          : [...keyArray, keyValue]
      setValue(type, updatedArray, { shouldValidate: true })
    } else if (type === 'lyrics') {
      // Convert sections array back to lyrics object
      const lyricsObj: Record<string, string> = {}
      lyricsSections?.forEach(({ section, content }) => {
        if (section.trim() && content.trim()) {
          lyricsObj[section] = content
        }
      })
      const lyricsValue: SaveSongFormData['lyrics'][number] = { variant, lyrics: lyricsObj }
      const lyricsArray = currentValue as SaveSongFormData['lyrics']
      const updatedArray =
        index !== undefined
          ? lyricsArray.map((item, i) => (i === index ? lyricsValue : item))
          : [...lyricsArray, lyricsValue]
      setValue(type, updatedArray, { shouldValidate: true })
    } else if (type === 'structure') {
      // Convert sections array back to structure array
      const structureArray = structureSections?.map(({ section }) => section) || []
      const structureValue: SaveSongFormData['structure'][number] = {
        variant,
        structure: structureArray
      }
      const structArray = currentValue as SaveSongFormData['structure']
      const updatedArray =
        index !== undefined
          ? structArray.map((item, i) => (i === index ? structureValue : item))
          : [...structArray, structureValue]
      setValue(type, updatedArray, { shouldValidate: true })
    } else {
      // This should never happen, but TypeScript needs this branch
      throw new Error(`Unknown variant type: ${type}`)
    }
    setVariantModalOpen(false)
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} variant saved!`)
  }

  const deleteVariant = (type: VariantModalData['type'], index: number) => {
    const currentValue = watch(type)

    if (type === 'tempo') {
      const tempoArray = currentValue as SaveSongFormData['tempo']
      const updatedArray = tempoArray.filter((_, i) => i !== index)
      setValue(type, updatedArray, { shouldValidate: true })
    } else if (type === 'key') {
      const keyArray = currentValue as SaveSongFormData['key']
      const updatedArray = keyArray.filter((_, i) => i !== index)
      setValue(type, updatedArray, { shouldValidate: true })
    } else if (type === 'lyrics') {
      const lyricsArray = currentValue as SaveSongFormData['lyrics']
      const updatedArray = lyricsArray.filter((_, i) => i !== index)
      setValue(type, updatedArray, { shouldValidate: true })
    } else if (type === 'structure') {
      const structArray = currentValue as SaveSongFormData['structure']
      const updatedArray = structArray.filter((_, i) => i !== index)
      setValue(type, updatedArray, { shouldValidate: true })
    }

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} variant deleted!`)
  }

  const addLyricsSection = () => {
    setVariantModalData({
      ...variantModalData,
      lyricsSections: [
        ...(variantModalData.lyricsSections || []),
        { section: '', content: '', isCustom: false }
      ]
    })
  }

  const removeLyricsSection = (index: number) => {
    setVariantModalData({
      ...variantModalData,
      lyricsSections: variantModalData.lyricsSections?.filter((_, i) => i !== index) || []
    })
  }

  const updateLyricsSection = (index: number, field: 'section' | 'content', value: string) => {
    const updatedSections = [...(variantModalData.lyricsSections || [])]
    updatedSections[index] = { ...updatedSections[index], [field]: value }
    setVariantModalData({
      ...variantModalData,
      lyricsSections: updatedSections
    })
  }

  const addStructureSection = () => {
    setVariantModalData({
      ...variantModalData,
      structureSections: [
        ...(variantModalData.structureSections || []),
        { section: '', isCustom: false }
      ]
    })
  }

  const removeStructureSection = (index: number) => {
    setVariantModalData({
      ...variantModalData,
      structureSections: variantModalData.structureSections?.filter((_, i) => i !== index) || []
    })
  }

  const updateStructureSection = (index: number, value: string) => {
    const updatedSections = [...(variantModalData.structureSections || [])]
    updatedSections[index] = { section: value, isCustom: updatedSections[index]?.isCustom || false }
    setVariantModalData({
      ...variantModalData,
      structureSections: updatedSections
    })
  }

  const addTag = () => {
    const trimmedTag = currentTag.trim()
    if (trimmedTag && !watch('tags').includes(trimmedTag)) {
      const currentTags = watch('tags')
      setValue('tags', [...currentTags, trimmedTag], { shouldValidate: true })
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch('tags')
    setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    )
  }

  const handleTagInputKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const onSearch = async () => {
    if (!songName.trim()) {
      toast.error('Please enter a song name to search')
      return
    }

    try {
      const response = await scrapeSongMutation.mutateAsync({ query: songName })
      const results = response.results ?? []
      setScrapeResults(results)

      if (results.length === 0) {
        toast.error('No results found')
        return
      }

      setIsModalOpen(true)
      toast.success(`Found ${results.length} result(s)`)
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to scrape song data')
    }
  }

  const onSubmit = async (data: SaveSongFormData) => {
    try {
      const songData: UpdateSongRequest = {
        name: data.name,
        style: data.style as 'praise' | 'worship',
        artist: data.artist,
        tags: data.tags || [],
        tempo:
          data.tempo.length > 0
            ? data.tempo
            : [{ variant: 'default', tempo: 120, signature: '4/4' }],
        key: data.key.length > 0 ? data.key : [{ variant: 'default', key: 'C' }],
        lyrics:
          data.lyrics.length > 0
            ? data.lyrics.map((item) => ({ ...item, lyrics: JSON.stringify(item.lyrics) }))
            : [{ variant: 'default', lyrics: JSON.stringify({}) }],
        structure:
          data.structure.length > 0
            ? data.structure.map((item) => ({ ...item, structure: JSON.stringify(item.structure) }))
            : [
                {
                  variant: 'default',
                  structure: JSON.stringify(['intro', 'verse', 'chorus', 'bridge', 'outro'])
                }
              ]
      }

      if (isEditing && songId) {
        await updateSongMutation.mutateAsync({ id: songId, data: songData })
        toast.success('Song updated successfully!')
      } else {
        await saveSongMutation.mutateAsync(songData)
        toast.success('Song saved successfully!')
      }

      navigate('/songs')
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to save song')
    }
  }

  return (
    <Box>
      <Navbar />
      <Box p='md'>
        <Flex align='center' justify='space-between' gap='md' mb='md'>
          <Title order={1} m={0}>
            {isEditing ? 'Edit Song' : 'Save Song'}
          </Title>
          <Button component={Link} to='/songs' variant='light'>
            Back to Songs
          </Button>
        </Flex>

        <Box maw={1000} mx='auto'>
          <Paper p='md' radius='md' withBorder>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction='column' gap='md'>
                <Flex direction='column' gap='xs'>
                  <Text fw={500}>Song Name *</Text>
                  <Flex gap='sm'>
                    <Input
                      placeholder='Enter song name'
                      {...register('name', { required: 'Song name is required' })}
                      error={errors.name?.message}
                      style={{ flex: 1 }}
                    />
                    <Button
                      type='button'
                      variant='light'
                      loading={scrapeSongMutation.isPending}
                      onClick={onSearch}
                    >
                      Search
                    </Button>
                  </Flex>
                </Flex>

                <Flex direction='column' gap='xs'>
                  <Text fw={500}>Style *</Text>
                  <Controller
                    name='style'
                    control={control}
                    rules={{ required: 'Style is required' }}
                    render={({ field }) => (
                      <Select
                        data={[
                          { value: 'praise', label: 'Praise' },
                          { value: 'worship', label: 'Worship' }
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.style?.message}
                      />
                    )}
                  />
                </Flex>

                <Flex direction='column' gap='xs'>
                  <Text fw={500}>Artist *</Text>
                  <Controller
                    name='artist'
                    control={control}
                    rules={{ required: 'Artist is required' }}
                    render={({ field }) => (
                      <SelectCreatable
                        data={uniqueArtists}
                        value={field.value}
                        onChange={(value) => field.onChange(value || '')}
                      />
                    )}
                  />
                  {errors.artist && (
                    <Text c='red' size='sm'>
                      {errors.artist.message}
                    </Text>
                  )}
                </Flex>

                <Flex direction='column' gap='xs'>
                  <Text fw={500}>Tags</Text>
                  <Flex direction='column' gap='sm'>
                    <Flex gap='sm'>
                      <Input
                        placeholder='Enter a tag and press Enter or Add'
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        style={{ flex: 1 }}
                      />
                      <Button
                        type='button'
                        variant='light'
                        onClick={addTag}
                        disabled={!currentTag.trim() || watch('tags').includes(currentTag.trim())}
                      >
                        Add
                      </Button>
                    </Flex>
                    {watch('tags').length > 0 && (
                      <Flex gap='xs' wrap='wrap'>
                        {watch('tags').map((tag, index) => (
                          <Flex
                            key={index}
                            gap={4}
                            align='center'
                            px={8}
                            py={4}
                            bg='var(--mantine-color-gray-0)'
                            bd='1px solid var(--mantine-color-gray-3)'
                            style={{ borderRadius: 'var(--mantine-radius-default)' }}
                          >
                            <Text size='sm'>{tag}</Text>
                            <ActionIcon
                              size='sm'
                              variant='subtle'
                              color='gray'
                              onClick={() => removeTag(tag)}
                            >
                              <IconX size={12} />
                            </ActionIcon>
                          </Flex>
                        ))}
                      </Flex>
                    )}
                  </Flex>
                </Flex>

                {/* Tempo Variants */}
                <Flex direction='column' gap='xs'>
                  <Flex align='center' justify='space-between'>
                    <Text fw={500}>Tempo</Text>
                    <Button
                      type='button'
                      size='sm'
                      variant='light'
                      leftSection={<IconPlus size={14} />}
                      onClick={() => openVariantModal('tempo')}
                    >
                      Add
                    </Button>
                  </Flex>
                  <Flex gap='xs' wrap='wrap'>
                    {watch('tempo').map((item, index) => (
                      <Flex
                        key={index}
                        gap={4}
                        align='center'
                        px={8}
                        py={4}
                        bg='var(--mantine-color-blue-light)'
                        style={{ borderRadius: 'var(--mantine-radius-default)' }}
                      >
                        <Text
                          size='sm'
                          onClick={() => openVariantModal('tempo', index)}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.variant}: {item.tempo} BPM {item.signature}
                        </Text>
                        <ActionIcon
                          size='sm'
                          variant='subtle'
                          color='blue'
                          onClick={() => deleteVariant('tempo', index)}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>

                {/* Key Variants */}
                <Flex direction='column' gap='xs'>
                  <Flex align='center' justify='space-between'>
                    <Text fw={500}>Key</Text>
                    <Button
                      type='button'
                      size='sm'
                      variant='light'
                      leftSection={<IconPlus size={14} />}
                      onClick={() => openVariantModal('key')}
                    >
                      Add
                    </Button>
                  </Flex>
                  <Flex gap='xs' wrap='wrap'>
                    {watch('key').map((item, index) => (
                      <Flex
                        key={index}
                        gap={4}
                        align='center'
                        px={8}
                        py={4}
                        bg='var(--mantine-color-green-light)'
                        style={{ borderRadius: 'var(--mantine-radius-default)' }}
                      >
                        <Text
                          size='sm'
                          onClick={() => openVariantModal('key', index)}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.variant}: {item.key}
                        </Text>
                        <ActionIcon
                          size='sm'
                          variant='subtle'
                          color='green'
                          onClick={() => deleteVariant('key', index)}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>

                {/* Lyrics Variants */}
                <Flex direction='column' gap='xs'>
                  <Flex align='center' justify='space-between'>
                    <Text fw={500}>Lyrics</Text>
                    <Button
                      type='button'
                      size='sm'
                      variant='light'
                      leftSection={<IconPlus size={14} />}
                      onClick={() => openVariantModal('lyrics')}
                    >
                      Add
                    </Button>
                  </Flex>
                  <Flex gap='xs' wrap='wrap'>
                    {watch('lyrics').map((item, index) => (
                      <Flex
                        key={index}
                        gap={4}
                        align='center'
                        px={8}
                        py={4}
                        bg='var(--mantine-color-orange-light)'
                        style={{ borderRadius: 'var(--mantine-radius-default)' }}
                      >
                        <Text
                          size='sm'
                          onClick={() => openVariantModal('lyrics', index)}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.variant} ({Object.keys(item.lyrics).length} sections)
                        </Text>
                        <ActionIcon
                          size='sm'
                          variant='subtle'
                          color='orange'
                          onClick={() => deleteVariant('lyrics', index)}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>

                {/* Structure Variants */}
                <Flex direction='column' gap='xs'>
                  <Flex align='center' justify='space-between'>
                    <Text fw={500}>Structure</Text>
                    <Button
                      type='button'
                      size='sm'
                      variant='light'
                      leftSection={<IconPlus size={14} />}
                      onClick={() => openVariantModal('structure')}
                    >
                      Add
                    </Button>
                  </Flex>
                  <Flex gap='xs' wrap='wrap'>
                    {watch('structure').map((item, index) => (
                      <Flex
                        key={index}
                        gap={4}
                        align='center'
                        px={8}
                        py={4}
                        bg='var(--mantine-color-purple-light)'
                        style={{ borderRadius: 'var(--mantine-radius-default)' }}
                      >
                        <Text
                          size='sm'
                          onClick={() => openVariantModal('structure', index)}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.variant} ({item.structure.length} sections)
                        </Text>
                        <ActionIcon
                          size='sm'
                          variant='subtle'
                          color='purple'
                          onClick={() => deleteVariant('structure', index)}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>

                <Flex gap='sm' mt='md'>
                  <Button type='submit' loading={isSubmitting}>
                    {isEditing ? 'Update Song' : 'Save Song'}
                  </Button>
                  <Button component={Link} to='/songs' variant='light'>
                    Cancel
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Paper>
        </Box>
      </Box>

      {/* Variant Modal */}
      <VariantModal
        opened={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        data={variantModalData}
        onChange={setVariantModalData}
        onSave={saveVariant}
        onAddLyricsSection={addLyricsSection}
        onRemoveLyricsSection={removeLyricsSection}
        onUpdateLyricsSection={updateLyricsSection}
        onAddStructureSection={addStructureSection}
        onRemoveStructureSection={removeStructureSection}
        onUpdateStructureSection={updateStructureSection}
      />

      {/* Search Results Modal */}
      <SearchResultsModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={scrapeResults}
        onApplyResult={applyScrapeResult}
      />
    </Box>
  )
}
