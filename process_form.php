<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    error_log("Form submission received");
    // Sanitize input data
    $company = filter_input(INPUT_POST, 'company', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $notes = filter_input(INPUT_POST, 'notes', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $totalItems = filter_input(INPUT_POST, 'totalItems', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $totalQty = filter_input(INPUT_POST, 'totalQty', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $totalWeight = filter_input(INPUT_POST, 'totalWeight', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $tableData = $_POST['tableData'];
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        error_log("Invalid email format: $email");
        die("Invalid email format");
    }
    // Prepare data for CSV
    $csvContent = "Quality Industrial Products Group Inc\n";
    $csvContent .= "dba Quality Fastener Products\n";
    $csvContent .= "276 Boston Turnpike\n";
    $csvContent .= "Shrewsbury MA 01545\n";
    $csvContent .= "508-845-2935\n";
    $csvContent .= "sales@qualityindustrialproducts.com\n";
    $csvContent .= "\"Company\",\"$company\",\"\",\"Total Items\",\"$totalItems\"\n";
    $csvContent .= "\"Name\",\"$name\",\"\",\"Total Quantity\",\"$totalQty\"\n";
    $csvContent .= "\"Email\",\"$email\",\"\",\"Total Weight\",\"$totalWeight lbs\"\n";
    $csvContent .= "\"Phone\",\"$phone\"\n";
    $csvContent .= "\"Notes\",\"$notes\"\n\n";
    $csvContent .= "Line,Item-Code,Description,Quantity,Weight\n";
    foreach ($tableData as $index => $row) {
        $csvContent .= implode(",", array_map(function ($cell) {
            return "\"$cell\"";
        }, $row)) . "\n";
    }
    // Generate unique filename
    $date = new DateTime();
    $formattedDate = $date->format('m-d-y_His'); // Include time for uniqueness
    $companyOrName = $company ?: $name;
    $uniqueId = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6); // Generate a 6 digit alphanumeric ID
    $filename = "{$formattedDate}_{$companyOrName}_{$uniqueId}.csv";
    // Determine the folder name based on the current month and year
    $monthYearFolder = $date->format('m-Y');
    $folderPath = "quotes/$monthYearFolder";
    // Create the folder if it doesn't exist
    if (!is_dir($folderPath)) {
        mkdir($folderPath, 0777, true);
    }
    // Save CSV to file
    $csvFilePath = "$folderPath/$filename";
    $csvFile = fopen($csvFilePath, 'w');
    if ($csvFile === false) {
        error_log("Failed to create CSV file at $csvFilePath");
        die("Failed to create CSV file");
    }
    fwrite($csvFile, $csvContent);
    fclose($csvFile);
    error_log("CSV file created successfully at $csvFilePath");

    // Email the CSV file as an attachment
    $to = 'nickbetti@qualityindustrialproducts.com';
    $cc = $email;
    $subject = 'QIP Quote Submission - ' + $companyOrName + ' - #' + $uniqueId;
    $message = 'Please find the attached CSV file with the form submission data. We will get back to you with pricing asap! Thank you so much!';
    $headers = 'From: sales@qualityindustrialproducts.com' . "\r\n" .
        'Cc: ' . $cc . "\r\n" .
        'MIME-Version: 1.0' . "\r\n" .
        'Content-Type: multipart/mixed; boundary="boundary"' . "\r\n";
    $attachment = chunk_split(base64_encode(file_get_contents($csvFilePath)));
    $body = "--boundary\r\n" .
        "Content-Type: text/plain; charset=UTF-8\r\n" .
        "Content-Transfer-Encoding: 7bit\r\n\r\n" .
        $message . "\r\n" .
        "--boundary\r\n" .
        "Content-Type: text/csv; name=\"$filename\"\r\n" .
        "Content-Transfer-Encoding: base64\r\n" .
        "Content-Disposition: attachment; filename=\"$filename\"\r\n\r\n" .
        $attachment . "\r\n" .
        "--boundary--";
    if (!mail($to, $subject, $body, $headers)) {
        error_log("Failed to send email to $to");
        die("Failed to send email");
    } else {
        echo "Form submitted successfully!";
    }
}
