import { input } from './input.js'

interface Item {
  x: number
  y: number
  index: number
  isSymbol: boolean
  isDot: boolean
  isDigit: boolean
  value: string
  isAdjacentToSymbol: boolean
  adjacentSymbolItems: string[]
}

class Schema {
  items: Item[]
  length: number
  height: number

  constructor (input: string) {
    const inputRows = input.split('\n')
    const items: Item[] = []
    this.height = inputRows.length
    this.length = inputRows[0].length

    inputRows.forEach((row, rowIndex) => {
      const elements = row.split('')

      elements.forEach((item, itemIndex) => {
        items.push(createItem(item, itemIndex, rowIndex, itemIndex + rowIndex * this.length))
      })
    })

    this.items = items.map(item => {
      item.adjacentSymbolItems = getItemsAdjacentToSymbol(item, items, this.length, this.height)
      item.isAdjacentToSymbol = item.adjacentSymbolItems.length > 0

      return item
    })
  }
}

function getItemsAdjacentToSymbol (item: Item, items: Item[], length: number, height: number): string[] {
  const { isDot, isSymbol, index } = item

  if (isDot || isSymbol) {
    return []
  }

  return [items[index - length - 1],
    items[index - length],
    items[index - length + 1],
    items[index - 1],
    items[index + 1],
    items[index + length - 1],
    items[index + length],
    items[index + length + 1]].filter(item => {
    if (typeof item !== 'undefined') {
      return item.isSymbol
    }

    return false
  }).map(({ value }) => value)
}

function getNumbersFromAdjacentSymbols (items: Item[]): number[] {
  const numberStrings: string[] = []

  let currentNumberString = ''
  let currentNumberStringIsAdjacent = false

  items.forEach(item => {
    const { isDigit, isSymbol, isDot, value, isAdjacentToSymbol } = item

    const notNumber = isSymbol || isDot
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
      currentNumberString += value
    }

    if (isDigit && isAdjacentToSymbol) {
      currentNumberStringIsAdjacent = true
    }
  })

  return numberStrings.map(numstr => Number(numstr))
}

function createItem (item: string, x: number, y: number, index: number): Item {
  return {
    x,
    y,
    isDigit: isDigit(item),
    index,
    isSymbol: isSymbol(item),
    isDot: isDot(item),
    value: item,
    isAdjacentToSymbol: false,
    adjacentSymbolItems: []
  }
}

function isDigit (input: string): boolean {
  const digitRegex = /\d/

  return digitRegex.test(input)
}

function isDot (input: string): boolean {
  return input === '.'
}

function isSymbol (input: string): boolean {
  return !isDigit(input) && !isDot(input)
}

function firstSoultion (input: string): number {
  const schema = new Schema(input)

  const numbers = getNumbersFromAdjacentSymbols(schema.items)

  return numbers.reduce((sum, num) => sum + num, 0)
}

console.log(firstSoultion(input))
