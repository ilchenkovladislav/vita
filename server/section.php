<?php
require_once("headers.php");
require("DbConnect.php");

$conn = new DbConnect;
$db = $conn->connect();
$method = $_SERVER['REQUEST_METHOD'];

require("parsePut.php");

function executeSql($stmt)
{
    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => "Record successfully created"];
    } else {
        $response = ['status' => 0, 'message' => "Failed to create record."];
    }

    return $response;
}

function insertIntoSection($db, $section)
{
    $sql = "INSERT INTO sections(id, title, comment, page_id, sequence) values(null, :title, :comment, :page_id, :sequence)";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':title', $section->title);
    $stmt->bindParam(':comment', $section->comment);
    $stmt->bindParam(':page_id', $section->pageId);
    $stmt->bindParam(':sequence', $section->sequence);
    return executeSql($stmt);
}

function updateSection($db, $section)
{
    $sql = "UPDATE sections SET title= :title, comment= :comment, page_id= :page_id, sequence= :sequence WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $section->id);
    $stmt->bindParam(':title', $section->title);
    $stmt->bindParam(':comment', $section->comment);
    $stmt->bindParam(':page_id', $section->pageId);
    $stmt->bindParam(':sequence', $section->sequence);

    return executeSql($stmt);
}

function deleteSection($db, $id)
{
    $sql = "DELETE FROM sections WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $id);

    return executeSql($stmt);
}

switch ($method) {
    case "POST":
        $section = json_decode($_POST["section"]);

        $response = insertIntoSection($db, $section);

        $lastId = $db->lastInsertId();
        $response['lastId'] = $lastId;

        echo json_encode($response);
        break;
    case "PUT":
        _parsePut();

        $section = json_decode($_PUT["section"]);

        $response = updateSection($db, $section);

        echo json_encode($response);
        break;
    case "DELETE":
        $id = json_decode(file_get_contents('php://input'));

        $response = deleteSection($db, $id);

        echo json_encode($response);
        break;
}
