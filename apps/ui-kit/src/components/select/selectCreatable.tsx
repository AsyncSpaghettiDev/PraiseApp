import { Combobox, InputBase, useCombobox } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'

export interface SelectCreatableProps {
  data: string[]
  value?: string | null
  onChange?: (value: string | null) => void
  placeholder?: string
}

export function SelectCreatable ({
  data: initialData,
  value,
  onChange,
  placeholder = 'Search value'
}: SelectCreatableProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [data, setData] = useState<string[]>(initialData)
  const [internalValue, setInternalValue] = useState<string | null>(value || null)
  const [search, setSearch] = useState('')

  const normalizedInitialData = useMemo(() => {
    const trimmed = initialData.map((item) => item.trim()).filter((item) => item.length > 0)
    return Array.from(new Set(trimmed))
  }, [initialData])

  useEffect(() => {
    setData((current) => Array.from(new Set([...current, ...normalizedInitialData])))
  }, [normalizedInitialData])

  // Sync internal value with external value prop
  useEffect(() => {
    setInternalValue(value || null)
    setSearch(value || '')
  }, [value])

  const exactOptionMatch = data.some((item) => item === search)
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ))

  const handleValueChange = (newValue: string | null) => {
    setInternalValue(newValue)
    setSearch(newValue || '')
    onChange?.(newValue)
  }

  const commitSearchValue = () => {
    const nextValue = search.trim()
    if (!nextValue) {
      setSearch(internalValue || '')
      onChange?.(internalValue || null)
      return
    }

    if (!data.includes(nextValue)) {
      setData((current) => [...current, nextValue])
    }

    handleValueChange(nextValue)
  }

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          const createdValue = search.trim()
          if (createdValue && !data.includes(createdValue)) {
            setData((current) => [...current, createdValue])
          }
          handleValueChange(createdValue)
        } else {
          handleValueChange(val)
        }

        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            combobox.openDropdown()
            combobox.updateSelectedOptionIndex()
            setSearch(event.currentTarget.value)
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown()
            commitSearchValue()
          }}
          placeholder={placeholder}
          rightSectionPointerEvents='none'
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value='$create'>+ Create {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
