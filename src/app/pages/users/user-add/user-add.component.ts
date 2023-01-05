import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {Player} from "../../../commons/models/player.interface";

interface PlayerForm {
  name: FormControl<string>,
  decks: FormArray<FormGroup<DecksForm>>;
}

interface DecksForm {
  name: FormControl<string>,
  cards: FormControl<number>;
}

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  _location = inject(Location);
  _playerService = inject(PlayerService);
  _router = inject(Router);
  player!: Player;

  form: FormGroup<PlayerForm> = new FormGroup<PlayerForm>({
    name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    decks: new FormArray<FormGroup<DecksForm>>([]),
  });

  get decks(): FormGroup<DecksForm>[]{
    return this.form.controls.decks.controls;
  }

  ngOnInit() {
    console.log(this._location.getState());
    this.player = (this._location.getState() as any).player as Player;
    if (this.player) this.setCurrentPlayer(this.player);
  }

  createDeck() {
    this.form.controls.decks.push(
      new FormGroup<DecksForm>({
        name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
        cards: new FormControl<number>(0, {nonNullable: true, validators: Validators.required}),
      })
    );
  }

  setCurrentPlayer(player: Player) {
    this.form.patchValue(player);
    player.decks.map((deck) => {
      const deckForm = new FormGroup<DecksForm>({
        name: new FormControl<string>(deck.name, {nonNullable: true}),
        cards: new FormControl<number>(deck.cards, {nonNullable: true}),
      });
      this.form.controls.decks.push(deckForm);
    });
  }

  addPlayer() {
    this._playerService.addPlayer({
      id: new Date().getTime().toString(),
      ...this.form.getRawValue(),
    } as Player).then();
    this._router.navigate(['users']).then();
  }
}
