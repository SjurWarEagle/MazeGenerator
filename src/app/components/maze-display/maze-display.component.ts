import {Component, ElementRef, Input, AfterViewInit, ViewChild} from '@angular/core';
import {MazeCell} from '../../../types/maze-cell';
import {Maze} from '../../../types/maze';
import {maxBy, minBy} from "lodash";

@Component({
  selector: 'app-maze-display',
  templateUrl: './maze-display.component.html',
  styleUrls: ['./maze-display.component.scss']
})
export class MazeDisplayComponent implements AfterViewInit {
  public cellWidth = 32;
  private COLOR_BEGIN = 'red';
  private COLOR_LOOT = 'orange';
  private COLOR_FINISH = 'lightgreen';
  private COLOR_SOLUTION = 'lightblue';
  private COLOR_OTHER = 'brown';
  private COLOR_NORMAL = 'white';
  // private COLOR_NORMAL = 'lightgray';

  @Input()
  set maze(maze: Maze) {
    this.localMaze = maze;
    const minX = minBy(maze.cells, (cell) => cell.x)!.x;
    const maxX = maxBy(maze.cells, (cell) => cell.x)!.x;
    const minY = minBy(maze.cells, (cell) => cell.y)!.y;
    const maxY = maxBy(maze.cells, (cell) => cell.y)!.y;
    this.width = Math.abs(minX - maxX) + 1;
    this.height = Math.abs(minY - maxY) + 1;
  }

  public width = 1;
  public height = 1;
  public localMaze: Maze = new Maze();

  @Input()
  set showSolution(state: boolean) {
    this.localShowSolution = state;
    this.drawMaze();
  }

  public localShowSolution = true;

  @ViewChild('mazearea', {static: true})
  // @ts-ignore
  public mazeArea: ElementRef<HTMLCanvasElement>;

  // @ts-ignore
  public context: CanvasRenderingContext2D | null;

  constructor() {
  }

  private drawWall(cell: MazeCell, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    if (cell.walls[0]) {
      ctx.moveTo(cell.x * this.cellWidth, cell.y * this.cellWidth);
      ctx.lineTo((cell.x + 1) * this.cellWidth, cell.y * this.cellWidth);
    }
    if (cell.walls[1]) {
      ctx.moveTo((cell.x + 1) * this.cellWidth, cell.y * this.cellWidth);
      ctx.lineTo((cell.x + 1) * this.cellWidth, (cell.y + 1) * this.cellWidth);
    }
    if (cell.walls[2]) {
      ctx.moveTo((cell.x) * this.cellWidth, (cell.y + 1) * this.cellWidth);
      ctx.lineTo((cell.x + 1) * this.cellWidth, (cell.y + 1) * this.cellWidth);
    }
    if (cell.walls[3]) {
      ctx.moveTo(cell.x * this.cellWidth, (cell.y) * this.cellWidth);
      ctx.lineTo(cell.x * this.cellWidth, (cell.y + 1) * this.cellWidth);
    }
    ctx.stroke();
  }

  private drawSpecialField(cell: MazeCell, ctx: CanvasRenderingContext2D): void {
    if (!this.localMaze) {
      return;
    }
    const isBegin = cell.x === this.localMaze.begin.x && cell.y === this.localMaze.begin.y;
    const isFinish = cell.x === this.localMaze.finish.x && cell.y === this.localMaze.finish.y;
    const isPartOfWayToExit = this.localMaze.wayToExit.find(pos => cell.x === pos.x && cell.y === pos.y) !== undefined;
    const isLoot = this.localMaze.loot.find(pos => cell.x === pos.x && cell.y === pos.y) !== undefined;

    if (isFinish) {
      ctx.fillStyle = this.COLOR_FINISH;
    } else if (isLoot) {
      ctx.fillStyle = this.COLOR_LOOT;
    } else if (isBegin) {
      ctx.fillStyle = this.COLOR_BEGIN;
    } else if (isPartOfWayToExit && this.localShowSolution) {
      ctx.fillStyle = this.COLOR_SOLUTION;
    } else if (cell.visited) {
      ctx.fillStyle = this.COLOR_NORMAL;
    } else {
      ctx.fillStyle = this.COLOR_OTHER;
    }
    ctx.fillRect(cell.x * this.cellWidth, cell.y * this.cellWidth, this.cellWidth, this.cellWidth);
  }


  public drawMaze(): void {

    const ctx = this.mazeArea.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('Problem with ctx==null');
    }

    for (const cellsToRedrawItem of this.localMaze.cells) {
      this.drawSpecialField(cellsToRedrawItem, ctx);
      this.drawWall(cellsToRedrawItem, ctx);
    }
  }

  // @ts-ignore
  public ngAfterViewInit(): void {
    // const mazeSize = this.mazeArea.nativeElement.getBoundingClientRect();
    // this.cellWidth = Math.floor(Math.min(mazeSize.width, mazeSize.height) / Math.sqrt(this.maze.cells.length));
    this.drawMaze();

  }
}
