import { Component, signal, WritableSignal } from '@angular/core';
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
  private _selectedSongInPlayer: WritableSignal<any> = signal("");
  private _favoriteSongInPlayer: WritableSignal<boolean> = signal(false);

  private _favoriteSongInMusicList: WritableSignal<boolean> = signal(false);

  private _openFormInAddForm: WritableSignal<boolean> = signal(false);

  private _songInAddForm: WritableSignal<any> = signal<any>("");

  public set favoriteSongInMusicList(favorite: WritableSignal<boolean>) {
    this._favoriteSongInMusicList.set(favorite());
  }

  public get favoriteSongInMusicList(): WritableSignal<boolean> {
    return this._favoriteSongInMusicList;
  }
  
  public get selectedSongInPlayer(): WritableSignal<any> {
    return this._selectedSongInPlayer;
  }


  public onSelectSongForPlayer(selectedSongInPlayer : WritableSignal<string>) {
   // if (selectedSongInPlayer() !== "") {
      this._selectedSongInPlayer.set(selectedSongInPlayer());
  //  }
    console.log("Hola sóc el papa i tinc la cançó seleccionada ---> " + this._selectedSongInPlayer().title);
  }

  public get openFormInAddForm(): WritableSignal<boolean> {
    return this._openFormInAddForm;
  }

  public onOpenAddForm(open: boolean) {
    this._openFormInAddForm.set(open);
  }

  public markSongAsFavorite(favoriteSongInPlayer: boolean) {
    if (this._selectedSongInPlayer() !== "") { // Hi ha cançó seleccionada? 
      this._selectedSongInPlayer().favorite = this._favoriteSongInPlayer();
    }
  }

  public setAddFormSong(song: any) {
    console.log("He entrat al getter per enviar/tancar formulari");
    this._songInAddForm.set(song);
  }

  public get songInAddForm(): WritableSignal<any> {
    return this._songInAddForm;
  }

}
