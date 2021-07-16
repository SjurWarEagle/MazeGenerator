import {Injectable} from '@angular/core';
import {MazeCell} from '../types/maze-cell';
import {MazeHelperService} from './maze-helper.service';
import {Maze} from '../types/maze';
import {DataHolderService} from './data-holder.service';

@Injectable({
  providedIn: 'root'
})
export class MazeGeneratorFormsService {
  private cellStack: MazeCell[] = [];

  constructor(private mazeHelperService: MazeHelperService,
              private dataHolderService: DataHolderService) {
  }

  public generateMaze(form: string[][]): Maze {
    if (!form) {
      return;
    }
    const maze: Maze = new Maze();
    form = this.scaleUpForm(form, this.dataHolderService.formScale.value);
    this.mazeHelperService.initEmptyMazeArea(maze, form);
    const width = this.mazeHelperService.getWidthOfForm(form);
    const height = this.mazeHelperService.getHeightOfForm(form);
    this.fillBegin(form, maze);
    this.fillFinish(form, maze);

    const currentCell = maze.begin;
    this.cellStack.push(currentCell);

    this.walkMaze(maze, width, height);
    return maze;
  }

  private scaleUpForm(form: string[][], scale: number): string[][] {
    const rc: string[][] = [];

    for (const orgRow of form) {
      const rows = [];
      for (let i = 0; i < scale; i++) {
        rows.push([]);
      }

      for (let c = 0; c < scale; c++) {
        for (const currentField of orgRow) {
          if (currentField === 'B') {
            rows[c].push('B');
            for (let c2 = 0; c2 < scale - 1; c2++) {
              rows[c].push('#');
            }
          } else if (currentField === 'F') {
            rows[c].push('F');
            for (let c2 = 0; c2 < scale - 1; c2++) {
              rows[c].push('#');
            }
          } else {
            for (let c2 = 0; c2 < scale; c2++) {
              rows[c].push(currentField);
            }
          }
        }
      }

      for (let i = 0; i < scale; i++) {
        rc.push(rows[i]);
      }
    }

    return rc;
  }

  private fillBegin(form: string[][], maze: Maze): void {
    const begin = this.mazeHelperService.getBegin(form);
    maze.begin = new MazeCell(begin.x, begin.y);
    if (!maze.begin) {
      throw new Error('no finish point found');
    }
  }

  private fillFinish(form: string[][], maze: Maze): void {
    const finish = this.mazeHelperService.getFinish(form);
    maze.finish = new MazeCell(finish.x, finish.y);
    if (!maze.finish) {
      throw new Error('no finish point found');
    }
  }

  private storeWayToExit(maze: Maze, currentCell: MazeCell): void {
    if (currentCell.x === maze.finish.x && currentCell.y === maze.finish.y) {
      maze.wayToExit = [];
      this.cellStack.forEach(value => {
        // if (!maze.wayToExit.find(value1 => value1.x==value.x&&value1.y==value.y)){
        maze.wayToExit.push(value);
        // }
      });
    }
  }

  private walkMaze(maze: Maze, width: number, height: number): void {
    let emergency = 100_000;
    while (this.cellStack.length !== 0) {
      const currentCell = this.cellStack.pop()!;
      this.storeWayToExit(maze, currentCell);
      // console.log('width',width );
      // console.log('height',height );
      const selectedTarget = this.getRandomNeighbour(currentCell, maze, width, height);
      // console.log('selectedTarget',selectedTarget );

      if (selectedTarget) {
        this.cellStack.push(currentCell);
        this.removeWalls(currentCell, selectedTarget);
        selectedTarget.visited = true;
        this.cellStack.push(selectedTarget);
      }
      emergency--;
      if (emergency <= 0) {
        console.log('Loop too long!');
        break;
      }
    }
  }

  private getRandomNeighbour(currentCell: MazeCell, maze: Maze, width: number, height: number): MazeCell {
    const directions = this.mazeHelperService.findPossibleDirections(currentCell, maze, width, height);
    // console.log('currentCell',currentCell);
    // console.log('directions',directions);

    const rnd = Math.floor(Math.random() * directions.length);
    return directions[rnd];
  }

  removeWalls(currentCell: MazeCell, targetCell: MazeCell): void {

    if (currentCell.x < targetCell.x) {
      currentCell.walls[1] = false;
      targetCell.walls[3] = false;
    }
    if (currentCell.x > targetCell.x) {
      currentCell.walls[3] = false;
      targetCell.walls[1] = false;
    }
    if (currentCell.y < targetCell.y) {
      currentCell.walls[2] = false;
      targetCell.walls[0] = false;
    }
    if (currentCell.y > targetCell.y) {
      currentCell.walls[0] = false;
      targetCell.walls[2] = false;
    }
  }

}
