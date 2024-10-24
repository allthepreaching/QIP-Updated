<?php
include_once 'db_connect.php';
header('Content-Type: application/json');

$table = $_GET['table'] ?? '';

if (empty($table)) {
    echo json_encode(['error' => 'Table name is required']);
    exit;
}

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM `$table`";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

$conn->close();

echo json_encode($data);
