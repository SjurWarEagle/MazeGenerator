import {Injectable} from '@angular/core';
import {MazeCell} from '../types/maze-cell';
import {Maze} from '../types/maze';

@Injectable({
  providedIn: 'root'
})
export class MazeHelperService {

  constructor() {
  }

  public initEmptySquareMazeArea(maze: Maze, width: number, height: number): void {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        maze.cells.push(new MazeCell(x, y));
      }
    }
    const cell = maze.cells.find(value => value.x === 0 && value.y === 0);
    if (!cell) {
      throw new Error('No Start found');
    }

    maze.begin = cell;
  }

  public initEmptyMazeArea(maze: Maze, form: string[][]): void {
    const width: number = form.length;
    const height: number = this.getWidthOfForm(form);

    for (let y = 0; y < width; y++) {
      for (let x = 0; x < height; x++) {
        const cell = new MazeCell(x, y);
        if (!form[y] || !form[y][x] || form[y][x] === ' ') {
          // console.log('x',x,'/y',y);
          // cell.visited = true;
          cell.background = true;
        }
        maze.cells.push(cell);
      }
    }
  }

  public findPossibleDirections(currentCell: MazeCell, maze: Maze, width: number, height: number): MazeCell[] {
    const rc: MazeCell[] = [];

    let index = this.getIndex(currentCell.x + 1, currentCell.y, width, height);
    if (this.isValidCell(index, maze)) {
      rc.push(maze.cells[index]);
    }

    index = this.getIndex(currentCell.x - 1, currentCell.y, width, height);
    if (this.isValidCell(index, maze)) {
      rc.push(maze.cells[index]);
    }

    index = this.getIndex(currentCell.x, currentCell.y + 1, width, height);
    if (this.isValidCell(index, maze)) {
      rc.push(maze.cells[index]);
    }

    index = this.getIndex(currentCell.x, currentCell.y - 1, width, height);
    if (this.isValidCell(index, maze)) {
      rc.push(maze.cells[index]);
    }

    return rc;
  }

  private isValidCell(index: number, maze: Maze): boolean {
    return index && maze.cells[index] && !maze.cells[index].visited && !maze.cells[index].background;
  }

  public getIndex(x: number, y: number, width: number, height: number): number | undefined {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return undefined;
    }
    return x + y * width;
  }

  public getWidthOfForm(form: string[][]): number {
    let rc = 0

    for (let x = 0; x < form.length; x++) {
      const row = form[x];
      if ((row.length) > rc) {
        rc = row.length;
      }
    }
    return rc;
  }

  public getHeightOfForm(form: string[][]): number {
    return form.length;
  }

  public getBegin(form: string[][]): { x: number; y: number } {
    return this.getPosOfSpecial(form, 'B');
  }

  public getFinish(form: string[][]): { x: number; y: number } {
    return this.getPosOfSpecial(form, 'F');
  }

  private getPosOfSpecial(form: string[][], char: string): { x: number; y: number } {
    const rc: { x: number, y: number } = {x: 0, y: 0};

    for (let y = 0; y < form.length; y++) {
      const row = form[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] === char) {
          rc.x = x;
          rc.y = y;
        }
      }
    }
    return rc;
  }
}
