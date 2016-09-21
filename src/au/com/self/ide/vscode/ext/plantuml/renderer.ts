/*
@startuml
interface PlantUmlCommandLine
PlantUmlCommandLine -down- [plantuml-vscode-8407.jar]

[plantuml-vscode-8407.jar]
[vizjs.jar]
[j2v8_win32_x86_64-4.5.0.jar]
[batik-rasterizer.jar]

package "plant-uml-ext-0.1.0.vsix" as puml <<extension>> {
  PlantUmlCommandLine <... [plantuml-ext]
  folder "bin" {
  }
}

bin +--> [plantuml-vscode-8407.jar]
bin +--> [vizjs.jar]
bin +--> [j2v8_win32_x86_64-4.5.0.jar]
bin +--> [batik-rasterizer.jar]

note bottom of [j2v8_win32_x86_64-4.5.0.jar]: Note, this may be either a Win, Linux or Mac binary 

caption Figure Rendering PlantUML text Component Diagram
@enduml
*/
'use strict';

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as vscode from 'vscode';

export abstract class AbstractRenderer {
  private static _JAR_FILE: string = null;
  private static _JAVA_EXE: string =  null;
  private static _BASE_OPTS: string[] = null;
  private static _DELIM: string[] = ["@startuml", "@enduml"];

  protected abstract _handleInvalidSyntax(attr: IRenderingContext);
  protected abstract _processCommandLineOuput(plantJar: child_process.ChildProcess, attr: IRenderingContext): Thenable<string>;

  public static setupExecutionContext(ctx: vscode.ExtensionContext) {
    if (AbstractRenderer._JAVA_EXE)
      return;

    let rendererCfg = vscode.workspace.getConfiguration('plantuml.renderer');
    let cfgJavaHm = rendererCfg.get<string>('JAVA_HOME', "auto");
    cfgJavaHm = cfgJavaHm === "auto" ? process.env['JAVA_HOME'] : cfgJavaHm;
    let javaBin = path.join(cfgJavaHm, 'bin');
    fs.exists(javaBin, (exists: boolean) => {
      if (exists) {
        AbstractRenderer._JAVA_EXE = path.join(javaBin, 'java');
        AbstractRenderer._JAR_FILE = `${ctx.extensionPath}${path.sep}bin${path.sep}plantuml-vscode-8407.jar`; 
        AbstractRenderer._BASE_OPTS = ['-Dplantuml.include.path="%s"', "-Djava.awt.headless=true", "-jar", AbstractRenderer._JAR_FILE, "-charset", "UTF-8", "-p"];
      } else {
        let msg = `Please setup a valid JAVA_HOME and then restart vscode! Tried=>[${cfgJavaHm}]`;
        vscode.window.showErrorMessage(msg);
        throw new Error(msg);
      }
    });
  }

  public render(attr: IRenderingContext): Thenable<string> {
    let ret: Thenable<string> = null;
    this._prepareSourceArtifact(attr);
    if (this._checkStartEndUmlSyntax(attr.buff)) {
      this._prepareCommandLineInterfaceArguments(attr);
      ret = this._executeCommandLineInterface(attr);
    } else
      this._handleInvalidSyntax(attr);
    return ret;
  }

  protected _prepareSourceArtifact(attr: IRenderingContext) {
    attr.editor = vscode.window.activeTextEditor;
    vscode.window.showTextDocument(attr.editor.document);
    attr.buff = null;
    this._prepareRenderAttributes(attr);
  }

  protected _prepareRenderAttributes(attr: IRenderingContext) {
    if (attr.buff === null)
      attr.buff = attr.editor.document.getText().trim();
  }

  protected _checkStartEndUmlSyntax(buff: string): boolean {
    let ret = false;
    let firstDelim = buff.substr(0, 9).toLowerCase();
    let lastDelim = buff.slice(-7).toLowerCase();
    if (AbstractRenderer._DELIM[0] === firstDelim && AbstractRenderer._DELIM[1] == lastDelim)
      ret = true;
    return ret;
  }

  protected _prepareCommandLineInterfaceArguments(attr: IRenderingContext) {
    attr.sFmt = OutputFmt[attr.format].toLowerCase();
    attr.opts = AbstractRenderer._BASE_OPTS.concat("-t" + attr.sFmt);
    attr.fsPath = attr.editor.document.uri.fsPath;
    let dirName = path.dirname(attr.fsPath);
    if (dirName === ".") {
      dirName = vscode.workspace.rootPath;
      if (dirName === undefined) {
        dirName = process.env['HOME'];
        if (dirName === undefined)
          dirName = process.env['USERPROFILE'];
      }
      attr.fsPath = dirName + path.sep + attr.fsPath;
    }
    attr.opts[0] = util.format(attr.opts[0], dirName);
  }

  protected _executeCommandLineInterface(attr: IRenderingContext): Thenable<string> {
    if (attr.buff.trim().length === 0)
      return null;
    let plantJar = child_process.spawn(AbstractRenderer._JAVA_EXE, attr.opts);
    plantJar.stdin.write(attr.buff);
    plantJar.stdin.end();
    let ret: Thenable<string> = this._processCommandLineOuput(plantJar, attr);
    return ret;
  }
}

export enum OutputFmt {
  PNG,
  SVG,
  EPS,
  PDF,
  VDX,
  XMI,
  SCXML,
  HTML,
  TXT,
  UTXT,
  LATEX,
  LATEX_NOPREAMBLE
}

export interface IRenderingContext {
  format: OutputFmt;
  editor?: vscode.TextEditor;
  buff?: string;
  opts?: string[];
  outputFile?: string;
  fileExt?: string;
  sFmt?: string;
  fsPath?: string;
}