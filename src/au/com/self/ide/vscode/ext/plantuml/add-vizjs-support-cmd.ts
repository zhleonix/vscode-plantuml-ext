'use strict';

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import * as vscode from 'vscode';

import {AbstractCommand} from '../command';

export class AddVizJsSupport extends AbstractCommand {
  public static NAME: string = "plantuml.addVizJsSupport";

  private static _BIN_DIR = "/bin/";
  private static _VIZJS_LIB_URL = "https://raw.githubusercontent.com/ashinw/vscode-plantuml-ext/master/bin/";

  private static _VIZJS_FILES : string[] = ["vizjs.jar"];
  private static _VIZJS_NATIVE = new Map<string, string>();

  private _binHome: string;
  private _fileCount: number = 0;

  protected _setupExecutionContext() {
    this._binHome = `${this._extension.getContext().extensionPath}${AddVizJsSupport._BIN_DIR}`;
    if (AddVizJsSupport._VIZJS_NATIVE.size === 0) {
      // AddVizJsSupport._VIZJS_NATIVE.set("win32.ia32", "j2v8_win32_x86-4.6.0.jar");
      // There is a rendering bug with VizJS & j2v8_win32_x86-4.6.0.jar 
      // when on Windows VSCode-win32-stable distribution on x64 architecture
      AddVizJsSupport._VIZJS_NATIVE.set("win32.ia32", "j2v8_win32_x86_64-4.6.0.jar"); // force x64
      AddVizJsSupport._VIZJS_NATIVE.set("win32.x64", "j2v8_win32_x86_64-4.6.0.jar");
      AddVizJsSupport._VIZJS_NATIVE.set("linux.x64", "j2v8_linux_x86_64-4.6.0.jar");
      AddVizJsSupport._VIZJS_NATIVE.set("darwin.x64", "j2v8_macosx_x86_64-4.6.0.jar");
    }
  }

  protected _registerCommand() {
    this._registerCmd(AddVizJsSupport.NAME, () => {
      this._downloadVizJsLibs();
    });
  }

  private _downloadVizJsLibs() {
    this._fileCount = 0;
    let platArch = `${process.platform}.${process.arch}`;
    let nativeJar = AddVizJsSupport._VIZJS_NATIVE.get(platArch);
    if (!nativeJar) {
      vscode.window.showErrorMessage("Your platform & architecture combination are not supported by VizJS. Please install a native GraphicViz client");
      return;
    }
    let fileList = AddVizJsSupport._VIZJS_FILES.concat(nativeJar);
    fileList.forEach(name => {
      let url = AddVizJsSupport._VIZJS_LIB_URL + name;
      let jarPathName = this._binHome + name;
      this._downloadSourceToDestination(url, jarPathName, (name, state) => {
        this._fileCount++;
        if (this._fileCount === AddVizJsSupport._VIZJS_FILES.length + 1) {
          if (state === 1)
            this.showToastMessage("VizJS support already added, no further action required");
          else
            vscode.window.showInformationMessage("Please restart VSCode such that the VizJS support files can be loaded for use");
        }
      });
    });
  }
}