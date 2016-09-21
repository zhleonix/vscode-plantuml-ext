'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {AbstractCommand} from '../command';

export class Template extends AbstractCommand {
  public static NAME: string = "plantuml.importTemplate";
  private static _TEMPL_DIR_NAME: string = "templates";
  private static _TEMPL_PUML_EXT: string = ".pu";

  private _templates = new Map<string, string>();
  private _templateHome: string;

  protected _setupExecutionContext() {
    this._templateHome = `${this._extension.getContext().extensionPath}${path.sep}${Template._TEMPL_DIR_NAME}${path.sep}`;
    this._loadTemplateRegistry();
  }

  protected _registerCommand() {
    this._registerCmd(Template.NAME, () => {
      this._selectTemplate();
    });
  }

  private _loadTemplateRegistry() {
    fs.readdir(this._templateHome, (err, files) => {
      files.forEach(fileName => {
        if (fileName.endsWith(Template._TEMPL_PUML_EXT)) {
          let name: string = fileName.substr(0, fileName.length - 3);
          this._templates.set(name, fileName);
        }
      });
    });
  }

  private _selectTemplate() {
    let opts: vscode.QuickPickOptions = { matchOnDescription: true, placeHolder: "Which template do you want to import?" };
    let items: vscode.QuickPickItem[] = [];
    this._templates.forEach((val, name) => {
      items.push({ label: name, description: `Import the ${name} template` });
    });
    vscode.window.showQuickPick(items).then((selection) => {
      if (!selection)
        return;
      this._readTemplateFile(selection.label);
    });
  }

  private _readTemplateFile(name) {
    let fileName: string = this._templates.get(name);
    let uri: string = this._templateHome + fileName;

    fs.readFile(uri, (err, data) => {
      if (err) {
        vscode.window.showErrorMessage(`Import failed with message:${err.message}`);
        return;
      }
      this._insertTemplateIntoEditor(data.toString());
    });
  }

  private _insertTemplateIntoEditor(tmplTxt: string) {
    let editor: vscode.TextEditor = vscode.window.activeTextEditor;
    let pos = editor.selection.active;
    editor.edit(builder => {
      builder.insert(pos, tmplTxt);
    });
  }
}