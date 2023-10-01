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

function selectPageByLink($db, $link)
{
    $sql = "SELECT * FROM pages WHERE link = :link";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':link', $link);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getPageTheme($db, $pageId)
{
    $sql = "SELECT * FROM settings WHERE page_id = :page_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':page_id', $pageId);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function selectPageSections($db, $page)
{
    $sql = "SELECT id, title, comment, page_id, sections.sequence FROM sections WHERE page_id = :pageid";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':pageid', $page["id"]);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function selectSectionImages($db, $section)
{
    $sql = "SELECT id, path FROM images WHERE section_id = :section_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':section_id', $section["id"]);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertIntoPage($db, $page)
{
    $sql = "INSERT INTO pages(id, title, link) values(null, :title, :link)";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':title', $page->title);
    $stmt->bindParam(':link', $page->link);

    return executeSql($stmt);
}

function updatePage($db, $page)
{
    $sql = "UPDATE pages SET title= :title WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $page->pageId);
    $stmt->bindParam(':title', $page->title);

    return executeSql($stmt);
}

function deletePage($db, $id)
{
    $sql = "DELETE FROM pages WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $id);

    return executeSql($stmt);
}

function insertIntoSettings($db, $pageId)
{
    $sql = "INSERT INTO settings(id, theme, page_id) values(null, null, :page_id)";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':page_id', $pageId);

    return executeSql($stmt);
}

switch ($method) {
    case "GET":
        $link = $_GET["link"];

        $page = selectPageByLink($db, $link);

        $page["sections"] = selectPageSections($db, $page);

        for ($i = 0; $i < count($page["sections"]); $i++) {
            $images = selectSectionImages($db, $page["sections"][$i]);

            for ($j = 0; $j < count($images); $j++) {
                $images[$j]["path"] = "http://vita/server/files/" . $images[$j]["path"];
            }

            $page["sections"][$i]["imgs"] = $images;
        }

        $page["theme"] = getPageTheme($db, $page["id"])["theme"];

        echo json_encode($page);
        break;
    case "POST":
        $page = json_decode(file_get_contents('php://input'));

        $response = insertIntoPage($db, $page);

        $lastId = $db->lastInsertId();
        insertIntoSettings($db, $lastId);
        $response["lastId"] = $lastId;

        echo json_encode($response);
        break;
    case "PUT":
        $page = json_decode(file_get_contents('php://input'));

        $response = updatePage($db, $page);

        echo json_encode($response);
        break;
    case "DELETE":
        $id = json_decode(file_get_contents('php://input'));

        $response = deletePage($db, $id);

        echo json_encode($response);
        break;
}
