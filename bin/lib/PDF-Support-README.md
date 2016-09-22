# PDF Export Support README **Deprecated** 

## Background

Note, Microsoft imposes a 20MB limit on the size of vsix files (ie. extension installers) which are hosted in the marketplace. This restriction has caused a conflict between how the Amigo PlantUML extension is published to the marketplace, the initial deployment after install and the post installation configurations. 

This README discusses the approach of downloading and installing the specific Batik PDF support binaries upon request. Please refer to the [VizJS Support](../VizJS-Support-README.md) as another alternate strategy to reducing the publishing footprint for the extension. 

After much investigation it was concluded that whilst most users are unlikely to require the export to PDF format feature, the overrall footprint still exceeds the 20MB threshold even after complete Batik removal. Therefore, a better strategy is to defer the installation of VizJS. As such, the Add PDF Export Support command will be removed from the extension. The following discussion serves as a basis for consideration should Microsoft reduce their marketplace restrictions further.  

## The /bin/lib Folder

Note, the plantuml-vscode-8407.jar file has been packaged with a custom manifest file that includes a classpath reference. This manifest makes specific references to dependent external Jar files. One of the referenced Jar files is batik-rasterizer.jar, which is part of the Batik 1.7 distribution. Note, batik-rasterizer.jar too has a manifest file which requires all the dependent jar files to be hosted in the lib folder.

Therefore, in order to export to PDF format, it is critical that the following files from the Batik 1.7 distribution be placed into this folder:
```
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
  js.jar
  pdf-transcoder.jar
  xalan-2.6.0.jar
  xerces_2_5_0.jar
  xml-apis-ext.jar
  xml-apis.jar
```

Remember, the manifest file governs what Jar files are loaded. Therefore, there is no point adding any additional Jar files in this folder as they will not get loaded!


## Add PlantUML PDF Export Support Command

A previous unpublished beta version of the extension included a command that could be invoked once the extension was installed into VSCode. Using the predefined list of required Batik library jar files (refer above) the extension's "/bin/lib/" is then inspected for any missing entries. For each missing Batik library Jar file, a http download request is made from the [extension's source code repository](https://github.com/ashinw/vscode-plantuml-ext/blob/master/bin/lib) hosted on GitHub until all dependents Jars have been downloaded.

Note, you need not rely on this extension's Command to add PDF support. Alternatively, you may choose to download the relevent files directly from the GitHub repository cited above and copy them to the "/bin/lib" folder yourself. 


```
<%USERPROFILE%|$USER>/.vscode/extensions/self-technologies.plant-uml-ext-<x.y.z>/bin
│   batik-rasterizer.jar
│
└───lib
        PDF-Support-README.md
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
        js.jar
        pdf-transcoder.jar
        xalan-2.6.0.jar
        xerces_2_5_0.jar
        xml-apis-ext.jar
        xml-apis.jar

```
Figure : Amigo PlantUML extension binary file list

The figure above enumerates all the relevent binary files and their respective locations required for PDF export support.