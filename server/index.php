<?php
require_once("headers.php");
require("DbConnect.php");

$conn = new DbConnect;
$db = $conn->connect();
$method = $_SERVER['REQUEST_METHOD'];

function selectAllPages($db)
{
    $sql = "SELECT * FROM pages";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function selectPageSections($db, $page)
{
    $sql = "SELECT id, title, comment, page_id, sections.sequence FROM sections WHERE page_id = :pageid";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':pageid', $page["id"]);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

switch ($method) {
    case 'GET':
        $pages = selectAllPages($db);

        $result = [];

        foreach ($pages as $page) {
            $page["sections"] = selectPageSections($db, $page);
            $result[] = $page;
        }

        echo json_encode($result);
        break;
}
