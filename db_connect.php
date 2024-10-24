<?php
$servername = "localhost";
$dbUsername = "qipDev";
$dbPassword = "b7Z5ET^U!spBEx5G@&e4";
$dbName = "new_test";

$conn = mysqli_connect($servername, $dbUsername, $dbPassword, $dbName);
if (!$conn) {
    die("Connection Failed: " . mysqli_connect_error());
}
