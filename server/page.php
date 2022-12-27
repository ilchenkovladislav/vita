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
    case "GET":
        $sql = "SELECT * FROM pages WHERE link = :link";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':link', $_GET["link"]);
        $stmt->execute();
        $page = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT id, title, comment, page_id, sections.sequence FROM sections WHERE page_id = :pageid";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':pageid', $page["id"]);
        $stmt->execute();
        $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $page["sections"] = $sections;

        for ($i = 0; $i < count($page["sections"]); $i++) {
            $sql = "SELECT id, img FROM images WHERE section_id = :section_id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':section_id', $page["sections"][$i]["id"]);
            $stmt->execute();
            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

            for ($j = 0; $j < count($images); $j++) {
                $images[$j]["img"] = base64_encode($images[$j]["img"]);
            }

            $page["sections"][$i]["img"] = $images;
        }

        echo json_encode($page);
        break;
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
