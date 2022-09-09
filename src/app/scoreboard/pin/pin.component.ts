import { Component, OnInit } from '@angular/core';
import { ScoreboardService } from '../scoreboard.service';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit {

  pins: number[];

  constructor(
    private scoreBoardService: ScoreboardService
  ) {
    this.pins = this.scoreBoardService.getPins();
    this.scoreBoardService.remainingPin.subscribe((pins: number[]) => {
      this.pins = pins;
    });
  }

  ngOnInit(): void {
  }

  /**
   * This method is use to send pin to calculate score 
   * @param pin Number of pin hit by player
   */
  hitPins(pin: number): void {
    this.scoreBoardService.pinHit.next(pin);
  }

}
