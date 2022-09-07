import { Component, OnInit } from '@angular/core';
import { Frame, Score } from '../scoreboard.model';
import { ScoreboardService } from '../scoreboard.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  frames: Frame[] = [];
  constructor(
    private scoreBoardService: ScoreboardService
  ) {
    this.scoreBoardService.pinHit.subscribe((pin: number) => {
      this.calculateScore(pin)
    });
    this.scoreBoardService.scoreUpdate.subscribe((score: Score) => {
      this.frames = score.frames;
      console.log(this.frames);
    });
    this.frames = this.scoreBoardService.getframes().frames;
  }

  ngOnInit(): void {
  }

  private calculateScore(pin: number): void {
    this.scoreBoardService.calculateScore(pin);
  }

}
