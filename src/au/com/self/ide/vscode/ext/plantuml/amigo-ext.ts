/*
@startuml
hide fields
hide empty methods

abstract class AbstractCommand {
    +void activate()
    +void deactivate()

    #void _setupExecutionContext()
    #void _registerCommand()
    #void _registerListeners()
}

abstract class AbstractExtension {
    +void activate()
    +void deactivate()

    {abstract} #_prepareCommands()
}

AbstractExtension *-> "1..*" AbstractCommand

AbstractExtension <|-- AmigoModeler

AbstractCommand <|-- Preview
AbstractCommand <|-- ToggleLivePreview
AbstractCommand <|-- Export
AbstractCommand <|-- Template

AmigoModeler *--> "_previewer" Preview
AmigoModeler *--> "_toggler" ToggleLivePreview
AmigoModeler *--> "_exporter" Export
AmigoModeler *--> "_templater" Template

Preview - ToggleLivePreview

caption Figure Amigo Modeler class diagram
@enduml
*/
'use strict';

import * as path from 'path';
import * as vscode from 'vscode';

import {AbstractExtension} from '../extension';
import {Export} from './export-cmd';
import {Preview} from './preview-cmd';
import {ToggleLivePreview} from './toggle-preview-cmd';
import {Template} from './template-cmd';
import {AbstractRenderer} from './renderer';
import {AddVizJsSupport} from './add-vizjs-support-cmd';

let __ext = null;

export function activate(context: vscode.ExtensionContext) {
    AbstractRenderer.setupExecutionContext(context);
    
    __ext = new AmigoModeler(context);
    __ext.activate();
}

export function deactivate() {
    __ext.deactivate();
}

export class AmigoModeler extends AbstractExtension {
    private _exporter: Export;
    private _previewer: Preview;
    private _templater: Template;
    private _previewToggler: ToggleLivePreview;
    private _vizJsSupportAgent: AddVizJsSupport;

    protected _prepareCommands() {
        this._exporter = new Export(this);
        this._templater = new Template(this);
        this._previewer = new Preview(this);
        this._previewToggler = new ToggleLivePreview(this);
        this._previewer._previewToggler = this._previewToggler; 
        this._previewToggler._preview = this._previewer;
        this._vizJsSupportAgent = new AddVizJsSupport(this);
    }
}