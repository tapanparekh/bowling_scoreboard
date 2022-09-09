import { Component, OnInit } from '@angular/core';
import { Frame, Score } from '../scoreboard.model';
import { ScoreboardService } from '../scoreboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  frames: Frame[] = [];
  totalScore: number = 0;

  constructor(
    private scoreBoardService: ScoreboardService,
  ) {
    this.scoreBoardService.pinHit.subscribe((pin: number) => {
      this.pinHit(pin);
    });
    this.scoreBoardService.scoreUpdate.subscribe((score: Score) => {
      this.totalScore = score.totalScore;
      this.frames = score.frames;
    });
  }

  ngOnInit(): void {
  }

  resetGame() {
    this.scoreBoardService.resetGame();
  }

  /**
   * This method will add details of roll
   * @param pin Number of pin hit by player
   */
  private pinHit(pin: number): void {
    this.scoreBoardService.addroll(pin);
  }

}
