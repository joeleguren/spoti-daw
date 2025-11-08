import { Component, signal } from '@angular/core';
import { MusicList } from './view/music-list/music-list';
import { Player } from './view/player/player';
import { AddForm } from './view/add-form/add-form';

@Component({
  selector: 'app-root',
  imports: [MusicList, Player, AddForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('spoti-daw');
}
