<?php
include_once 'db_connect.php';

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from cat_tree table
$sql = "SELECT * FROM cat_tree";
$result = $conn->query($sql);

// Check if the query was successful
if (!$result) {
    die("Query failed: " . $conn->error);
}

$cat_tree = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $cat_tree[] = $row;
    }
} else {
    die("No data found in cat_tree table.");
}

// Debugging: Check the fetched data
if (empty($cat_tree)) {
    die("No data fetched from the database.");
}

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($cat_tree, JSON_PRETTY_PRINT);
