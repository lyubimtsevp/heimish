const http = require("http");

const server = http.createServer((req, res) => {
  const options = {
    hostname: "127.0.0.1",
    port: 1337,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: "127.0.0.1:1337" }
  };
  
  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  req.pipe(proxy);
  proxy.on("error", (err) => {
    res.writeHead(502);
    res.end("Proxy Error: " + err.message);
  });
});

server.listen(3000, () => console.log("Proxy running on port 3000"));
