'use strict';

import * as child_process from 'child_process';
import * as vscode from 'vscode';

import {AbstractCommand} from '../command';
import {AbstractRenderer, IRenderingContext, OutputFmt} from './renderer';

import {ToggleLivePreview} from './toggle-preview-cmd';

export class Preview extends AbstractCommand {
  public static NAME: string = "plantuml.preview";
  private static _PREVIEW_URI = vscode.Uri.parse('plantuml-preview://authority/plantuml-preview');
  private static _EDIT_LIVEPREVIEW_DELAY: number;

  /* package */ _renderer: PreviewRenderer;
  /* package */ _provider: PreviewProvider;
  /* package */ _previewToggler: ToggleLivePreview;

  private _refreshTimeOutId: number = undefined;

  public forceRefresh() {
    this._provider.update(Preview._PREVIEW_URI);
  }

  protected _setupExecutionContext() {
    Preview._EDIT_LIVEPREVIEW_DELAY = vscode.workspace.getConfiguration("plantuml.editing").get<number>("livepreview.delay", 500);
    this._renderer = new PreviewRenderer(this);
    this._provider = new PreviewProvider(this);
    let registration = vscode.workspace.registerTextDocumentContentProvider('plantuml-preview', this._provider);
    this._extension.addSubscription(registration);
    this._extension.addSubscription(this._provider);
  }

  protected _registerCommand() {
    this._registerCmd(Preview.NAME, () => {
      let ret = vscode.commands.executeCommand('vscode.previewHtml', Preview._PREVIEW_URI, vscode.ViewColumn.Two, 'PlantUML Preview');
      ret.then((ok) => {
        this._provider.update(Preview._PREVIEW_URI);
      }, (err) => {
        vscode.window.showErrorMessage(err);
      });
    });
  }

  protected _registerListeners() {
    let lst1 = vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
      if ((e.document === vscode.window.activeTextEditor.document) && (!this._previewToggler.isPaused())) {
        if (this._refreshTimeOutId)
          clearTimeout(this._refreshTimeOutId);
        this._refreshTimeOutId = setTimeout(() => {
          this._provider.update(Preview._PREVIEW_URI);
        }, Preview._EDIT_LIVEPREVIEW_DELAY);
      }
    });

    let lst2 = vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
      this._previewToggler.toggleOff();
      this._provider.update(Preview._PREVIEW_URI);
    });

    this._extension.addSubscription(lst1);
    this._extension.addSubscription(lst2);
  }
}

class PreviewRenderer extends AbstractRenderer {
  public constructor(private _previewer: Preview) {
    super();
  }

  protected _handleInvalidSyntax(attr: IRenderingContext) {
    if (attr.editor.selections.length > 20 && attr.editor.document.languageId != "plantuml")
      vscode.window.showInformationMessage(`The selected content is not a valid PlantUML artifact. Try reselecting and then re-launch the preview`);
  }

  protected _prepareRenderAttributes(attr: IRenderingContext) {
    if (attr.editor.selections.length > 0) { // support artifact block selection in preview mode only
      let r = new vscode.Range(attr.editor.selections[0].start, attr.editor.selections[0].end);
      let sSel = attr.editor.document.getText(r).trim();
      if (this._checkStartEndUmlSyntax(sSel)) {
        attr.buff = sSel;
      }
    }
    super._prepareRenderAttributes(attr);
  }

  protected _processCommandLineOuput(plantJar: child_process.ChildProcess, attr: IRenderingContext): Thenable<string> {
    let ret = new Promise<string>((res) => {
      let svgTxt: string = "";
      plantJar.stdout.on('data', (data) => {
        svgTxt += data.toString();
      });
      plantJar.stdout.on('close', (close) => {
        let html = `<html><body style="background-color:white;">${svgTxt}</body></html>`;
        res(html);
      });
    });
    return ret;
  }
}

class PreviewProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

  public constructor(private _previewer: Preview) {
  }

  public dispose() {
    this._onDidChange.dispose();
  }

  public get onDidChange() {
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this._onDidChange.fire(uri);
  }

  public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string | Thenable<string> {
    return this._previewer._renderer.render({ format: OutputFmt.SVG });;
  }
}
