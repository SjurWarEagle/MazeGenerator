import { Injectable } from '@angular/core';
import {Maze} from "../types/maze";

@Injectable({
  providedIn: 'root'
})
export class DataHolderService {
  maze: Maze;

  constructor() { }
}
