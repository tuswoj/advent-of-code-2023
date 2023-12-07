import { input } from './input.js'

class SchemaItem {
  public value: string
  public index: number

  constructor (value: string, index: number) {
    this.value = value
    this.index = index
  }

  public isDigit (): boolean {
    const digitRegex = /\d/

    return digitRegex.test(this.value)
  }

  public isDot (): boolean {
    return this.value === '.'
  }

  public isGearSymbol (): boolean {
    return this.value === '*'
  }

  public isSymbol (): boolean {
    return !this.isDigit() && !this.isDot()
  }

  public isAdjacentToSymbol (schema: Schema): boolean {
    return schema.findAdjacentItems(this).some(item => item?.isSymbol())
  }

  public isAdjacentToDigit (schema: Schema): boolean {
    return schema.findAdjacentItems(this).some(item => item?.isDigit())
  }
}

class Schema {
  items: SchemaItem[]
  length: number
  height: number

  constructor (input: string) {
    const inputRows = input.split('\n')
    const items: SchemaItem[] = []
    this.height = inputRows.length
    this.length = inputRows[0].length

    inputRows.forEach((row, rowIndex) => {
      const elements = row.split('')

      elements.forEach((item, itemIndex) => {
        const index = rowIndex * this.length + itemIndex
        items.push(new SchemaItem(item, index))
      })
    })

    this.items = items
  }

  public findAdjacentItems (item: SchemaItem): SchemaItem[] {
    const { length } = this
    const { index } = item
    const items = this.items

    return [
      items?.[index - length - 1],
      items?.[index - length],
      items?.[index - length + 1],
      items?.[index - 1],
      items?.[index + 1],
      items?.[index + length - 1],
      items?.[index + length],
      items?.[index + length + 1]
    ]
  }
}

function getNumbersFromAdjacentSymbols (schema: Schema): number[] {
  const numberStrings: string[] = []
  const items = schema.items

  let currentNumberString = ''
  let currentNumberStringIsAdjacent = false

  items.forEach(item => {
    const isDigit = item.isDigit()

    const notNumber = !isDigit
    const currentStringNotEmpty = currentNumberString.length > 0

    // We just left the number string
    if (currentStringNotEmpty && notNumber) {
      if (currentNumberStringIsAdjacent) {
        numberStrings.push(currentNumberString)
      }

      currentNumberString = ''
      currentNumberStringIsAdjacent = false
    }

    if (isDigit) {
      currentNumberString += item.value
    }

    if (isDigit && item.isAdjacentToSymbol(schema)) {
      currentNumberStringIsAdjacent = true
    }
  })

  return numberStrings.map(numstr => Number(numstr))
}

function getGearRatio (schema: Schema): number {
  const items = schema.items

  const gearsAdjacentToDigits = items
    .filter((item) => item.isGearSymbol())
    .filter(item => item.isAdjacentToDigit(schema))

  const adjacentnums = gearsAdjacentToDigits
    .map(item => getAdjacentNumbers(item, schema))

  return adjacentnums
    .filter(numArray => numArray.length === 2)
    .map(([a, b]) => a * b)
    .reduce((sum, num) => sum + num, 0)
}

function getAdjacentNumbers (item: SchemaItem, schema: Schema): number[] {
  const items = schema.items
  const numbers = []

  const adjacentDigits = schema.findAdjacentItems(item).filter(item => item.isDigit())

  let availableDigits = [...adjacentDigits]

  let currentNumberString = ''

  for (let i = 0; i <= adjacentDigits.length; i++) {
    const digit = adjacentDigits[i]

    if (digit === undefined) {
      break
    }

    if ((availableDigits.findIndex(({ index }) => index === digit?.index)) === -1) {
      // We have already visited this item
      continue
    }

    // loop to the left
    let currentLeftItem = digit
    let nextLeftItem = items?.[currentLeftItem.index - 1]

    while (nextLeftItem?.isDigit()) {
      currentNumberString = nextLeftItem.value + currentNumberString
      currentLeftItem = nextLeftItem
      availableDigits = availableDigits.filter(({ index }) => index !== currentLeftItem.index)
      nextLeftItem = items?.[currentLeftItem.index - 1]
    }

    currentNumberString += digit.value

    // loop to the right
    let currentRight = digit
    let nextRightItem = items?.[currentRight.index + 1]

    while (nextRightItem?.isDigit()) {
      currentNumberString += nextRightItem.value
      currentRight = nextRightItem
      availableDigits = availableDigits.filter(({ index }) => index !== currentRight.index)
      nextRightItem = items?.[currentRight.index + 1]
    }

    numbers.push(Number(currentNumberString))

    currentNumberString = ''
  }

  return numbers
}

function firstSoultion (input: string): number {
  const schema = new Schema(input)

  const numbers = getNumbersFromAdjacentSymbols(schema)

  return numbers.reduce((sum, num) => sum + num, 0)
}

function secondSolution (input: string): number {
  const schema = new Schema(input)

  return getGearRatio(schema)
}

console.log('First solution:', firstSoultion(input))

console.log('Second solution:', secondSolution(input))
