let wallLookup;
let tilesize = 20;
let tilecount = 40;
let tiles = [];
let colorLookup = {
  cubicals: 0,
  breakroom: 30,
  office: 90,
  toilet: 60,
  Communespace:5,
};

function setup() {
  createCanvas(tilesize * tilecount, tilesize * tilecount);
    colorMode(HSB, 130);
  wallLookup = [
    [createVector(tilesize, 0), createVector(0, 0)],
    [createVector(0, 0), createVector(0, tilesize)],
    [createVector(0, tilesize), createVector(tilesize, tilesize)],
    [createVector(tilesize, tilesize), createVector(tilesize, 0)],
  ];
  for (let i = 0; i < tilecount; i++) {
    tiles[i] = [];
    for (let j = 0; j < tilecount; j++) {
      tiles[i].push(new Tile(i, j));
    }
  }
generateMap();
}
function generateMap() {
  // 1. Reset/Initialize grid tiles to "empty" and wipe old walls
  for (let i = 0; i < tilecount; i++) {
    tiles[i] = [];
    for (let j = 0; j < tilecount; j++) {
      tiles[i].push(new Tile(i, j));
      tiles[i][j].type = "empty"; 
      tiles[i][j].walls = [false, false, false, false];
    }
  }
  
  // 2. Add the dynamic room queue
  addRoom(15, 10, "breakroom");
  addRoom(7, 10, "office");
  addRoom(8, 15, "toilet");
  addRoom(20, 10, "Communespace");
}

function addRoom(w, h, type) {
  let x, y;
  let overlapping = true;
  let attempts = 0;
  let maxAttempts = 1000; // Prevents infinite loops if space runs out

  while (overlapping && attempts < maxAttempts) {
    overlapping = false;
    attempts++;

    // Pick a random position
    x = floor(random(0, tilecount - w + 1));
    y = floor(random(0, tilecount - h + 1));

    // Check if ANY tile in this zone is already taken
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j++) {
        if (tiles[i][j].type !== "empty") {
          overlapping = true;
          break; 
        }
      }
      if (overlapping) break;
    }
  }

  // If a valid spot was found, carve out the room
  if (!overlapping) {
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j++) {
        tiles[i][j].type = type;
      }
    }
    updateWalls();
  } else {
    console.log("Could not find space for room type: " + type);
  }
}

function ForEach2d(array2d, func) {
  for (let i = 0; i < array2d.length; i++) {
    for (let j = 0; j < array2d[i].length; j++) {
      func(tiles[i][j], i, j);
    }
  }
}

function updateWalls() {
  ForEach2d(tiles, ({ x, y, type, walls }) => {
    
    walls[0] = false; walls[1] = false; walls[2] = false; walls[3] = false;
    
    if (y !== 0 && tiles[x][y - 1].type !== type) walls[0] = true;
    if (x !== 0 && tiles[x - 1][y].type !== type) walls[1] = true;
    if (y !== tilecount - 1 && tiles[x][y + 1].type !== type) walls[2] = true;
    if (x !== tilecount - 1 && tiles[x + 1][y].type !== type) walls[3] = true;
  });
}

function draw() {
  background(255);
  ForEach2d(tiles, ({ type, walls, x, y}) => {
    let i = x, j = y
    noStroke();
    
    
       if (type === "empty") {
      fill(colorLookup[type], 0, 20); 
    } else {
      fill(colorLookup[type], 50, 150);
    }
    
    rect(i * tilesize, j * tilesize, tilesize, tilesize);
    
    
    let addVec = createVector(i * tilesize, j * tilesize);
    
    for (let t = 0; t < 4; t++) {
      if (walls[t]) {
        stroke(144,14,150);
        let vec1 = addVec.copy().add(wallLookup[t][4]),
            vec2 = addVec.copy().add(wallLookup[t][3]);
        line(vec1.x*.80, vec1.y*0.80, vec2.x, vec2.y);
      }
    }
    
  });
}

function mousePressed(){
  generateMap();
  
}