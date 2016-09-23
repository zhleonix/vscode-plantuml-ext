'use strict';

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import * as vscode from 'vscode';

import {AbstractCommand} from '../command';

export class InstallSupportSoftware extends AbstractCommand {
  public static NAME: string = "plantuml.installSupportSoftware";

  private static _SUPPORT_SW_URL = "https://raw.githubusercontent.com/ashinw/vscode-plantuml-ext/master/bin/";
  private static _BIN_DIR = "/bin/";
  private static _BIN_LIB_DIR = "lib/";

  private static _SUPPORT_FILES: string[] = [
    "plantuml-vscode-8407.jar",
    "batik-rasterizer.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-anim.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-awt-util.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-bridge.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-codec.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-css.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-dom.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-ext.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-gvt.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-parser.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-script.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-svg-dom.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-transcoder.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-util.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "batik-xml.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "js.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "pdf-transcoder.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "xalan-2.6.0.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "xerces_2_5_0.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "xml-apis-ext.jar",
    InstallSupportSoftware._BIN_LIB_DIR + "xml-apis.jar"
  ];
  private static _VIZJS_NATIVE = new Map<string, string>();
  private static _BIN_HOME: string;

  protected _setupExecutionContext() {
    if (InstallSupportSoftware._VIZJS_NATIVE.size === 0) {
      InstallSupportSoftware._BIN_HOME = `${this._extension.getContext().extensionPath}${InstallSupportSoftware._BIN_DIR}`;
  
      // Rendering bug with VizJS & j2v8_win32_x86-4.6.0.jar when using VSCode-win32-stable distribution on x64 arch
      InstallSupportSoftware._VIZJS_NATIVE.set("win32.ia32", "j2v8_win32_x86_64-4.6.0.jar"); /* force x64 */ // AddVizJsSupport._VIZJS_NATIVE.set("win32.ia32", "j2v8_win32_x86-4.6.0.jar");
      InstallSupportSoftware._VIZJS_NATIVE.set("win32.x64", "j2v8_win32_x86_64-4.6.0.jar");
      InstallSupportSoftware._VIZJS_NATIVE.set("linux.x64", "j2v8_linux_x86_64-4.6.0.jar");
      InstallSupportSoftware._VIZJS_NATIVE.set("darwin.x64", "j2v8_macosx_x86_64-4.6.0.jar");
      let platArch = `${process.platform}.${process.arch}`;
      let nativeJar = InstallSupportSoftware._VIZJS_NATIVE.get(platArch);
      if (nativeJar) {
        InstallSupportSoftware._SUPPORT_FILES.push("vizjs.jar");
        InstallSupportSoftware._SUPPORT_FILES.push(nativeJar);
      } else 
        vscode.window.showWarningMessage("Your platform & architecture combination is not supported by VizJS. Please install a native GraphViz client");
    }
  }

  protected _registerCommand() {
    this._registerCmd(InstallSupportSoftware.NAME, () => {
      this._downloadSupportLibraries();
    });
  }

  private _downloadSupportLibraries() {
    let fileCount = 0;
    InstallSupportSoftware._SUPPORT_FILES.forEach(name => {
      let url = InstallSupportSoftware._SUPPORT_SW_URL + name;
      let jarPathName = InstallSupportSoftware._BIN_HOME + name;
      this._downloadSourceToDestination(url, jarPathName, (name, state) => {
        fileCount++;
        if (fileCount === InstallSupportSoftware._SUPPORT_FILES.length) {
          if (state === 1)
            vscode.window.showInformationMessage("All support software for the Amigo PlantUML Modeler is already installed. No further action required!");
          else 
            vscode.window.showInformationMessage("You may now use Amigo PlantUML Modeler's commands. Consider restarting VSCode if there are any problems");
        }
      });
    });
  }
}