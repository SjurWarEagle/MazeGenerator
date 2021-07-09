import {Component, OnInit} from '@angular/core';
import {MazeGeneratorService} from "../../../services/maze-generator.service";
import {DataHolderService} from "../../../services/data-holder.service";

@Component({
  selector: 'app-generate-new',
  templateUrl: './generate-new.component.html',
  styleUrls: ['./generate-new.component.scss']
})
export class GenerateNewComponent implements OnInit {
  public showSolution = false;
  public width = 20;
  public height = 20;

  constructor(private mazeGeneratorService: MazeGeneratorService, public dataHolderService: DataHolderService) {
  }

  public ngOnInit(): void {
  }

  public startGenerate(): void {
    this.dataHolderService.maze = undefined;
    // using set timeout to trigger the change detection
    setTimeout(() => {
      this.dataHolderService.maze = this.mazeGeneratorService.generateMaze(this.width, this.height);
    });
  }

}
