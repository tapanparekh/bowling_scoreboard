import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Frame, Roll, Score } from './scoreboard.model';

@Injectable()
export class ScoreboardService {

  score: Score = { frames: [], totleScore: 0 };
  pinHit = new Subject<number>();
  scoreUpdate = new Subject<Score>();
  private pins: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  constructor() {

  }

  /**
   * This method is use to get pins
   * @returns Array of pins
   */
  getPins(): number[] {
    return this.pins;
  }

  /**
   * This method is use to get frames
   * @returns Array of frame
   */
  getframes(): Score {
    let frame: Frame;
    for (let i = 1; i <= 10; i++) {
      frame = {
        id: i,
        firstRoll: { isattempted: false, score: 0 },
        secondRoll: { isattempted: false, score: 0 },
        isActive: i === 1 ? true : false,
        score: 0
      }
      this.score.frames.push(frame);
    }
    return this.score;
  }

  calculateScore(pin: number): void {
    for (let i = 0; i < 10; i++) {
      if (this.score.frames[i].isActive) {
        if (this.score.frames[i].firstRoll.isattempted) {
          this.score.frames[i].secondRoll.score = pin;
          this.score.frames[i].secondRoll.isattempted = true;
          this.score.frames[i].isActive = false;
          this.score.frames[i + 1].isActive = true;
        }
        else {
          if (pin === 10) {
            this.score.frames[i].firstRoll.score = pin;
            this.score.frames[i].firstRoll.isattempted = true;
            this.score.frames[i].isActive = false;
            this.score.frames[i + 1].isActive = true;
          }
          else {
            this.score.frames[i].firstRoll.score = pin;
            this.score.frames[i].firstRoll.isattempted = true;
          }
        }

        i = 10;
      }
    }
    this.calculateFrameScore();
    this.calculateTotleScore();
    this.scoreUpdate.next(this.score);
  }

  calculateFrameScore(): void {
    this.score.frames.forEach((element: Frame) => {
      if (element.firstRoll.isattempted && element.firstRoll.score !== 10) {
        if (element.secondRoll.isattempted && (element.firstRoll.score + element.secondRoll.score !== 10)) {
          element.score = element.firstRoll.score + element.secondRoll.score;
        }
      }
    });
  }

  calculateTotleScore(): void {

  }
}
