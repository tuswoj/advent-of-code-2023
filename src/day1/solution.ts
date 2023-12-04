import { input } from './input.js'

const numbersMap = {
  one: 'o1e',
  two: 't2o',
  three: 't3e',
  four: 'f4r',
  five: 'f5e',
  six: 's6x',
  seven: 's7n',
  eight: 'e8t',
  nine: 'n9e'
}

/**
 *
 * @param {string} input signle line of input
 */
function transformSpelledNumbers (textline: string): string {
  let inputCopy = ''

  textline.split('').forEach((letter) => {
    inputCopy += letter

    Object.entries(numbersMap).forEach(([key, value]) => {
      inputCopy = inputCopy.replaceAll(key, value)
    })
  })

  return inputCopy
}

export function solvePuzzle (input: string): number {
  const textLines = input.split('\n')

  const transformedInput = textLines.map(transformSpelledNumbers)

  const nonDigitRegex = /\D*/g

  const onlyNumsInText = transformedInput.map((textLine) => {
    return textLine.replaceAll(nonDigitRegex, '')
  })

  const firstAndLastDigitConcatenated = onlyNumsInText.map(text => {
    const firstLetter = text[0]
    const lastLetter = text[text.length - 1]

    return firstLetter + lastLetter
  })

  return firstAndLastDigitConcatenated.reduce((sum, current) => {
    const number = Number(current)

    if (!isNaN(number)) {
      return sum + number
    }

    return sum
  }, 0)
}

console.log(solvePuzzle(input))
