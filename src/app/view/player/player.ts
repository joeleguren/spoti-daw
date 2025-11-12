import { Component, computed, input, InputSignal, output, OutputEmitterRef, signal, Signal} from '@angular/core';
import { App } from '../../app';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.css',
})

export class Player {
  public sendSongToMarkAsFavorite: OutputEmitterRef<any> = output<any>(); // Envia la cançó per marcar-la com a preferit
  public viewMode: OutputEmitterRef<string> = output<string>(); // Envia viewMode (només per tancar)

  // Dades rebudes
  public selectedSong: InputSignal<any> = input<any>(""); // Recorda només lectura proporcionat per App

  public onClickCloseButton() { // Si apreto botó tancar cançó
    this.viewMode.emit(App.SHOW_NONE);  // Tanca el component
  }

  public onClickFavoriteButton() { // Si apreto botó marcar o desmarcar favorit
    this.selectedSong().favorite = !this.selectedSong().favorite;

    // Hem de crear nova referència, sino el effect que tenim a MusicList no s'executarà (es pensarà que no hi ha canvis)
    this.sendSongToMarkAsFavorite.emit(signal({
    title: this.selectedSong().title,
    artist: this.selectedSong().artist,
    favorite: this.selectedSong().favorite,
    description: this.selectedSong().description,
    mp3Url: this.selectedSong().mp3Url,
    cover: this.selectedSong().cover
    }));
  }

}
