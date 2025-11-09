import { ChangeDetectionStrategy, Component, computed, effect, input, InputSignal, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { SONGS } from '../../model/songs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-music-list',
  imports: [FormsModule],
  templateUrl: './music-list.html',
  styleUrl: './music-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MusicList {
  private static readonly SONGS_ARR_NAME: string = "SAVED_SPOTIDAW_SONGS";

  // Rebre dades del pare (Aquí rebem tota la cançó per més comoditat)
  public getPlayerSongAsFavorite: InputSignal<any> = input<any>("");

  // Emetre dades al pare 
  // (Aquí passem el enviar cançó com a preferida en un altre output, perquè sino podriem interrompre la reproducció del Player)
  public openSong: OutputEmitterRef<any> = output<any>();
  public sendSongAsFavorite: OutputEmitterRef<boolean> = output<boolean>();

  private _filteredSongsArr: Signal<any[]>;
  public _search: WritableSignal<string>;
  private _selectedSong: WritableSignal<any>;

  constructor() {
    this._search = signal("");
    
    this._filteredSongsArr = computed(() => { // Susbcribim llista filtrada al search
      return this.getSongs().filter((song) => {
        return this.matchesSearch(song);
      });
    });

    effect(() => { // És llença aquesta funció quan canvia el input signal
      if (this.getPlayerSongAsFavorite() !== "") {

        // Hem de trobar la cançó al filteredSongsArr i canviar-la
        let referenceSong: any = this.searchAndRetrieveSong(this._filteredSongsArr(), this.getPlayerSongAsFavorite());
        referenceSong.favorite = this.getPlayerSongAsFavorite().favorite;

        // Hem de trobar la cançó al localStorage i canviar-la
        let savedSongs = this.getSongs();
        let referenceSong2 = this.searchAndRetrieveSong(savedSongs, this.getPlayerSongAsFavorite());
        referenceSong2.favorite = this.getPlayerSongAsFavorite().favorite;
        this.saveSongs(savedSongs);
      } 
      
      else { // Si rebem la cançó provinent del Player buida, llavors deseleccionem
        this._selectedSong.set("");
      }
    })
    
    this.saveSongs(this._filteredSongsArr()); // Important guardar cançons per poder treballar en viu al localStorage
  
    this._selectedSong = signal("");
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
  
  private matchesSearch(song: any): boolean {
    return (song.title.includes(this._search()) || song.artist.includes(this._search()) || song.description.includes(this._search()));
  }

  // Aquest mètode s'encarrega de retornar les cançons de localStorage, o sino del song.ts
  private getSongs() {
    console.log("Anem a recuperar cançons...")
    let tempSongs: any[] = this.checkAndRetrieveSavedSongs(); // Recuperar cançons local storage primer
    if (tempSongs.length == 0) { // No hi ha cançons al local storage?
      console.log("Vale, doncs no hi ha cançons al LS, anem a mirar al songs.ts")
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
    // if (SONGS.length > 0) {
    //   console.log("Hi ha contingut al SONGS.ts");
    //   console.log(SONGS[1]);
    // }
    console.log("Retorno cançons del TS!")
    return SONGS; // any[] del model
  }
 
  private areSongsEqual(song1: any, song2: any): boolean {
    return song1.title === song2.title && song1.artist === song2.artist && song1.description === song2.description;
  }

  private saveSongs(songs: any[]) {
    if (songs.length > 0 ) {
      localStorage.setItem(MusicList.SONGS_ARR_NAME, JSON.stringify(songs)); // Guardem llista al localstorage
    }
  }

  // S'encarrega de marcar o desmarcar com a preferit guardant al localStorage també
  public markOrUnmarkSongAsFavorite(song: any) {
    song.favorite = !song.favorite;
    this.sendSongAsFavorite.emit(song.favorite); // Emitim cançó com a preferida o no al App
    
    // En aquesta part ho persistim al localStorage
    let tempSongs: any[] = this.getSongs(); // Obtenim cançons del localStorage
    let savedSong = this.searchAndRetrieveSong(tempSongs, song); // Obtenim la referència de la llista passada si existeix (hauría d'estar, ja que treballem en viu al localStorage)
    if (savedSong !== "") { // Si hem obtingut cançó?
      savedSong.favorite = song.favorite; // Aquí modifiquem favorite referència
      this.saveSongs(tempSongs);
    }
  }

  // Retorna la referència de la cançó si existeix en la llista passada, si no "".
  private searchAndRetrieveSong(songs: any[], song1: any): any {
    let songToRetrieve = "";

    for (const song2 of songs) {
      if (this.areSongsEqual(song1,song2)) {
        songToRetrieve = song2;
      }
    }
    return songToRetrieve;
  }

  // Funció que carregarà estil pertinent si es la cançó seleccionada --> this._selectedSong
  public retrieveClassNameIfSongSelected(song1: any) {
    
    if (this.areSongsEqual(song1, this._selectedSong)) {
      return "selected-song-div";
    }

    return "song-div";
  }

  // Aquest mètode s'encarregarà de gestionar el click en una cançó tant si ja ha estat apretada com no.
  public onClickSong(song: any) {
    if (this.areSongsEqual(song,this._selectedSong())) { // La cançó seleccionada es igual a la anteriorment seleccionada?
      this._selectedSong.set(""); // Llavors borrem la selecció
      console.log("Cançó deseleccionada! " + song.title);
    } else {
      this._selectedSong.set(song); // Seleccionem cançó
      console.log("Cançó seleccionada! " + this._selectedSong().title);
    }

    // Emitim la cançó al App per avisar-lo que s'ha modificat la cançó:
    this.openSong.emit(this._selectedSong);

   // console.log("La cançó seleccionada és --> " + this._selectedSong());
  }

  public onClickAddSongButton(song: any)  {
    
    // Hem de deseleccionar peça seleccionada i obrir el formulari AddForm
    this._selectedSong.set("");

    //this._filteredSongsArr().push(song); // No modifiquem referència, sol contingut
   // this.saveSongs(this._filteredSongsArr());
  }

}

