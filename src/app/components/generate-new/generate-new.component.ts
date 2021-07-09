import {Component, OnInit} from '@angular/core';
import {MazeGeneratorService} from "../../../services/maze-generator.service";
import {DataHolderService} from "../../../services/data-holder.service";
import {MazeGeneratorFormsService} from "../../../services/maze-generator-forms.service";
import {split} from "lodash";

@Component({
  selector: 'app-generate-new',
  templateUrl: './generate-new.component.html',
  styleUrls: ['./generate-new.component.scss']
})
export class GenerateNewComponent implements OnInit {
  public showSolution = false;
  public width = 20;
  public height = 20;

  constructor(private mazeGeneratorService: MazeGeneratorService,
              private mazeGeneratorFormService: MazeGeneratorFormsService,
              public dataHolderService: DataHolderService
  ) {
  }

  public ngOnInit(): void {
  }

  public startGenerate(): void {
    this.dataHolderService.maze = undefined;
    // using set timeout to trigger the change detection
    setTimeout(() => {
      const form: string[][] = [];
      // form.push(split("###", ''))
      // form.push(split("B##", ''))
      // form.push(split("  #", ''))
      // form.push(split("##F", ''))
      // form.push(split("##F", ''))

      // form.push(split("#######################  ####                                    ",''))
      // form.push(split("##B#################### ######                                   ",''))
      // form.push(split("#######################  ####                                    ",''))
      // form.push(split("#######################   #                                      ",''))
      // form.push(split("######  #######  #################  ########       ###########   ",''))
      // form.push(split("        #######        #######################   ############### ",''))
      // form.push(split("        #######         ####################### #################",''))
      // form.push(split("        #######         #########################################",''))
      // form.push(split("        #######         ######  ######################     ######",''))
      // form.push(split("        #######         ######  ######    ############     ######",''))
      // form.push(split("        #######         ######  ######    ############     ######",''))
      // form.push(split("        #######         ######  ######    ############     ######",''))
      // form.push(split("      ###########      ######## ######    #######################",''))
      // form.push(split("      ###########      ######## ######    #######################",''))
      // form.push(split("      ###########      ######## ######    ###### ###########F### ",''))
      // form.push(split("      ###########      ######## ######    ######   ###########   ",''))

      form.push(split("########  ##############    #F# ", ''))
      form.push(split("###   ### ###       #####   ### ", ''))
      form.push(split("###   ##  ###       ######  ### ", ''))
      form.push(split("B#######  #######   ####### ### ", ''))
      form.push(split("###   #######       ### ####### ", ''))
      form.push(split("###    ######       ###  ###### ", ''))
      form.push(split("###   ### ###       ###   ##### ", ''))
      form.push(split("########  #############    #### ", ''))


      // form.push(split("########         ########    #######    ########## ", ''))
      // form.push(split("###   ###       #########    ########   ###  ###   ", ''))
      // form.push(split("###   ###      ##########    #########  ###  ###   ", ''))
      // form.push(split("#B######      #### #################### ###  ###   ", ''))
      // form.push(split("###   ####   ####  ######    ###### #######  ###   ", ''))
      // form.push(split("###    ###  ####   ######    ######  ######  ###   ", ''))
      // form.push(split("###   ###################    ######   #####  ###   ", ''))
      // form.push(split("##############     ######    ######    ##########F ", ''))

      // console.log('form', form);
      this.dataHolderService.maze = this.mazeGeneratorFormService.generateMaze(form);
      // console.log('this.dataHolderService.maze', this.dataHolderService.maze);
      // this.dataHolderService.maze = this.mazeGeneratorService.generateMaze(this.width, this.height);
    });
  }

}
