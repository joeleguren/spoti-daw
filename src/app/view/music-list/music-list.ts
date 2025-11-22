import { ChangeDetectionStrategy, Component, effect, input, InputSignal, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { SONGS } from '../../model/songs';
import { FormsModule } from '@angular/forms';
import { App } from '../../app';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart} from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-music-list',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './music-list.html',
  styleUrl: './music-list.css',
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class MusicList {
  private static readonly SONGS_ARR_NAME: string = "SAVED_SPOTIDAW_SONGS";
  // Inici FontAwesome icons
  public solidHeart = fasHeart;
  public regularHeart = farHeart;
  public solidPlus = faPlus;
  public solidMagnifyingGlass = faMagnifyingGlass;
  // Fi FontAwesome icons

  // Inici viewmode
  public viewMode: OutputEmitterRef<string> = output<any>();
  public getViewMode: InputSignal<string> = input<string>("");
  // Fi viewmode

  // Rebre dades del pare 
  public getFavoriteFromPlayer: InputSignal<any> = input<any>(null); // Cançó marcada com a preferida provinent de player
  public getSongInAddForm: InputSignal<any> = input<any>(null); // Cançó a afegir
  
  // Emetre dades al pare 
  // (Aquí passem el enviar cançó com a preferida en un altre output, perquè sino podriem interrompre la reproducció del Player)
  public sendSongToPlayer: OutputEmitterRef<any> = output<any>();
  public sendFavoriteToPlayer: OutputEmitterRef<boolean> = output<boolean>(); // Enviar cançó com a preferida per al player (Així veu el canvi)
  

  // Atributs classe
  private _filteredSongsArr: WritableSignal<any[]> = signal<any[]>([]);
  public _search: WritableSignal<string>;
  private _selectedSong: WritableSignal<any>;

  constructor() {
    this._search = signal("");
    
    this._filteredSongsArr.set(this.getSongs());
    this.saveSongs(this._filteredSongsArr()); // Important guardar cançons per poder treballar en viu al localStorage
    
    // Amb efect més fàcil, així li puc fer update al afegir noves cançons.
    // effect(() => {
    //  // console.log("Regenerant filteredSongsArr!!");
    //   this._filteredSongsArr.set(this.getSongs().filter((song) => {
    //     return this.matchesSearch(song);
    //   }));
    // });

    this._selectedSong = signal(null);


    effect(() => { // És llença aquesta funció quan canvia el getPlayerSongAsFavorite
      // console.log(this._selectedSong());
      // console.log("this.getFavoriteFromPlayer()");
      // console.log(this.getFavoriteFromPlayer());
      
      const favoritePlayer: any = this.getFavoriteFromPlayer();

      if (favoritePlayer !== null) {
        const songInMusicList = this.searchAndRetrieveSong(this._filteredSongsArr(), favoritePlayer);

        if (songInMusicList !== null) { 
          // Canviem favorit
          songInMusicList.favorite = !songInMusicList.favorite;
 
          let savedSongs = this.getSongs();
          let song = this.searchAndRetrieveSong(savedSongs, favoritePlayer);

          if (song !== null) {
            song.favorite = !favoritePlayer.favorite;
            this.saveSongs(savedSongs);
            this.sendSongToPlayer.emit(song);
          }
        } 
      }
    });

    effect(() => { // Afegir cançó provinent de l'App - AddForm
     // console.log("Sóc el App y executo l'effect al notar canvi a la canço form");
      this.addSong(this.getSongInAddForm());
    });

    effect(() => { // Controlem que si el mode de vista no és player, deselecciona cançó
      if (this.getViewMode() !== App.SHOW_PLAYER) {
        this._selectedSong.set(null);
      }
    });

  }

  public get filteredSongsArr() : Signal<any[]> {
    return this._filteredSongsArr;
  }
  
  // public get search() : WritableSignal<string> {
  //   return this.search;
  // }
  
  // public set search(search: WritableSignal<string>) {
  //   this._search.set(search());
  // }
  
  public matchesSearch(song: any): boolean {
    return (song.title.includes(this._search()) || song.artist.includes(this._search()) || song.description.includes(this._search()));
  }

  // Aquest mètode s'encarrega de retornar les cançons de localStorage, o sino del song.ts
  private getSongs() {
    //console.log("Anem a recuperar cançons...")
    let tempSongs: any[] = this.checkAndRetrieveSavedSongs(); // Recuperar cançons local storage primer
    if (tempSongs.length == 0) { // No hi ha cançons al local storage?
      // console.log("Vale, doncs no hi ha cançons al LS, anem a mirar al songs.ts")
      tempSongs = this.retrieveModelTemplateSongs(); // Recuperar cançons songs.ts
    }
    return tempSongs;
  }

  private checkAndRetrieveSavedSongs(): any[] {
    let tempSongs: any[] = [];
    let strSongs = localStorage.getItem(MusicList.SONGS_ARR_NAME); // Recuperem cançons localStorage
    if (strSongs != null) { // Si hi han cançons
      tempSongs = JSON.parse(strSongs); // Guarda-les
    }
    return tempSongs;
  }

  private retrieveModelTemplateSongs(): any[] {
    // console.log("Retorno cançons del TS!");
    return SONGS; // any[] del model
  }
 
  private areSongsEqual(song1: any, song2: any): boolean {
    if (song1 === null || song2 === null) {return false}
    return song1.title === song2.title && song1.artist === song2.artist && song1.description === song2.description;
  }

  private saveSongs(songs: any[]) {
   // console.log("Estic guardant les cançons al localstorage!!!");
    if (songs.length > 0 ) {
      localStorage.setItem(MusicList.SONGS_ARR_NAME, JSON.stringify(songs)); // Guardem llista al localstorage
    }
  }

  // S'encarrega de marcar o desmarcar com a preferit guardant al localStorage també
  public markOrUnmarkSongAsFavorite(song: any) {
  
    song.favorite = !song.favorite; // Marca cançó a la llista filtered per referència

    if (this._selectedSong() !== null 
    && this.areSongsEqual(song, this._selectedSong())) { // Hi ha cançó seleccionada i es la mateixa passada per paràmetre
      this.sendFavoriteToPlayer.emit(song.favorite); // Emitim cançó com a preferida o no, al App
    }

    // En aquesta part ho persistim al localStorage:
    let tempSongs: any[] = this.getSongs(); // Obtenim cançons del localStorage
    let savedSong = this.searchAndRetrieveSong(tempSongs, song); // Obtenim la referència de la llista passada si existeix (hauría d'estar, ja que treballem en viu al localStorage)
    if (savedSong !== null) { // Si hem obtingut cançó?
      savedSong.favorite = song.favorite; // Aquí modifiquem favorite referència
      this.saveSongs(tempSongs); // Guardem de nou al localStorage
    }
  }

  // Retorna la referència de la cançó si existeix en la llista passada, si no null.
  private searchAndRetrieveSong(songs: any[], song1: any): any {
    let songToRetrieve: any = null;

    for (const song2 of songs) {
      if (this.areSongsEqual(song1,song2)) {
        songToRetrieve = song2;
      }
    }
    return songToRetrieve;
  }

  // Funció que carregarà estil pertinent si es la cançó seleccionada --> this._selectedSong
  public retrieveStylesIfSongSelected(song: any) {
    if (this.areSongsEqual(song, this._selectedSong())) {
      return "border: 2px solid white;";
    }
    return "";
  }

  public retrievePStyleIfSongSelected(song: any) {
    if (this.areSongsEqual(song, this._selectedSong())) {
      return "aqua";
    }
    return "";
  }

  // Aquest mètode s'encarregarà de gestionar el click en una cançó tant si ja ha estat apretada com no.
  public onClickSong(song: any) {

    if (this._selectedSong() === null) {
     // console.log("No hi ha cançó seleccionada prèviament.")
      this._selectedSong.set(song);
      // console.log("Selecciono cançó --> " + this._selectedSong().title);
      this.viewMode.emit(App.SHOW_PLAYER); // Obrim player
      // this.sendSongToPlayer.emit({...this._selectedSong()});
      this.sendSongToPlayer.emit(this._selectedSong());
    } 
    else if (!this.areSongsEqual(song,this._selectedSong()))  {
    //console.log("La cançó es una nova escollida")
      this._selectedSong.set(song); // Seleccionem cançó
      // Emitim la cançó al App - Player
      this.sendSongToPlayer.emit(this._selectedSong());
      this.viewMode.emit(App.SHOW_PLAYER); // Seleccionem mode player 
     // console.log("Cançó seleccionada! " + this._selectedSong().title);
    }
  }

  public onClickAddSongButton()  {
    // Hem de deseleccionar peça seleccionada i obrir el formulari AddForm
    this._selectedSong.set(null); // Deseleccionar peça
    this.viewMode.emit(App.SHOW_ADDFORM); // Seleccionem mode Add-Form;
  }

  public addSong(song: any)  {

    if (song !== null) {
      this._filteredSongsArr.update((songs: any[]) => [...songs, song]); // Retorna llista deep copy amb el nou element song
      let tempSongs: any[] = this.checkAndRetrieveSavedSongs();
      //console.log("Afegeixo cançó ja de ja al localStorage");
      tempSongs.push(song);
      this.saveSongs(tempSongs);
    }
  }
}