<?php
require_once './config.php';

// $secret = $REQUEST_HASH_KEY;
// $secret = "ff6ed5e0ecab4cdf1b";
// $merchant_code = $MCC_CODE;
// $iv = $REQUEST_SALT_IV_KEY;
// $iv = "4D2168AE92F17093";
$method = 'aes-256-cbc';
// $merchant_code = "546304";
$merchant_code = "somr_7013_y3VO6";
$secret = "rLQjfDc4RCuNvTpsyq3IXbJVRseBZA0u";
// $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($method));
$iv="";
// $iv = chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0)
//     . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) .
//     chr(0x0) . chr(0x0);

$data = json_encode(
    array(
        "merchant_code" => $merchant_code,
        "request_id" => $_GET['request_id'],
        "mobile" => $_GET['mobile'],
        "email" => $_GET['email'],
        "amount" => $_GET['amount'],
        "template_id" => "9384",
        "product_name" => "Gift Voucher",
        // "product_name" => $PRODUCT_ID,
        "return_url" => "https://somriddhi.store/payment/return.php",
    )
);
$key = substr(hash('sha256', $secret, true), 0, 32);
$request = base64_encode(
    openssl_encrypt(
        $data,
        $method,
        $key,
        OPENSSL_RAW_DATA,
        $iv
    )
);
?>

<html>

<head></head>

<body>
    <pre>
        <?php print_r($_GET); ?>
        <?php print_r($request); ?>
        <br />
        <p>iv: </p>
        <?php print_r($iv); ?>
    </pre>
    <form id="sendFormReq" action="https://invoicexpressnewuat.yesbank.in/pay/web/pushapi/index" method="post">
        <!-- <form id="sendFormReq" action="https://invoicexpressnew.yesbank.in/pay/web/pushapi/index" method="post"> -->
        <input type="hidden" name="merchant_code" value="<?php echo $merchant_code; ?>" />
        <input type="hidden" name="request" value="<?php echo $request; ?>" />
    </form>
    <button id="submit">Submit</button>
</body>

</html>
<script>
    document.getElementById('submit').addEventListener('click', () => {
        document.getElementById('sendFormReq').submit();
    });
</script>