<?php
// Database configuration
$servername = "localhost";  // your database server
$username = "root";         // your database username
$password = "";             // your database password
$dbname = "registration_db";  // your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $username = mysqli_real_escape_string($conn, $_POST['username']);
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $password = mysqli_real_escape_string($conn, $_POST['password']);
  $confirm_password = mysqli_real_escape_string($conn, $_POST['confirm_password']);

  // Check if passwords match
  if ($password !== $confirm_password) {
    echo "Passwords do not match!";
    exit();
  }

  // Hash the password for security
  $hashed_password = password_hash($password, PASSWORD_DEFAULT);

  // Prepare SQL query to insert data
  $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";

  // Execute the query and check if successful
  if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  // Close connection
  $conn->close();
}
?>
