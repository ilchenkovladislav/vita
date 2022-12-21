<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
require("DbConnect.php");

$conn = new DbConnect;
$db = $conn->connect();
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $sql = "SELECT id, img FROM images WHERE section_id = :section_id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':section_id', $_GET["id"]);
        $stmt->execute();
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        for ($i = 0; $i < count($images); $i++) {
            $images[$i]["img"] = base64_encode($images[$i]["img"]);
        }

        echo json_encode($images);
        break;
}
