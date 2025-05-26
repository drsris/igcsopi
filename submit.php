<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $insta = trim($_POST["instagram"]);
    if (!empty($insta)) {
        $insta = htmlspecialchars($insta);
        file_put_contents("beta_users.txt", $insta . PHP_EOL, FILE_APPEND);
        echo "Sikeres jelentkezés!";
    } else {
        echo "Kérlek, add meg az Instagram neved!";
    }
} else {
    echo "Hibás kérés.";
}
?>
