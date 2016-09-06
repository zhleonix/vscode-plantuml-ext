# Self Technologies P/L PlantUML

A Visual Studio Code extension for PlantUML preview an export 

PlantUML is [here](http://plantuml.com/).

PlantUML vscode extension [source code](https://github.com/ashinw/vscode-plantuml-ext)

## Acknowledgement
In a former life I was once a UML distilled enthusiast and an agile modeling advocate. Nowdays I still use UML; although what I model now is the nature of all things. 

I was previously using PlantUML Gizmo's Google Doc's plugin but that had too much network latency. 

A few days ago I thought I would change my workflow and move the documents and models to bitbucket. As such I picked up vscode and looked around for a PlantUML extension. I found [Kazuki Ohta's PlantUML extension] (https://marketplace.visualstudio.com/items?itemName=okazuki.okazukiplantuml) and installed it.

Unfortunately, I had a few issues with Kazuki's implementation for my non-functional requirements.
I wanted:
- SVG preview
- SVG export
- No temporary image file creation to avoid SSD burn. Note, live preview re-creates a lot of the same file.    

Using both Kazuki's code and [Microsoft's vscode extension samples](https://github.com/Microsoft/vscode-extension-samples/tree/master/contentprovider-sample/) I decided to learn typescript and take a shot at writing the extension that I needed for my requirements. Hence, if you look at the code you will probably note a heavy Java style to it.

Anyway, do as you see fit with this extension and code. I make no claim to it. 


## Features

- Displays PlantUML text in SVG format
- No temporary files are created during live preview to improve SSD life
- Export to all available formats offered by PlantUML

![Preview window](https://github.com/runceel/plantumlpreview/blob/master/images/plantuml.gif?raw=true)

### Commands
- `Preview Plant UML text from active editor` : Start PlantUML live-preview
A PlantUML artifact is not identified by filename extension. Whilst it is common to name PlantUML files have an extension of '.pu', this is not necessary. As such, this VSCide extension established the following requirements for activation:
1. PlantUML source must start with the keyword: @startuml
2. PlantUML source must start with the keyword: @enduml

This check will reduce the repeated processing via syntax checks in the IDE as you navigate between open files in the editor. 

- `Export Plant UML text from active editor as {fmt.type} file` : Export Plant UML to selected format

As of this writing the following types have in theory been supported:

    enum OutputFmt {
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

Each of these output formats have their own command available from the command palette. Simply open up PlantUML file or create a new file and enter some valid PlantUML syntax and then enter the command palette (ie. Ctrl+Shit+P) and type "Export" (without quotes) and all currently support export format options will be available. 

If the content from a new unsaved Untited file is being exported, then look in any of the following folders:
1. vscode editor workspace rootPath folder
2. OS user's home directory [when editor has not folder workspace as context (ie. editing single file only)]

If exporting a previously saved PlantUML file is being exported, then:
1. the exported file name will reside in the same folder as the source file
2. the filename will be the same as the source with an additional suffix of the nominated format's extension 


## Extension Settings

**Requsite Enviroment Variables** 

- JAVA_HOME: Java SDK
  This must be a path reference to the bin directory of the JAVA SDK
  eg. set JAVA_HOME=C:\win.DATA\dev\tool\java-1.8.0-openjdk-1.8.0.102-1-ojdkbuild.b14.windows.x86_64\bin 

- PLANTUML_JAR: 
  This must be a full path and filename reference to the plantuml.jar file install directory. Note, you may use an  
  alternate versioned distributions of PlantUML (ie. identified in the filename - plantuml-8047.jar );   
  eg. set PLANTUML_JAR=C:\win.DATA\dev\tool\plantuml.jar 

- GRAPHVIZ_DOT:
  This must a full path and filename reference to the file dot.exe file.
  eg. set GRAPHVIZ_DOT=C:\win.DATA\dev\tool\graphviz-2.38\bin\dot.exe


Note, whilst the command line has been used above to setup up the environmental variables for the current command session only, you should use the a permanent configuration approach offered by your OS.

eg. Windows Key+x / System / Advanced system settings / Enviromental Variables / User variables for %USERNAME%


## Known Issues

- PDF Export requires additional an JAVA library(s) that are not included with the PlantUML distribution. 

## Release Notes

### 0.0.1
- First release.