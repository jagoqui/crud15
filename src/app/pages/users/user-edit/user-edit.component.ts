import {Component, inject, OnInit} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/commons/models/player.interface';
import { Router } from '@angular/router';

interface PlayerForm {
  name: FormControl<string>,
  decks: FormArray<FormGroup<DecksForm>>;
}

interface DecksForm {
  name: FormControl<string>,
  cards: FormControl<number>;
}

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit{
  _location = inject(Location);
  _playerService = inject(PlayerService);
  _router = inject(Router);
  player!: Player;

  form: FormGroup<PlayerForm> = new FormGroup<PlayerForm>({
    name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    decks: new FormArray<FormGroup<DecksForm>>([]),
  });

  ngOnInit() {
    console.log(this._location.getState());
    this.player = (this._location.getState() as any).player as Player;
    if (this.player) this.setCurrentPlayer(this.player);
  }

  createDeck() {
    (this.form.get('decks') as FormArray).push(
      new FormGroup({
        name: new FormControl('', Validators.required),
        cards: new FormControl(null, Validators.required),
      })
    );
  }

  setCurrentPlayer(player: Player) {
    this.form.patchValue(player);
    player.decks.map((deck) => {
      const deckForm = new FormGroup({
        name: new FormControl(deck.name),
        cards: new FormControl(deck.cards),
      });
      (this.form.get('decks') as FormArray).push(deckForm);
    });
  }

  get decks(): FormGroup<DecksForm>[]{
    return this.form.controls.decks.controls;
  }

  updatePlayer() {
    console.log({
      id: this.player?.id,
      ...this.form.getRawValue(),
    });

    this._playerService.updatePlayer({
      id: this.player.id,
      ...this.form.getRawValue(),
    } as Player).then();
    this._router.navigate(['users']).then();
  }
}
