const rotateLeft = (matrix) => {
  let rows = matrix.length
  let columns = matrix[0].length
  let res = []
  for (let row = 0; row < rows; row++) {
    res.push([])
    for (let column = 0; column < columns; ++column) {
      res[row][column] = matrix[column][columns - row - 1]
    }
  }
  return res
}

class Tile {
  constructor (value, row, col) {
    this.value = value || 0
    this.row = row || -1
    this.col = col || -1

    this.oldRow = -1
    this.oldCol = -1

    this.markForDeletion = false
    this.mergedInto = null

    this.id = Tile.tileId++
  }

  moveTo (row, col) {
    this.oldRow = this.row
    this.oldCol = this.col

    this.row = row
    this.col = col
  }

  isNew () {
    return this.oldRow === -1 && !this.mergedInto
  }

  fromRow () {
    return this.mergedInto ? this.row : this.oldRow
  }

  fromCol () {
    return this.mergedInto ? this.col : this.oldCol
  }

  toRow () {
    return this.mergedInto ? this.mergedInto.row : this.row
  }

  toCol () {
    return this.mergedInto ? this.mergedInto.col : this.col
  }

  hasMoved () {
    return (this.fromRow() !== -1 && (this.fromRow() !== this.toRow() || this.fromCol() !== this.toCol())) || this.mergedInto
  }
}

Tile.tileId = 0

class Board {
  constructor (size = 4) {
    this.size = size
    this.tiles = []
    this.cells = []

    for (let i = 0; i < this.size; i++) {
      this.cells[i] = [
        this.addTile(),
        this.addTile(),
        this.addTile(),
        this.addTile()
      ]
    }

    this.addRandomTile()
    this.setPositions()
    this.won = false
  }

  addTile () {
    let tile = new Tile()
    Tile.apply(tile, arguments)
    this.tiles.push(tile)
    return tile
  }

  addRandomTile () {
    let emptyCells = []
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.cells[r][c].value === 0) {
          emptyCells.push({ row: r, col: c })
        }
      }
    }
    let index = ~~(Math.random() * emptyCells.length)
    let cell = emptyCells[index]
    let newValue = Math.random() < 0.1 ? 4 : 2
    this.cells[cell.row][cell.col] = this.addTile(newValue)
  }

  moveLeft () {
    let hasChanged = false
    for (let row = 0; row < this.size; row++) {
      var currentRow = this.cells[row].filter(tile => tile.value !== 0)
      var resultRow = []
      for (let target = 0; target < this.size; target++) {
        var targetTile = currentRow.length ? currentRow.shift() : this.addTile()
        if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
          var tile1 = targetTile
          targetTile = this.addTile(targetTile.value)
          tile1.mergedInto = targetTile
          var tile2 = currentRow.shift()
          tile2.mergedInto = targetTile
          targetTile.value += tile2.value
        }
        resultRow[target] = targetTile
        this.won |= (targetTile.value === 2048)
        hasChanged |= (targetTile.value !== this.cells[row][target].value)
      }
      this.cells[row] = resultRow
    }
    return hasChanged
  }

  setPositions () {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        tile.oldRow = tile.row
        tile.oldCol = tile.col
        tile.row = rowIndex
        tile.col = colIndex
        tile.markForDeletion = false
      })
    })
  }

  clearOldTiles () {
    this.tiles = this.tiles.filter(tile => tile.markForDeletion === false)
    this.tiles.forEach(tile => { tile.markForDeletion = true })
  }

  move (direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles()
    for (let i = 0; i < direction; ++i) {
      this.cells = rotateLeft(this.cells)
    }
    let hasChanged = this.moveLeft()
    for (let i = direction; i < 4; ++i) {
      this.cells = rotateLeft(this.cells)
    }
    if (hasChanged) {
      this.addRandomTile()
    }
    this.setPositions()
    return this
  }

  hasWon () {
    return this.won
  }

  hasLost () {
    let deltaX = [-1, 0, 1, 0]
    let deltaY = [0, -1, 0, 1]
    let canMove = false
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        canMove |= (this.cells[row][col].value === 0)
        for (let dir = 0; dir < 4; dir++) {
          var newRow = row + deltaX[dir]
          var newCol = col + deltaY[dir]
          if (newRow < 0 || newRow >= this.size || newCol < 0 || newCol >= this.size) {
            continue
          }
          canMove |= (this.cells[row][col].value === this.cells[newRow][newCol].value)
        }
      }
    }
    return !canMove
  }
}

export { Board }
