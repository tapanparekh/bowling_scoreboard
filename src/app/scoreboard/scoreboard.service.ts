import { Injectable } from '@angular/core';

@Injectable()
export class ScoreboardService {

  private pins: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() { }

  /**
   * This method is use to get pins
   * @returns Array of pins
   */
  getPins(): number[] {
    return this.pins;
  }

}
