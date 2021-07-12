import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {split} from "lodash";
import {DataHolderService} from "../../../services/data-holder.service";

@Component({
  selector: 'app-generate-new-form',
  templateUrl: './generate-new-form.component.html',
  styleUrls: ['./generate-new-form.component.scss']
})
export class GenerateNewFormComponent implements OnInit {
  @ViewChild("formStringTA")
  public formStringTA: ElementRef;

  public scaleFactor = 2;
  public formString = '';

  public examples = [
    {
      name: 'Leer',
      text:
        "",
    },
    {
      name: 'Klein',
      text:
        "B##\n" +
        "###\n" +
        "##F\n"
    },
    {
      name: 'Ben',
      text:
        "########  ##############    #F#\n" +
        "###   ### ###       #####   ###\n" +
        "###   ##  ###       ######  ###\n" +
        "B#######  #######   ####### ###\n" +
        "###   #######       ### #######\n" +
        "###    ######       ###  ######\n" +
        "###   ### ###       ###   #####\n" +
        "########  #############    ####\n",
    },
    {
      name: 'Herz',
      text:
        "  #B#     #F#\n" +
        " #####   #####\n" +
        "####### #######\n" +
        "###############\n" +
        " #############\n" +
        " #############\n" +
        " #############\n" +
        "  ###########\n" +
        "  ###########\n" +
        "  ###########\n" +
        "    #######\n" +
        "    #######\n" +
        "    #######\n" +
        "      ###\n"+
        "      ###\n"+
        "       #\n"
    }
  ];

  constructor(public dataHolderService: DataHolderService) {
  }

  public ngOnInit(): void {
  }

  public startGenerateWithForm(): void {
    // using set timeout to trigger the change detection
    const form: string[][] = [];
    this.formString.split('\n').forEach(line => {
      form.push(split(line, ''));
    })

    if(this.dataHolderService.formScale.value!==this.scaleFactor){
      this.dataHolderService.formScale.next(undefined);
      this.dataHolderService.formScale.next(this.scaleFactor);
    }

    this.dataHolderService.form.next(undefined);
    this.dataHolderService.form.next(form);

    // console.log('this.dataHolderService.maze', this.dataHolderService.maze);
    // this.dataHolderService.maze = this.mazeGeneratorService.generateMaze(this.width, this.height);
  }


  public fillExample(event): void {
    if (!event || !event.value) {
      return;
    }
    this.formString = event.value.trimRight();
    this.formStringTA.nativeElement.rows = event.value.split('\n').length + 1;
  }


}
