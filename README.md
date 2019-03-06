# Woleet widgets (version 2)

## Installation

```bash
npm i
```

# File Hasher widget

This widget allows to drop or download a file, compute its hash and preview it.

## Initialization

To integrate one or several widgets in a web page, first insert the following code:

```bash
<script>
  (function (d,s,i,f) {
    var js = d.createElement(s); var fjs = d.getElementsByTagName(s)[0];
    js.id = i; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'file-hasher-widget', '<url_to_script>/file-hasher-widget.js'));
</script>
```

Note that you need to replace *<url_to_script>* with the actual path of the script.

Then, instantiate each widget by creating a <div>:

```html
<div class="file-hasher-widget" config='{"lang": "fr"}'}}'></div>
```

## Configuration

The following options are available:

TODO

## Basic usage

See [examples/file-hasher-widget-example.html](examples/file-hasher-widget-example.html) for an example about how to insert this widget in a web page.

# Download Proxy Server

To allow the widget to download the file, the file URL must be proxied or the URL must support CORS.

For testing, a Node.js server is provided. This simple server simply redirect the resource flow to the widget.
Execute next command to launch the server:

```bash
cd ./server
node app
```

# Proof Verifier widget

This widget focuses on proof verification and displaying.
