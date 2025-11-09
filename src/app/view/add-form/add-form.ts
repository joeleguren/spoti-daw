import { Component, Signal, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-add-form',
  imports: [],
  templateUrl: './add-form.html',
  styleUrl: './add-form.css',
})
export class AddForm {

  // Dades per enviar al pare
    // - Tancar formulari
    // - Enviar dades (també tanca el formulari)

  // Dades a rebre
    // - Quan obrir el formulari

  private _title: WritableSignal<string> = signal("");
  private _artist: WritableSignal<string> = signal("");
  private _favorite: WritableSignal<string> = signal("");
  private _description: WritableSignal<string> = signal("");
  private _mp3Url: WritableSignal<string> = signal("");
  private _cover: WritableSignal<string> = signal("");

  private _isVisible: WritableSignal<boolean> = signal(false);

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

  public get favorite(): WritableSignal<string> {
    return this._favorite;
  }
  public set favorite(value: string) {
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

  public get isVisible(): WritableSignal<boolean> {
    return this.isVisible;
  }

  public set isVisible(isVisible: boolean) {
    this.isVisible.set(isVisible);
  }
  
  public closeForm() {
    this.isVisible = false;
  }

  public removeFields() {
    this._title.set("");
    this._artist.set("");
    this._favorite.set("");
    this._description.set("");
    this._mp3Url.set("");
    this._cover.set("");
  }

  public addSong() {
    // Validar camps
    // Fer un emit, enviant camps al App i aquest al musicList
  }

}
