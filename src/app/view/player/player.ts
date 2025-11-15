import { Component, input, InputSignal, output, OutputEmitterRef, signal, Signal} from '@angular/core';
import { App } from '../../app';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.css',
})

export class Player {
  public sendSongMarkAsFavorite: OutputEmitterRef<any> = output<any>(); // Envia la cançó per marcar-la com a preferit
  public viewMode: OutputEmitterRef<string> = output<string>(); // Envia viewMode (només per tancar)

  // Dades rebudes
  public selectedSong: InputSignal<any> = input<any>(null); // Recorda només lectura proporcionat per App


  public onClickCloseButton() { // Si apreto botó tancar cançó
    this.viewMode.emit(App.SHOW_NONE);  // Tanca el component
  }

  public onClickFavoriteButton() { // Si apreta botó marcar o desmarcar favorit
    //this.selectedSong().favorite = !this.selectedSong().favorite;
    const updatedSong = { ...this.selectedSong(), favorite: !this.selectedSong().favorite };
  
    // Enviem la cançó actualitzada al pare
    this.sendSongMarkAsFavorite.emit(updatedSong);
  }

}
