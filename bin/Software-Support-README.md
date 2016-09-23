# Software Support README 

## Background

Note, Microsoft imposes a 20MB limit on the size of vsix files (ie. extension installers) which are hosted in the marketplace. 

This restriction has caused a conflict on how the Amigo PlantUML extension is tested in development mode, installed locally via the command line, published to the marketplace, and the post-installation deployment configuration. 

This README discusses the approach of downloading and installing all the support software binaries upon request.


## The bin/ & bin/lib/ Folder

Note, the plantuml-vscode-8407.jar file has been packaged with a custom manifest file that includes a classpath reference. 

```
Class-Path: batik-rasterizer.jar vizjs.jar j2v8_win32_x86_64-4.6.0.jar j2v8_linux_x86_64-4.6.0.jar j2v8_macosx_x86_64-4.6.0.jar j2v8_win32_x86-4.6.0.jar
Main-Class: net.sourceforge.plantuml.Run
SplashScreen-Image: net/sourceforge/plantuml/version/logo.png
Implementation-Title: 8407 vscode build
Source-Modification-Notes: changed net.sourceforge.plantuml.pdf.PdfConverter to use au.com.self.ide.vscode.ext.plantuml.NullSVGConverterController
Library-Modification-Notes: Batik@1.7.1, J2V8@4.6.0
```
Figure 1: Manifest file packaged in plantuml-vscode-8407.jar


This manifest makes specific references to dependent external Jar files. There are five library references in the manifest file that are related to VizJS. There is also a library reference to batik-rasterizer.jar which includes Batik's rasterizer utility that PlantUML uses for PDF export. However, of the VizJS related files, only two Jar files are required:
1. the VizJS binary, and 
2. the platform & architecture specific J2V8 distribution. 

Remember, the manifest file governs what Jar files are loaded. Therefore, there is no point adding any additional Jar files into this folder as they will not get loaded!


## Install PlantUML Support Software Command

This version of the extension includes a command that can be invoked once the extension has been installed into VSCode. Using the predefined list of required library jar files (refer above) the extension's "bin/" & "bin/lib/" is then inspected for any missing entries. For each missing VizJS library Jar file, a http download request is made from the [extension's source code repository](https://github.com/ashinw/vscode-plantuml-ext/blob/master/bin) hosted on GitHub until all dependents Jars have been downloaded **for your platform and architecture**.

Note, you may alternatively choose to download the relevent files directly from the GitHub repository cited above and copy them to the "bin/" & "bin/lib/" folder yourself.


```
<%USERPROFILE%|$USER>/.vscode/extensions/self-technologies.plant-uml-ext-<x.y.z>/bin
│   batik-rasterizer.jar
│   j2v8_linux_x86_64-4.6.0.jar
│   j2v8_macosx_x86_64-4.6.0.jar
│   j2v8_win32_x86-4.6.0.jar
│   j2v8_win32_x86_64-4.6.0.jar
│   plantuml-vscode-8407.jar
│   Software-Support-README.md
│   vizjs.jar
│
└───lib
        batik-anim.jar
        batik-awt-util.jar
        batik-bridge.jar
        batik-codec.jar
        batik-css.jar
        batik-dom.jar
        batik-ext.jar
        batik-gvt.jar
        batik-parser.jar
        batik-script.jar
        batik-svg-dom.jar
        batik-transcoder.jar
        batik-util.jar
        batik-xml.jar
        DONT-DELETE-THIS-FOLDER.txt
        js.jar
        pdf-transcoder.jar
        xalan-2.6.0.jar
        xerces_2_5_0.jar
        xml-apis-ext.jar
        xml-apis.jar```
```
Figure 2 : Amigo PlantUML extension binary file list

The figure above enumerates all the relevent binary files and their respective locations. Remember, you only need the j2v8 jar file for your platform and architecture. There is not harm in leaving the other architecture jar files as they will not get loaded.


## GraphViz Native installation
Graphviz is an open-source package that is used in [some areas of PlantUML](http://plantuml.com/graphvizdot.html). You can find out a lot more about [GraphViz at the website](http://www.graphviz.org/). At the GraphViz website you will be able to find [relevant downloads for your platform](http://www.graphviz.org/Download..php).

After installation ensure that you set an OS environmental variable that makes reference to the DOT application location [as instructed on the PlantUML website](http://plantuml.com/graphvizdot.html). PlantUML inspects the GRAPHVIZ_DOT setting prior to attempting to render any diagram. If this variable is not set, then the VizJS or the JDot implementation will used if present.

```
set GRAPHVIZ_DOT=C:\win.DATA\dev\tool\graphviz-2.38\bin\dot.exe
```
Eg. Windows configuration