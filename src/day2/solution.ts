import { input } from './input.js'

const GAME_PREFIX = 'Game '

const testRuleSet: CubesSet = {
  red: 12,
  green: 13,
  blue: 14
}

interface CubesSet {
  red: number
  green: number
  blue: number
}

interface GameResult {
  id: string
  draws: CubesSet[]
}

class Game {
  public gameResult: GameResult

  constructor (inputString: string) {
    this.gameResult = this.#parseGameString(inputString)
  }

  getGamePower (): number {
    const { red, green, blue } = this.findMinNumberOfCubes()
    console.log(this.findMinNumberOfCubes())

    return escapeZero(red) * escapeZero(green) * escapeZero(blue)
  }

  findMinNumberOfCubes (): CubesSet {
    return this.gameResult.draws.reduce<CubesSet>((minimalSet, { red, green, blue }) => {
      const { red: minRed, green: minGreen, blue: minBlue } = minimalSet
      if (minRed < red) {
        minimalSet.red = red
      }

      if (minBlue < blue) {
        minimalSet.blue = blue
      }

      if (minGreen < green) {
        minimalSet.green = green
      }

      return minimalSet
    }, { red: 0, blue: 0, green: 0 })
  }

  #parseGameString (inputString: string): GameResult {
    const [name, drawsString] = inputString.split(':')
    const gameId = name.split(GAME_PREFIX)[1]

    const draws = drawsString.split(';').map(drawString => {
      return drawString.split(',').reduce<CubesSet>((gameDraw, currentDraw) => {
        const [numberStr, color] = currentDraw.trim().split(' ')
        const number = Number(numberStr)

        switch (color) {
          case 'red': {
            gameDraw.red = number
            break
          }
          case 'green': {
            gameDraw.green = number
            break
          }
          case 'blue': {
            gameDraw.blue = number
            break
          }
        }

        return gameDraw
      }, { red: 0, green: 0, blue: 0 })
    })

    return {
      id: gameId,
      draws
    }
  }
}

function escapeZero (num: number): number {
  if (num === 0) {
    return 1
  }

  return num
}

function testGame (game: Game, gameRuleSet: CubesSet): boolean {
  const { red: redMax, green: greenMax, blue: blueMax } = gameRuleSet
  const draws = game.gameResult.draws

  return draws.every(draw => {
    const { red, green, blue } = draw

    return testColor(red, redMax) && testColor(green, greenMax) && testColor(blue, blueMax)
  })
}

function testColor (color: number | undefined, maxColor: number | undefined): boolean {
  if (typeof color === 'number' && typeof maxColor === 'number') {
    return color <= maxColor
  }

  return true
}

function firstSolution (input: string): number {
  const gameStrings = input.split('\n').filter(s => s.length > 0)

  const games = gameStrings.map(gameString => new Game(gameString))

  const correctGames = games.filter(game => testGame(game, testRuleSet))

  const correctGamesIds = correctGames.map(game => game.gameResult.id)

  const correctGamesIdsNums = correctGamesIds.map(id => Number(id))

  return correctGamesIdsNums.reduce((sum, id) => sum + id, 0)
}

function secondSolution (input: string): number {
  const gameStrings = input.split('\n').filter(s => s.length > 0)

  const games = gameStrings.map(gameString => new Game(gameString))

  const gamePowers = games.map(game => game.getGamePower())

  return gamePowers.reduce((sum, power) => sum + power, 0)
}

firstSolution(input)
secondSolution(input)
