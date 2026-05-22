class Tile {
  
  constructor(i, j) {
    
    this.type = 'cubicals'
    this.walls = [
      (j === 0),             // north ↑
      (i === 0),             // west  ←
      (j === tilecount - 1), // south ↓
      (i === tilecount - 1), // east  →
    ]  
    this.x = i
    this.y = j

  }
  
}