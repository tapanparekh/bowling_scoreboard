import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreboardRoutingModule } from './scoreboard-routing.module';
import { PinComponent } from './pin/pin.component';
import { GameComponent } from './game/game.component';
import { BoardComponent } from './board/board.component';
import { ScoreboardService } from './scoreboard.service';

@NgModule({
  declarations: [
    PinComponent,
    GameComponent,
    BoardComponent
  ],
  imports: [
    CommonModule,
    ScoreboardRoutingModule
  ],
  providers: [
    ScoreboardService
  ]
})
export class ScoreboardModule { }
