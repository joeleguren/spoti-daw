import { Component, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { App } from '../../app';

@Component({
  selector: 'app-add-form',
  imports: [FormsModule],
  templateUrl: './add-form.html',
  styleUrl: './add-form.css',
})
export class AddForm {

  // Dades per enviar al pare
  public sendSong: OutputEmitterRef<any> = output<any>(); // Enviar cançó al MusicList

  public viewMode: OutputEmitterRef<string> = output<string>(); // Enviar viewMode

  private _title: WritableSignal<string> = signal("");
  private _artist: WritableSignal<string> = signal("");
  private _favorite: WritableSignal<boolean> = signal(false);
  private _description: WritableSignal<string> = signal("");
  private _mp3Url: WritableSignal<string> = signal("");
  private _cover: WritableSignal<string> = signal("");

  private _errorMessage: WritableSignal<string> = signal("");

  public get title(): WritableSignal<string> {
    return this._title;
  }

  public set title(value: string) {
    this._title.set(value);
  }

  public get artist(): WritableSignal<string> {
    return this._artist;
  }
  public set artist(value: string) {
    this._artist.set(value);
  }

  public get favorite(): WritableSignal<boolean> {
    return this._favorite;
  }
  public set favorite(value: boolean) {
    this._favorite.set(value);
  }

  public get description(): WritableSignal<string> {
    return this._description;
  }
  public set description(value: string) {
    this._description.set(value);
  }

  public get mp3Url(): WritableSignal<string> {
    return this._mp3Url;
  }
  public set mp3Url(value: string) {
    this._mp3Url.set(value);
  }

  public get cover(): WritableSignal<string> {
    return this._cover;
  }
  public set cover(value: string) {
    this._cover.set(value);
  }

  public get errorMessage(): WritableSignal<string> {
    return this._errorMessage;
  }
  
  public closeForm() {
   // this.isVisible = false;
    this.removeFields();
    this.viewMode.emit(App.SHOW_NONE);
  }

  public removeFields() {
    this._title.set("");
    this._artist.set("");
    this._mp3Url.set("");
    this._cover.set("");
    this._description.set("");
  }

  public addSong() {
    if (this.allSongDataIsNotEmpty()) {
      this._errorMessage.set("");
      // Aquest emit envia la cançó introduida al App
      this.sendSong.emit({
        title: this._title(),
        artist: this._artist(),
        favorite: this._favorite(),
        description: this._description(),
        mp3Url: this._mp3Url(),
        cover: this._cover()
      });
      this.removeFields();
      //this.sendSong.emit(""); // Per a que quedi buit
    } else {
      this._errorMessage.set("Error, les dades no poden estar buides!")
    }

    // Validar camps
    // Fer un emit, enviant camps al App i aquest al musicList
  }

  public allSongDataIsNotEmpty(): boolean {
    return this._title().length > 0 && this._artist().length > 0 &&
      this._mp3Url().length > 0 && this._cover().length > 0 &&
      this._description().length > 0;
  }

}
