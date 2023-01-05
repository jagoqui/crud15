import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Player} from 'src/app/commons/models/player.interface';
import {debounceTime, Observable} from 'rxjs';
import {PlayerService} from 'src/app/services/player.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  players$!: Observable<Player[]>;
  _playerService = inject(PlayerService);
  _router = inject(Router);
  searcher = new FormControl<string>('');

  ngOnInit(): void {
    this.players$ = this._playerService.getPlayers();
    this.searcher.valueChanges.pipe(debounceTime(1000)).subscribe((search) => {
      if (search) {
        console.log(search);
        this.players$ = this._playerService.getPlayers(search);
      } else {
        this.players$ = this._playerService.getPlayers();
      }
    });
  }

  editPlayer(player: Player) {
    this._router.navigateByUrl('users/edit', {state: {player}}).then();
  }

  deletePlayer(player: Player) {
    if (confirm(`Seguro de borrar a ${player.name}`)) {
      this._playerService.deletePlayer(player.id).then();
    }
  }
}
