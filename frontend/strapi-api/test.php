<?php
echo "PHP works!\n";
$ch = curl_init("http://127.0.0.1:1337/admin");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch);
} else {
    echo "Strapi response length: " . strlen($result);
}
curl_close($ch);
