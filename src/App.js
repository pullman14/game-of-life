import React, { Component } from 'react';
import {Button} from 'react-bootstrap'
import Board from './Board.js'

export const gridSize = 50
export const gridX = 30
export const gridY = 50
const probability = 3 // each cell has a 1 in $probability chance to start alive
const maxAge = 5

const lowSpeed = 200 //sim step time, ms
const medSpeed = 100
const highSpeed = 50

var generation = 0


class App extends Component {
  constructor(){
    super()

    var arr = createCellArr()

    this.state={
      cellArr: arr,
      simSpeed: medSpeed,
      intervalId: undefined
    }
    this.startSim = this.startSim.bind(this)
    this.pauseSim = this.pauseSim.bind(this)
    this.clearSim = this.clearSim.bind(this)
    this.processCells = this.processCells.bind(this)
    this.setSimSpeed = this.setSimSpeed.bind(this)
    this.numberOfNeighbors = this.numberOfNeighbors.bind(this)
    this.clickToAdd = this.clickToAdd.bind(this)
    this.resetSim = this.resetSim.bind(this)
  }

  startSim() {
    if (!this.state.intervalId) {
      var intervalId = setInterval(this.processCells, this.state.simSpeed)
      const state = this.state
      state.intervalId = intervalId
      this.setState(state)
    }
  }

  pauseSim() {
    clearInterval(this.state.intervalId)
    const state = this.state
    state.intervalId = undefined
    this.setState(state)
  }

  clearSim() {
    var arr = new Array(gridX)
    for (var i = 0; i < gridX; i++){
      arr[i] = new Array(gridY)
      for (var j = 0; j < gridY; j++){
        arr[i][j] = undefined
      }
    }
    const state = this.state
    state.cellArr = arr
    this.setState(state)
    generation = 0
  }

  resetSim() {
    const state = this.state
    state.cellArr = createCellArr()
    if (state.intervalId){
      clearInterval(state.intervalId)
      state.intervalId = undefined
    }
    this.setState(state)
    generation = 0
  }

  processCells() {
    //numberOfNeighbors looks at "previous" state,
    //so we can update cellArr whenever
    const cellArr = copyArray(this.state.cellArr)
    const arr = copyArray(this.state.cellArr)

    for (var i = 0; i < gridX; i++){
      for (var j = 0; j < gridY; j++){
        var neighbors = this.numberOfNeighbors(arr,i,j)
        //Any dead cell with exactly three live neighbours becomes a live cell.
        if (this.state.cellArr[i][j] === undefined){
          if (neighbors === 3) {
            cellArr[i][j] = 0
          }
        }
        else { //if alive
          //Any live cell with fewer than two live neighbours dies.
          //Any live cell with more than three live neighbours dies.
          //Any live cell with two or three live neighbours lives on.
          if (neighbors === 2 || neighbors === 3){
            if (cellArr[i][j] < maxAge){
              cellArr[i][j]++
            }
          }
          else {
            cellArr[i][j] = undefined
          }
        }
      }
    }
    const state = this.state
    state.cellArr = cellArr
    this.setState(state)
    generation++
  }

  numberOfNeighbors(arr, x, y) {
    //check left side from x, y coordinates
    var total = 0
    for (var i = x-1; i <= x+1; i++){
      for (var j = y-1; j <= y+1; j++){
        if (i===x && j===y){ //you arent your own neighbor
          continue
        }
        if (!IsInsideGrid(i,j)){ //not in the grid?
          continue
        }
        if (arr[i][j] !== undefined) //if cell here is alive
          total++
        }
    }
    if (total !== 0){
    }
    return total
  }

  setSimSpeed(timems) {
    this.pauseSim()
    var state = this.state
    state.simSpeed = timems
    this.setState(state)
    this.startSim()
  }

  clickToAdd(x,y) {
    const arr = this.state.cellArr.slice()
    if (arr[x][y] === undefined){
      arr[x][y] = 0
    }
    else {
      arr[x][y] = undefined
    }
    const state = this.state
    state.cellArr = arr
    this.setState(state)
  }

  render() {
    return (
      <div className="container">
        <h1>The Game of Life</h1>
        <Button onClick={this.startSim}>Run</Button>
        <Button onClick={this.pauseSim}>Pause</Button>
        <Button onClick={this.resetSim}>Reset</Button>
        <Button onClick={this.clearSim}>Clear</Button>
        <Button onClick={this.processCells}>Step</Button>
        <h3>{"Generation:" + generation}</h3>
        <Board cellArr={this.state.cellArr} clickToAdd={this.clickToAdd}/>
        <Button onClick={()=>{this.setSimSpeed(highSpeed)}}>2x</Button>
        <Button onClick={()=>{this.setSimSpeed(medSpeed)}}>1x</Button>
        <Button onClick={()=>{this.setSimSpeed(lowSpeed)}}>0.5x</Button>
        <h4>Rules:</h4>
        <p>Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.</p>
        <p>Any live cell with two or three live neighbours lives on to the next generation.</p>
        <p>Any live cell with more than three live neighbours dies, as if by overpopulation.</p>
        <p>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</p>
        <p>(Click anywhere on the grid to add/remove cells.)</p>
      </div>
    );
  }
}

function createCellArr() {
  var arr = new Array(gridX)
  for (var i = 0; i < gridX; i++){
    arr[i] = new Array(gridY)
    for (var j = 0; j < gridY; j++){
      arr[i][j] = deadOrAlive()
    }
  }
  return arr
}

//returns true for alive, false for dead
function deadOrAlive() {
  var num = Math.ceil(Math.random() * probability)
  if (num === probability){
    return maxAge
  }
  return undefined
}

function IsInsideGrid(x,y) {
  if (x >=0 && x < gridX && y >= 0 && y < gridY){
    return true
  }
  return false
}

function copyArray(arr){
    var new_arr = arr.slice(0);
    for(var i = new_arr.length; i--;)
        if(new_arr[i] instanceof Array)
            new_arr[i] = copyArray(new_arr[i]);
    return new_arr;
}

export default App;
