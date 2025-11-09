import { Component, computed, input, InputSignal, output, OutputEmitterRef, signal, Signal} from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  // Enviar dades al pare
  public sendSong: OutputEmitterRef<any> = output<any>();

  // Dades rebudes
  public selectedSong: InputSignal<any> = input<any>(""); // Recorda només lectura proporcionat per App

  // Atributs classe
  private _isVisible: Signal<boolean>;

  constructor() {
    this._isVisible = computed(() => {
      return this.selectedSong() !== "";
    });
  }

  public get isVisible(): Signal<boolean> {
    return this._isVisible;
  }
  
  public onClickCloseButton() { // Si apreto botó tancar cançó
    this.sendSong.emit(signal(""));  // Envia la cançó
  }

  public onClickFavoriteButton() { // Si apreto botó marcar o desmarcar favorit
    this.selectedSong().favorite = !this.selectedSong().favorite;

    // Hem de crear nova referència, sino el effect que tenim a MusicList no s'executarà (es pensarà que no hi ha canvis)
    this.sendSong.emit(signal({
    title: this.selectedSong().title,
    artist: this.selectedSong().artist,
    favorite: this.selectedSong().favorite,
    description: this.selectedSong().description,
    mp3Url: this.selectedSong().mp3Url,
    cover: this.selectedSong().cover
    }));
  }

}
