package au.com.self.ide.vscode.ext.plantuml;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.apache.batik.apps.rasterizer.SVGConverterController;
import org.apache.batik.apps.rasterizer.SVGConverterSource;
import org.apache.batik.transcoder.Transcoder;

public class NullSVGConverterController implements SVGConverterController {

	@Override
	public void onSourceTranscodingSuccess(SVGConverterSource arg0, File arg1) {
	}

	@Override
	public boolean proceedOnSourceTranscodingFailure(SVGConverterSource arg0, File arg1, String arg2) {
		return true;
	}

	@Override
	public boolean proceedWithComputedTask(Transcoder arg0, Map arg1, List arg2, List arg3) {
		return true;
	}

	@Override
	public boolean proceedWithSourceTranscoding(SVGConverterSource arg0, File arg1) {
		return true;
	}

}
