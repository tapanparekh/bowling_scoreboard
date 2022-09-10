import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, BehaviorSubject } from 'rxjs';
import { Frame, Score } from './scoreboard.model';

@Injectable()
export class ScoreboardService {

  score: Score = { frames: [], totalScore: 0 };
  pinHit = new Subject<number>();
  scoreUpdate = new BehaviorSubject<Score>(this.getframes());
  remainingPin = new Subject<number[]>;
  pins: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private toastr: ToastrService
  ) {
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
        rolls: [],
        isActive: i === 1 ? true : false,
        score: 0
      }
      this.score.frames.push(frame);
    }
    return this.score;
  }

  /**
   * This method will set the pin detail in frame
   * @param pins Number of pin hit by player
   */
  addroll(pins: number): void {
    let activeFrame = this.score.frames.filter(f => f.isActive)[0];
    if (activeFrame.id == 10) {
      if (activeFrame.rolls.length === 2) {
        if (activeFrame.rolls[0] === 'X' || activeFrame.rolls[1] === '/') {
          if (pins === 10) {
            activeFrame.rolls.push('X');
            this.notification('Strike!');
          }
          else {
            activeFrame.rolls.push(pins);
          }
        }
      }
      if (activeFrame.rolls.length === 1) {
        if (pins === 10) {
          activeFrame.rolls.push('X');
          this.notification('Strike!');
        }
        else {
          if (activeFrame.rolls[0] + pins === 10) {
            activeFrame.rolls.push('/');
            this.notification('Spare!');
          }
          else {
            activeFrame.rolls.push(pins);
          }
        }
        this.restorePin();
      }
      if (activeFrame.rolls.length === 0) {
        if (pins === 10) {
          activeFrame.rolls.push('X');
          this.notification('Strike!');
        }
        else {
          activeFrame.rolls.push(pins);
          this.updatePins(pins);
        }
      }
    } else {
      let nextId = activeFrame.id + 1;
      let nextFrame = this.score.frames.filter(f => f.id === nextId)[0];
      if (activeFrame.rolls.length === 1) {
        if (activeFrame.rolls[0] + pins === 10) {
          activeFrame.rolls.push('/');
          this.notification('Spare!');
        }
        else {
          activeFrame.rolls.push(pins);
        }
        activeFrame.isActive = false;
        nextFrame.isActive = true;
        this.restorePin();
      }
      if (activeFrame.rolls.length === 0) {
        if (pins === 10) {
          activeFrame.rolls.push('X');
          this.notification('Strike!');
          activeFrame.isActive = false;
          nextFrame.isActive = true;
        }
        else {
          activeFrame.rolls.push(pins);
          this.updatePins(pins);
        }
      }
    }
    let score = this.scoreCalculate(this.score.frames);
    this.score.totalScore = score;
    this.scoreUpdate.next(this.score);
  }

  /**
   * Reset game
   */
  resetGame(): void {
    this.restorePin();
    this.score.frames = [];
    this.score.totalScore = 0;
    this.score = this.getframes();
    this.scoreUpdate.next(this.score);
  }

  /**
   * This method will calculate score 
   * @param frames All frame detail
   * @returns Total score
   */
  private scoreCalculate(frames: Frame[]) {
    let score = 0;
    let frameLength: number = frames.length;
    for (let i = 0; i < frameLength; i++) {
      let currentFrame = frames[i];
      if (currentFrame.rolls.length) {
        if (currentFrame.rolls[0] === 'X' && i < 9) {
          score += 10 + this.getNextFramesScore(frames, i, 2);
        } else if (currentFrame.rolls.length === 2 && currentFrame.rolls[1] === '/' && i < 9) {
          score += 10 + this.getNextFramesScore(frames, i, 1);
        } else if (currentFrame.rolls.length === 3) {
          score += this.getLastFrameScore(currentFrame);
        } else {
          score += this.getRollScore(currentFrame, 0) + this.getRollScore(currentFrame, 1);
        }
        this.setFrameScore(currentFrame.id, score);
      }
    }
    return score;
  }

  /**
   * This method is used to set updated score of frame
   * @param frameId Id of frame
   * @param score Score
   */
  setFrameScore(frameId: number, score: number): void {
    let frame = this.score.frames.filter(f => f.id === frameId)[0];
    frame.score = score;
  }

  /**
   * This method will calculate score of next 2 frame in case of Strikes
   * This method will calculate score of next 1 frame in case of Strikes
   * @param frames All frames 
   * @param index Current frame index
   * @param count Number of frame
   * @returns 
   */
  private getNextFramesScore(frames: Frame[], index: number, count: number) {
    let firstroll = this.getRollScore(frames[index + 1], 0);
    let secondroll = this.getRollScore(frames[index + 1], 1);
    if (frames[index + 1].rolls.length === 1) {
      return count === 1 ? firstroll : firstroll + this.getRollScore(frames[index + 2], 0);
    }
    return count === 1 ? firstroll : (secondroll === 10 && firstroll !== 10 ? secondroll : secondroll + firstroll);
  }

  /**
   * This method will return score of the roll
   * @param frame Selected frame
   * @param index Index of frame
   * @returns Score of roll
   */
  private getRollScore(frame: Frame, index: number): number {
    if (frame && frame.rolls[index]) {
      if (frame.rolls[index] === 'X' || frame.rolls[index] === '/') {
        return 10;
      }
      return parseInt(frame.rolls[index]);
    }
    return 0;
  }

  /**
   * This method will calculate score of 10'th frame 
   * @param frame Selected frame
   * @returns Score of 10'th frame
   */
  private getLastFrameScore(frame: Frame): number {
    let third = this.getRollScore(frame, 2);
    let second = this.getRollScore(frame, 1);
    let first = this.getRollScore(frame, 0);
    return third === 10 && second !== 10 ? third + first : (second === 10 && first !== 10 ? third + second : first + second + third);
  }

  /**
   * This method will update and send back remainig pins
   * @param pin Number of pins falldown in 1'st attempt
   */
  private updatePins(pin: number): void {
    if (pin > 0) {
      this.remainingPin.next(this.pins.filter(p => p < this.pins.length - pin));
    }
  }

  /**
   * This method will restore pin once the frame is completed
   */
  private restorePin(): void {
    this.remainingPin.next(this.pins);
  }

  /**
   * This method will display notification
   * @param message Message string
   */
  notification(message: string) {
    this.toastr.success(message, '', {
      timeOut: 2000,
      positionClass: 'toast-bottom-center'
    })
  }
}
