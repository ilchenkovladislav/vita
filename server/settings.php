<?php
require_once("headers.php");
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

function updatePageSettings($db, $data)
{
    $sql = "UPDATE settings SET theme=:theme WHERE page_id=:page_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':page_id', $data->pageId);
    $stmt->bindParam(':theme', $data->settings->theme);

    return executeSql($stmt);
}

function selectThemeById($db, $pageId)
{
    $sql = "SELECT theme FROM settings WHERE page_id = :page_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':page_id', $pageId);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

switch ($method) {
    case "GET":
        $pageId = $_GET["pageId"];
        $theme = selectThemeById($db, $pageId);

        echo json_encode($theme["theme"]);
        break;
    case "POST":
        $data = json_decode(file_get_contents('php://input'));

        $response = updatePageSettings($db, $data);

        echo json_encode($response);
        break;
}
