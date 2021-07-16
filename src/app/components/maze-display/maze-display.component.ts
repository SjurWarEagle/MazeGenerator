import {Component, ElementRef, Input, NgZone, OnInit} from '@angular/core';
import {MazeCell} from '../../../types/maze-cell';
import {Maze} from '../../../types/maze';
import {maxBy, minBy} from 'lodash';
import {Application, Graphics} from 'pixi.js';

@Component({
  selector: 'app-maze-display',
  templateUrl: './maze-display.component.html',
  styleUrls: ['./maze-display.component.scss']
})
export class MazeDisplayComponent implements OnInit {
  public app: Application;

  public cellWidth = 16;
  private COLOR_BEGIN = 0xFF0000;
  private COLOR_LOOT = 0xFF00FF;
  private COLOR_FINISH = 0x00FF00;
  private COLOR_SOLUTION = 0x00BFFF;
  private COLOR_OTHER = 0xFF5522;
  private COLOR_BACKGROUND = 0xAAAAAA;
  private COLOR_NORMAL = 0xFFFFFF;

  @Input()
  set maze(maze: Maze) {
    this.localMaze = maze;
    const minX = minBy(maze.cells, (cell) => cell.x)!.x;
    const maxX = maxBy(maze.cells, (cell) => cell.x)!.x;
    const minY = minBy(maze.cells, (cell) => cell.y)!.y;
    const maxY = maxBy(maze.cells, (cell) => cell.y)!.y;
    this.width = Math.abs(minX - maxX) + 1;
    this.height = Math.abs(minY - maxY) + 1;
    this.app = new Application({width: this.width * this.cellWidth, height: this.height * this.cellWidth});
  }

  public width = 1;
  public height = 1;
  public localMaze: Maze = new Maze();

  @Input()
  set showSolution(state: boolean) {
    if (this.localShowSolution !== state) {
      this.localShowSolution = state;
      this.drawMaze();
    }
  }

  public localShowSolution = true;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {
  }

  private drawWall(cell: MazeCell): void {
    if (cell.background) {
      return;
    }
    const line = new Graphics();
    line.lineStyle(2, 0x334455, 1);

    if (cell.walls[0]) {
      line.moveTo(cell.x * this.cellWidth, cell.y * this.cellWidth);
      line.lineTo((cell.x + 1) * this.cellWidth, cell.y * this.cellWidth);
    }
    if (cell.walls[1]) {
      line.moveTo((cell.x + 1) * this.cellWidth, cell.y * this.cellWidth);
      line.lineTo((cell.x + 1) * this.cellWidth, (cell.y + 1) * this.cellWidth);
    }
    if (cell.walls[2]) {
      line.moveTo((cell.x) * this.cellWidth, (cell.y + 1) * this.cellWidth);
      line.lineTo((cell.x + 1) * this.cellWidth, (cell.y + 1) * this.cellWidth);
    }
    if (cell.walls[3]) {
      line.moveTo(cell.x * this.cellWidth, (cell.y) * this.cellWidth);
      line.lineTo(cell.x * this.cellWidth, (cell.y + 1) * this.cellWidth);
    }
    this.app.stage.addChild(line);
  }

  private drawSpecialField(cell: MazeCell): void {
    if (!this.localMaze) {
      return;
    }
    const isBegin = cell.x === this.localMaze.begin.x && cell.y === this.localMaze.begin.y;
    const isFinish = cell.x === this.localMaze.finish.x && cell.y === this.localMaze.finish.y;
    const isPartOfWayToExit = this.localMaze.wayToExit.find(pos => cell.x === pos.x && cell.y === pos.y) !== undefined;
    const isLoot = this.localMaze.loot.find(pos => cell.x === pos.x && cell.y === pos.y) !== undefined;


    const field = new Graphics();
    if (isFinish) {
      field.beginFill(this.COLOR_FINISH);
    } else if (isLoot) {
      field.beginFill(this.COLOR_LOOT);
    } else if (isBegin) {
      field.beginFill(this.COLOR_BEGIN);
    } else if (isPartOfWayToExit && this.localShowSolution) {
      field.beginFill(this.COLOR_SOLUTION);
    } else if (cell.visited) {
      field.beginFill(this.COLOR_NORMAL);
    } else if (cell.background) {
      field.beginFill(this.COLOR_BACKGROUND);
    } else {
      field.beginFill(this.COLOR_OTHER);
    }
    field.drawRect(cell.x * this.cellWidth, cell.y * this.cellWidth, this.cellWidth, this.cellWidth);
    this.app.stage.addChild(field);
  }

  public drawMaze(): void {
    for (const cellsToRedrawItem of this.localMaze.cells) {
      this.drawSpecialField(cellsToRedrawItem);
      this.drawWall(cellsToRedrawItem);
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.elementRef.nativeElement.appendChild(this.app.view);
      this.drawMaze();
    });
  }

}
