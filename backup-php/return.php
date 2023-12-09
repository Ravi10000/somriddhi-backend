<?php
$response = ssl_decrypt_aes($_POST['response']);
function ssl_decrypt_aes($response)
{
    $iv = chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) .
        chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) .
        chr(0x0) . chr(0x0) . chr(0x0);
    $secret = "rLQjfDc4RCuNvTpsyq3IXbJVRseBZA0u";
    $method = 'aes-256-cbc';
    $key = substr(hash('sha256', $secret, true), 0, 32);
    return openssl_decrypt(base64_decode($response), $method, $key, OPENSSL_RAW_DATA, $iv);
}
?>

<html>

<head></head>

<body>
    <form action="http://localhost:8002/api/transaction/update" method="post" id="form">
        <input id="response_input" type="hidden" name="response">
    </form>
    <script type="text/javascript">
        const responseInput = document.getElementById('response_input');
        responseInput.value = JSON.stringify(<?php echo $response; ?>);
        document.getElementById('form').submit();
    </script>
</body>

</html>