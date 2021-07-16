import { Injectable } from '@angular/core';
import { Maze } from '../types/maze';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataHolderService {
  maze: Maze;
  showSolution = false;
  form: Subject<string[][]> = new Subject<string[][]>();
  formScale: BehaviorSubject<number> = new BehaviorSubject<number>(2);

  constructor() {}
}
