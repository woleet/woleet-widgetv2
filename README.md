# Woleet widgets (version 2)

## Installation

```bash
npm i
```

# File Hasher widget

This widget will focus on file downloading, hashing and previewing.

## Initialization

Insert next code to integrate the widget in a web page.

```bash
<script>
  (function (d,s,i,f) {
    var js = d.createElement(s); var fjs = d.getElementsByTagName(s)[0];
    js.id = i; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'file-hasher-widget', '<url_to_script>/file-hasher-widget.js'));
</script>
```

The single parameter that should be changed is the last one. Replace *<url_to_script>* with the real path of the script.

## Configuration

The next options are available.

## Basic usage

See [examples/file-hasher-widget-example.html](examples/file-hasher-widget-example.html) for an example about how to insert this widget in a web page.



# Proof Verifier widget

# Download Proxy Server

To download any file from the Internet, it's needful to launch the Node.js server that is like a proxy server to get the files are forbidden by CORS. The server script is quiet simple. It just broadcasts the resource flow to the widget.

Execute next command to launch the script:

```bash
cd ./server
node app
```
