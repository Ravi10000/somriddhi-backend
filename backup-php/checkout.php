<?php
$method = 'aes-256-cbc';
$secret = "rLQjfDc4RCuNvTpsyq3IXbJVRseBZA0u";
$merchant_code = "somr_7013_y3VO6";
$iv = chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0)
    . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) .
    chr(0x0) . chr(0x0);


$data = json_encode(
    array(
        "merchant_code" => $merchant_code,
        "request_id" => $_GET['request_id'],
        "mobile" => $_GET['mobile'],
        "email" => $_GET['email'],
        "amount" => $_GET['amount'],
        "template_id" => "9384",
        "product_name" => "Gift Voucher",
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
    <form id="sendFormReq" action="https://invoicexpressnewuat.yesbank.in/pay/web/pushapi/index" method="post">
        <input type="hidden" name="merchant_code" value="<?php echo $merchant_code; ?>" />
        <input type="hidden" name="request" value="<?php echo $request; ?>" />
    </form>
</body>

</html>
<script type="text/javascript">
    document.getElementById('sendFormReq').submit();
</script>
