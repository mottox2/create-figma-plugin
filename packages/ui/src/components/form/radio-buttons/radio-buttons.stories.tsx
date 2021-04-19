/** @jsx h */
import { h } from 'preact'
import { useState } from 'preact/hooks'

import { Text } from '../../main/text/text'
import { RadioButtons } from './radio-buttons'

export default { title: 'ui/Form/Radio Buttons' }

export const Unselected = function () {
  const [value, setValue] = useState<null | string>(null)
  return (
    <RadioButtons
      onChange={setValue}
      options={[
        { children: <Text>foo</Text>, value: 'foo' },
        { children: <Text>bar</Text>, value: 'bar' },
        { children: <Text>baz</Text>, value: 'baz' }
      ]}
      value={value}
    />
  )
}

export const Selected = function () {
  const [value, setValue] = useState<null | string>('bar')
  return (
    <RadioButtons
      onChange={setValue}
      options={[
        { children: <Text>foo</Text>, value: 'foo' },
        { children: <Text>bar</Text>, value: 'bar' },
        { children: <Text>baz</Text>, value: 'baz' }
      ]}
      value={value}
    />
  )
}

export const Disabled = function () {
  const [value, setValue] = useState<null | string>('bar')
  return (
    <RadioButtons
      disabled
      onChange={setValue}
      options={[
        { children: <Text>foo</Text>, value: 'foo' },
        { children: <Text>bar</Text>, value: 'bar' },
        { children: <Text>baz</Text>, value: 'baz' }
      ]}
      value={value}
    />
  )
}

export const DisabledOption = function () {
  const [value, setValue] = useState<null | string>('bar')
  return (
    <RadioButtons
      onChange={setValue}
      options={[
        { children: <Text>foo</Text>, value: 'foo' },
        { children: <Text>bar</Text>, value: 'bar' },
        { children: <Text>baz</Text>, disabled: true, value: 'baz' }
      ]}
      value={value}
    />
  )
}

export const BooleanValue = function () {
  const [value, setValue] = useState<null | boolean>(false)
  return (
    <RadioButtons
      onChange={setValue}
      options={[
        { children: <Text>true</Text>, value: true },
        { children: <Text>false</Text>, value: false }
      ]}
      value={value}
    />
  )
}

export const NumericValue = function () {
  const [value, setValue] = useState<null | number>(2)
  return (
    <RadioButtons
      onChange={setValue}
      options={[
        { children: <Text>1</Text>, value: 1 },
        { children: <Text>2</Text>, value: 2 },
        { children: <Text>3</Text>, value: 3 }
      ]}
      value={value}
    />
  )
}
