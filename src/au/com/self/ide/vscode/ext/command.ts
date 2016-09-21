'use strict';

import * as vscode from 'vscode';

import {AbstractExtension} from './extension';

export abstract class AbstractCommand {
  public constructor(protected _extension: AbstractExtension) {
    _extension._commands.push(this);
  }

  public activate() {
    this._setupExecutionContext();
    this._registerCommand();
    this._registerListeners();
  }

  public deactivate() {
  }
  
  protected _setupExecutionContext() {
  }

  protected _registerCommand() {
  }

  protected _registerListeners() {
  }

  protected _registerCmd(command: string, callback: (...args: any[]) => any) {
    let cmd = vscode.commands.registerCommand(command, callback, this);
    this._extension.addSubscription(cmd);
  }
}