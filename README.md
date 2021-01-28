# Woleet widgets (version 2)

This package contains web widgets useful when you want to deal with Woleet proofs.  

# File Hasher widget

This web widget allows to preview a file and compute its SHA256 hash. It is easily embeddable in any web page.
Since computing the hash of the proven file is the first step when you want to create or verify a Woleet proof, this widget is
particularly useful.

The file can be dropped by the user, or its URL can be provided to the widget for an automated download.
A preview is automatically displayed if the file is an image or a PDF file. When the user clicks on the preview, the file is displayed full screen.
The SHA256 hash of the file is computed in background: callbacks can be used to get the hashing progress and result.

## Build

```bash
npm i
npm run build
```

## Integration

To integrate one or several widgets in a web page, first insert the following code:

```html
<script>
  (function (d,s,i,f) {
    var js = d.createElement(s); var fjs = d.getElementsByTagName(s)[0];
    js.id = i; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'file-hasher-widget', '<script_path>/file-hasher-widget.js'));
  hasher = {
    pdfjsLibWorkerScriptPath: '<script_path>/pdf.worker.min.js',
    weblibsWorkerScriptPath: '<script_path>/woleet-hashfile-worker.min.js'
  };
</script>
```

Note that you need to replace *<script_path>* with the actual path of the script.

Then, instantiate the widget by creating a `<div>` tag with a `class="file-hasher-widget"` attribute:

```html
<div class="file-hasher-widget"></div>
```

## Configuration

### Attributes

The following attributes can be set on `<div>` tag to configure the behavior of the widget (see [Usage](#Usage) for more details).

* __id__ - Identifier of the widget.
 
 If not defined, it is generated by the widget (ex. _file-hasher-widget-00becbf7-f2d5-37c5-1b48-961c7389c900_).
       
* __proxy__ - A proxy to download external files via XMLHttpRequest:
           
    * __url__ - the proxy URL; _DEFAULT_: ___null___
           
    * __enabled__ - the proxy state; _DEFAULT_: ___false___
    
* __file__ - Downloaded file:
    
    * __url__ - URL of the file to download (the URL must be local URL or must support CORS)

* __observers__ - Callback functions called by the widget:

    * __downloadingStarted__ - is called once the file is started to download. Parameters: ___widgetId___, ___url___;

    * __downloadingProgress__ - is called once the file downloading progress is changed. Parameters: ___widgetId___, ___progress (in percent)___;
    
    * __downloadingCanceled__ - is called once the file downloading is canceled. Parameters: ___widgetId___;
    
    * __downloadingFinished__ - is called once the file is downloaded. Parameters: ___widgetId___, ___downloaded file___;
    
    * __downloadingFailed__ - is called once the file is failed. Parameters: ___widgetId___, ___error code___, ___response status___, ___response message___;
    
    Possible codes:
         
            url_not_found - the download url is wrong;
            
            cors - CORS policy issue;

            forbidden - the download is forbidden with this url

            download_unavailable - the download is unavailable for more information see the response message
    
    * __hashingStarted__ - is called once the hashing process is started. Parameters: ___widgetId___, ___hashed file___, ___isPreviewable___;
    
    * __hashingCanceled__ - is called once the hashing process is canceled. Parameters: ___widgetId___;
    
    * __hashingProgress__ - is called once the hashing progress has changed. Parameters: ___widgetId___, ___progress___ (_in percents_);
    
    * __hashingFinished__ - is called once the file is hashed. Parameters: ___widgetId___, ___hash___, ___hashed file___;
    
    * __widgetReset__ - is called when the widget is reset. Parameters: ___widgetId___;

### Usage

There are several ways to configure the widget:

* set parameters using the `config` attribute of the HTML element:

```html
<div class="file-hasher-widget" config='{"file": {"url": "http://pngimg.com/uploads/google/google_PNG19644.png"}, "observers": {"hashingFinished": "hashingFinishedObserver", "downloadingFinished": "downloadingFinishedObserver"}}'></div>
```
* set parameters as attributes of the HTML element:

```html
<div class='file-hasher-widget'
     file='{"url": "http://pngimg.com/uploads/google/google_PNG19634.png"}'
     observers='{"hashingFinished": "test.hashingFinished"}'></div>
 ```
Note that if a parameter has nested parameters they can be set also as attributes by joining via '-' in lower case:

```html
<div class='file-hasher-widget'
     id='file-hasher-widget-de'
     file-url='http://pngimg.com/uploads/google/google_PNG19634.png'
     observers-hashingFinished='window.hashingFinished'></div>
```

Dynamic initialization is also available. It can be done using the method __init__ of the widget.
There is an example in the file [examples/file-hasher-widget-delayed-example.html](examples/file-hasher-widget-delayed-example.html)

You can dynamically reset the widget while keeping the same configuration with the method __reset__ of the widget.

## Examples

### Embed the widget in a regular web page

See [examples/file-hasher-widget-example.html](examples/file-hasher-widget-example.html) for an example about how to insert the widget in a web page.

## Development

### Proxy Server

To allow the widget to download a file, the file URL must be a local URL or must support CORS.

To easy testing during development, a Node.js server is provided.
This simple server proxies any URL on the local URL `http://localhost:3000/download?url=<URL>`

Execute next command to launch the server:

```bash
cd ./server
node app
```

# Proof Verifier widget

COMING SOON! Please contact support@woleet.com.
