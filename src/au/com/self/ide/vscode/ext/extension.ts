'use strict';

import * as vscode from 'vscode';

import {AbstractCommand} from './command';

export abstract class AbstractExtension {
  /* package */ _commands = new Array<AbstractCommand>();

  public constructor(protected _ctx: vscode.ExtensionContext) {
    this._prepareCommands();
  }

  protected abstract _prepareCommands();

  public activate() {
    this._commands.forEach(feature => {
      feature.activate();
    });
  }

  public deactivate() {
    this._commands.forEach(feature => {
      feature.deactivate();
    });
  }

  public getContext(): vscode.ExtensionContext {
    return this._ctx;
  }

  public addSubscription(cmd) {
    this._ctx.subscriptions.push(cmd);
  }
}