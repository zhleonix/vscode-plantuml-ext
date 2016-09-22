'use strict';

import * as child_process from 'child_process';
import * as vscode from 'vscode';

import {AbstractCommand} from '../command';
import {Preview} from './preview-cmd'

export class ToggleLivePreview extends AbstractCommand {
  public static NAME: string = "plantuml.toggleLivePreview";

  private _paused = false;
  /* package */ _preview: Preview;

  public toggleOff() {
    this._paused = false;
  }

  public isPaused(): boolean {
    return this._paused;
  }

  protected _registerCommand() {
    this._registerCmd(ToggleLivePreview.NAME, () => {
      this._paused = !this._paused;
      this.showToastMessage(`PlantUML live preview is now turned: ${this._paused? 'OFF': 'ON'}`);
      if (!this._paused)
        this._preview.forceRefresh();
    });
  }
}