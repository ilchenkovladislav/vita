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

        $result = [];

        foreach ($pages as $page) {
            $sql = "SELECT id, title, comment, page_id, sections.sequence FROM sections WHERE page_id = :pageid";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':pageid', $page["id"]);
            $stmt->execute();

            $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $page["sections"] = $sections;
            $result[] = $page;
        }

        echo json_encode($result);
        break;
}
