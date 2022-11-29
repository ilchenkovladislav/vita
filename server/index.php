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
        $sql = "SELECT * FROM pages";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($pages);
        break;
    case 'POST':
        $json = file_get_contents("php://input");
        $sql = "INSERT INTO pages(id, page) values(null, :page)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':page', $json);
        if ($stmt->execute()) {
            $data = ['status' => 1, 'message' => "Record successfully created"];
        } else {
            $data = ['status' => 0, 'message' => "Failed to create record."];
        }
        echo json_encode($data);
        break;
    case "PUT":
        $page = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE pages SET page= :page WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $page->id);
        $stmt->bindParam(':page', $page->sections);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;
}
