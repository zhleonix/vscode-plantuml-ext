'use strict';

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as vscode from 'vscode';

import {AbstractCommand} from '../command';
import {AbstractRenderer, IRenderingContext, OutputFmt} from './renderer';

export class Export extends AbstractCommand {
  public static NAME: string = "plantuml.export";

  private _renderer: ExportRenderer;

  protected _setupExecutionContext() {
    this._renderer = new ExportRenderer();
  }

  protected _registerCommand() {
    this._registerCmd(Export.NAME, () => {
      this._exportPlantUmlText();
    });
  }

  private _exportPlantUmlText() {
    let opts: vscode.QuickPickOptions = { matchOnDescription: true, placeHolder: "What image format to you want to export it to?" };
    let items: vscode.QuickPickItem[] = [];
    for (let i = 0; i <= OutputFmt.LATEX_NOPREAMBLE; i++)
      items.push({ label: OutputFmt[i], description: `Export to ${OutputFmt[i]} format` });

    vscode.window.showQuickPick(items).then((selection) => {
      if (!selection)
        return;
      this._renderer.render({ format: OutputFmt[selection.label] });
    });
  }

}

class ExportRenderer extends AbstractRenderer {
  protected _handleInvalidSyntax(attr: IRenderingContext) {
    vscode.window.showErrorMessage(`Invalid content for Plant UML export`);
  }

  protected _prepareCommandLineInterfaceArguments(attr: IRenderingContext) {
    super._prepareCommandLineInterfaceArguments(attr);
    attr.fileExt = attr.sFmt;
    attr.outputFile = attr.fsPath + '.' + attr.fileExt;
    if (attr.format === OutputFmt.LATEX_NOPREAMBLE)
      attr.fileExt = attr.fileExt.replace('_', ':');
    vscode.window.showInformationMessage(`Refer to ${attr.outputFile} for exported ${attr.sFmt.toUpperCase()} document`);
  }

  protected _processCommandLineOuput(plantJar: child_process.ChildProcess, attr: IRenderingContext): Thenable<string> {
    let fos: fs.WriteStream = fs.createWriteStream(attr.outputFile, { flags: 'a' });
    plantJar.stdout.on('data', (data) => {
      fos.write(data);
    });
    plantJar.stdout.on('close', (close) => {
      fos.end();
      fos.close();
      vscode.window.showInformationMessage("PlantUML Export completed!");
    });
    return null;
  }
}
