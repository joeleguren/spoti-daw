import { Component, signal, WritableSignal } from '@angular/core';
import { MusicList } from './view/music-list/music-list';
import { Player } from './view/player/player';
import { AddForm } from './view/add-form/add-form';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  imports: [MusicList, Player, AddForm, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  // Inici FontAwesome icons
  public solidHeart = fasHeart;
  // Fi FontAwesome icons

  // Constants
  public static readonly SHOW_PLAYER: string = "PLAYER";
  public static readonly SHOW_ADDFORM: string = "ADD-FORM";
  public static readonly SHOW_NONE: string = "NONE";
  // Fi Constants

  // Mode de vista
  private _viewMode: WritableSignal<string> = signal<string>(App.SHOW_NONE);
  // Fi mode de vista

  private _selectedSongInPlayer: WritableSignal<any> = signal(null); // Cançó que envia musicList i rep player
  private _favoriteSongInPlayer: WritableSignal<any> = signal(null); // Cançó que envia player i rep musicList

  private _favoriteSongInMusicList: WritableSignal<boolean> = signal(false);

  private _openFormInAddForm: WritableSignal<boolean> = signal(false);

  private _songInAddForm: WritableSignal<any> = signal<any>(null);

  public get viewMode(): WritableSignal<string> {
    return this._viewMode;
  }

  public set favoriteSongInMusicList(favorite: WritableSignal<boolean>) {
    this._favoriteSongInMusicList.set(favorite());
  }

  public get favoriteSongInMusicList(): WritableSignal<boolean> {
    return this._favoriteSongInMusicList;
  }

  public onFavoriteSongInPlayer(updatedSong: any) {
    this._favoriteSongInPlayer.set(updatedSong);
  }

  public get favoriteSongInPlayer(): WritableSignal<any> {
        console.log(this._favoriteSongInPlayer());

    
    return this._favoriteSongInPlayer;
  }
  
  public get selectedSongInPlayer(): WritableSignal<any> {
    return this._selectedSongInPlayer;
  }

  public onSelectSongForPlayer(selectedSong : any) {
    if (selectedSong !== null) {
      this._favoriteSongInPlayer.set(null);
      this._selectedSongInPlayer.set(selectedSong);
    }
   // console.log("Hola sóc el papa i tinc la cançó seleccionada ---> " + this._selectedSongInPlayer().title);
  }

  public get openFormInAddForm(): WritableSignal<boolean> {
    return this._openFormInAddForm;
  }

  public onOpenAddForm(open: boolean) {
    this._openFormInAddForm.set(open);
  }

  public markSongAsFavorite(favoriteSongInPlayer: boolean) {
    if (this._selectedSongInPlayer() !== null) { // Hi ha cançó seleccionada? 
      this._selectedSongInPlayer.set({...this._selectedSongInPlayer(), favorite: favoriteSongInPlayer});
    }
  }

  public setAddFormSong(song: any) {
    //console.log("Soc el pare i estic enviant cançó al MusicList");
    this._songInAddForm.set(song);
  }

  public get songInAddForm(): WritableSignal<any> {
    return this._songInAddForm;
  }

  public selectViewMode(viewMode: string) {
    this._viewMode.set(viewMode);
  }

}
