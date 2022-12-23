<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
require("DbConnect.php");

$conn = new DbConnect;
$db = $conn->connect();
$method = $_SERVER['REQUEST_METHOD'];

function executeSql($stmt)
{
    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => "Record successfully created"];
    } else {
        $response = ['status' => 0, 'message' => "Failed to create record."];
    }

    return $response;
}

switch ($method) {
    case "POST":
        if (isset($_POST["title"])) {
            $sql = "INSERT INTO pages(id, title) values(null, :title)";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':title', $_POST["title"]);

            $response = executeSql($stmt);
        }

        $lastId = $db->lastInsertId();
        $response = ['status' => 1, 'lastId' => $lastId];
        echo json_encode($response);
        break;
    case "PUT":
        $page = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE pages SET title= :title WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $page->id);
        $stmt->bindParam(':title', $page->title);

        $response = executeSql($stmt);
        echo json_encode($response);
        break;
    case "DELETE":
        $id = json_decode(file_get_contents('php://input'));
        $sql = "DELETE FROM pages WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);

        $response = executeSql($stmt);
        echo json_encode($response);
        break;
}
