import { dirname } from 'path'

import { fileURLToPath } from 'url'
import { getInput } from '../utils/getInput.js'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)
const input = getInput(_dirname + '/input.txt')

class Card {
  readonly #winningNumbers: number[] = []
  readonly #playerNumbers: number[] = []

  constructor (input: string) {
    const [winningNums, playerNums] = input
      .replace(/Card \d+: /, '')
      .split('|')
      .map(str => str
        .trim()
        .split(' ')
        .filter(str => str.length > 0)
        .map(Number)
      )

    this.#playerNumbers = playerNums
    this.#winningNumbers = winningNums
  }

  findWins (): number[] {
    return this.#playerNumbers.filter(number => this.#winningNumbers.includes(number))
  }

  getPoints (): number {
    const wins = this.findWins()
    const numberOfWins = wins.length
    console.log(this.#winningNumbers, this.#playerNumbers)
    if (numberOfWins === 0) {
      return 0
    }

    console.log('number of wins', numberOfWins)
    console.log('points', 2 ** (numberOfWins - 1))

    return 2 ** (numberOfWins - 1)
  }
}

function firstSolution (): number {
  const inputLines = input.split('\n')
  const cards = inputLines.map(line => new Card(line))

  return cards.reduce((sum, card) => sum + card.getPoints(), 0)
}

function secondSolution (): number {
  const inputLines = input.split('\n')
  const cards = inputLines.map(line => new Card(line))

  const cardsToProcess: Card[][] = cards.map(card => [card])

  let index = 0

  while (index <= cardsToProcess.length) {
    const currentCardStack = cardsToProcess[index]

    currentCardStack?.forEach(card => {
      const wins = card?.findWins().length

      for (let j = index + 1; j <= index + wins; j++) {
        cardsToProcess[j]?.push(cardsToProcess[j][0])
      }
    })

    index += 1
  }

  return cardsToProcess.flat().length
}

console.log(firstSolution())

console.log(secondSolution())
