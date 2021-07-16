import {Component, OnDestroy, OnInit} from '@angular/core';
import {MazeGeneratorService} from '../../../services/maze-generator.service';
import {DataHolderService} from '../../../services/data-holder.service';
import {MazeGeneratorFormsService} from '../../../services/maze-generator-forms.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-generate-new',
  templateUrl: './generate-new.component.html',
  styleUrls: ['./generate-new.component.scss']
})
export class GenerateNewComponent implements OnInit, OnDestroy {
  public showSolution = false;
  public width = 20;
  public height = 20;
  private formSub: Subscription;

  constructor(private mazeGeneratorService: MazeGeneratorService,
              private mazeGeneratorFormService: MazeGeneratorFormsService,
              public dataHolderService: DataHolderService
  ) {
  }

  public ngOnDestroy(): void {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.formSub = this.dataHolderService.form.subscribe(form => {
      setTimeout(() => {
        this.dataHolderService.maze = undefined;
        this.dataHolderService.maze = this.mazeGeneratorFormService.generateMaze(form);
      });
    });
  }

  public startGenerate(): void {
    this.dataHolderService.maze = undefined;
    // using set timeout to trigger the change detection
    setTimeout(() => {
      this.dataHolderService.maze = this.mazeGeneratorService.generateMaze(this.width, this.height);
    });
  }

}
