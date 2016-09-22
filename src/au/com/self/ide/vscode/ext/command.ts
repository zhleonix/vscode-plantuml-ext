'use strict';

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

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
  
  public showToastMessage(msg: string) {
    vscode.window.setStatusBarMessage(msg);
    setTimeout(() => {
      vscode.window.setStatusBarMessage("");
    }, 3500);
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

  protected _downloadSourceToDestination(srcUrl: string, dstPathName: string, callback: (name: string, state: number) => void) {
    fs.exists(dstPathName, (exists) => {
      if (exists)
        callback(dstPathName, 1);
      else {
        let jarFos = fs.createWriteStream(dstPathName, { flags: 'a' })
        https.get(srcUrl, (res: http.IncomingMessage) => {
          this.showToastMessage(`Downloading ${path.basename(dstPathName)} to ${path.dirname(dstPathName)}`);
          res.pipe(jarFos);
          jarFos.on('finish', () => {
            jarFos.end();
            jarFos.close();
            callback(dstPathName, 2)
          });
          jarFos.on('error', (err) => {
            fs.unlink(dstPathName);
          });
        });
      }
    });
  }
}