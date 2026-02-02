<?php
$path = isset($_GET["path"]) ? "/" . $_GET["path"] : preg_replace("#^/strapi-api#", "", $_SERVER["REQUEST_URI"]);
$url = "http://127.0.0.1:1337" . $path;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { exit; }

$context = stream_context_create([
    "http" => [
        "method" => $_SERVER["REQUEST_METHOD"],
        "header" => "Content-Type: application/json\r\n",
        "content" => file_get_contents("php://input"),
        "timeout" => 30,
        "ignore_errors" => true
    ]
]);

$body = @file_get_contents($url, false, $context);
if ($body === false) {
    http_response_code(502);
    echo "Proxy error";
    exit;
}

// Получаем Content-Type из заголовков ответа
$contentType = "text/html";
if (isset($http_response_header)) {
    foreach ($http_response_header as $h) {
        if (stripos($h, "Content-Type:") === 0) {
            $contentType = trim(substr($h, 13));
        }
        if (preg_match("#HTTP/\d+\.\d+ (\d+)#", $h, $m)) {
            http_response_code((int)$m[1]);
        }
    }
}

header("Content-Type: $contentType");
echo $body;
