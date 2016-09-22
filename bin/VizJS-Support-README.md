# PlantUML VisJS Support README 

## Background

Note, Microsoft imposes a 20MB limit on the size of vsix files (ie. extension installers) which are hosted in the marketplace. This restriction has caused a conflict between how the Amigo PlantUML extension is published to the marketplace, the initial deployment after install and the post installation configurations. 

This README discusses the approach of downloading and installing the specific VizJS binaries upon request. Please refer to the [PDF Export Support](./lib/PDF-Support-README.md) as another alternate strategy to reducing the publishing footprint for the extension.


## The /bin Folder

Note, the plantuml-vscode-8407.jar file has been packaged with a custom manifest file that includes a classpath reference. This manifest makes specific references to dependent external Jar files. There are five library references in the manifest file that are related to VizJS. However, only two Jar files are required, 1. the VizJS binary, and 2. the platform & architecture specific J2V8 distribution. 

```
j2v8_linux_x86_64-4.6.0.jar
j2v8_macosx_x86_64-4.6.0.jar
j2v8_win32_x86-4.6.0.jar
j2v8_win32_x86_64-4.6.0.jar
vizjs.jar
```

Remember, the manifest file governs what Jar files are loaded. Therefore, there is no point adding any additional Jar files into this folder as they will not get loaded!


## Add PlantUML VizJS Support Command

This version of the extension includes a command that can be invoked once the extension has been installed into VSCode. Using the predefined list of required VizJS library jar files (refer above) the extension's "/bin" is then inspected for any missing entries. For each missing VizJS library Jar file, a http download request is made from the [extension's source code repository](https://github.com/ashinw/vscode-plantuml-ext/blob/master/bin) hosted on GitHub until all dependents Jars have been downloaded **for your platform and architecture**.

Note, you need not rely on this extension's Command to add VizJS support. Alternatively, you may choose to download the relevent files directly from the GitHub repository cited above and copy them to the "/bin" folder yourself.

```
<%USERPROFILE%|$USER>/.vscode/extensions/self-technologies.plant-uml-ext-<x.y.z>/bin
│   batik-rasterizer.jar
│   j2v8_linux_x86_64-4.6.0.jar
│   j2v8_macosx_x86_64-4.6.0.jar
│   j2v8_win32_x86-4.6.0.jar
│   j2v8_win32_x86_64-4.6.0.jar
│   plantuml-vscode-8407.jar
│   VisJS.md
│   vizjs.jar
│
└───lib
```
Figure : Amigo PlantUML extension binary file list

The figure above enumerates all the relevent binary files and their respective locations. Remember, you only need the j2v8 jar file for your platform and architecture. There is not harm in leaving the other architecture jar files as they will not get loaded.


## GraphicViz Native installation
Graphviz is an open-source package that is used in some areas of PlantUML. You can find out a lot more about [GraphicViz at the website](http://www.graphviz.org/). There you will also find relevant downloads for your platform.

After installation ensure that you set an OS environmental variable that makes reference to the DOT application location. PlantUML inspects the GRAPHVIZ_DOT setting prior to attempting to render any diagram. If this variable is not set, then the VizJS or the JDot implementation will used if present.

```
set GRAPHVIZ_DOT=C:\win.DATA\dev\tool\graphviz-2.38\bin\dot.exe
```
Eg. Windows configuration