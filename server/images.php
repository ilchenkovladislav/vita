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

function selectSectionImages($db, $id)
{
    $sql = "SELECT id, img FROM images WHERE section_id = :section_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':section_id', $id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertIntoImages($db, $sectionId, $files)
{
    foreach ($files as $file) {
        $sql = "INSERT INTO images(id, img, section_id) values(null, :img, :section_id)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':img', file_get_contents($file));
        $stmt->bindParam(':section_id', $sectionId);

        $response = executeSql($stmt);
    }

    return $response;
}

function insertIntoNewImages($db, $sectionId, $files)
{
    $ids = [];
    foreach ($files as $file) {
        $sql = "INSERT INTO images(id, img, section_id) values(null, :img, :section_id)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':img', file_get_contents($file["tmp_name"]));
        $stmt->bindParam(':section_id', $sectionId);

        executeSql($stmt);
        $ids[] = $db->lastInsertId();
    }
    return $ids;
}

function selectAllIdsImages($db, $sectionId)
{
    $sql = "SELECT id FROM images WHERE section_id = :section_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(":section_id", $sectionId);
    executeSql($stmt);

    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $imageIds = [];
    foreach ($images as $image) {
        $imageIds[] = $image["id"];
    }
    return $imageIds;
}

function deleteImages($db, $ids)
{
    if (is_array($ids) && count($ids)) {
        foreach ($ids as $id) {
            $sql = "DELETE FROM images WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id);

            $response = executeSql($stmt);
        }

        return $response;
    }

    return ['status' => 1, 'message' => "Record successfully created"];
}

switch ($method) {
    case 'GET':
        $images = selectSectionImages($db, $_GET["id"]);

        for ($i = 0; $i < count($images); $i++) {
            $images[$i]["img"] = base64_encode($images[$i]["img"]);
        }

        echo json_encode($images);
        break;

    case 'POST':
        if (count($_FILES)) {
            $files = $_FILES['images']['tmp_name'];
            echo json_encode(insertIntoImages($db, $_POST["sectionId"], $files));
        }
        break;

    case 'PUT':
        _parsePut();

        $newIds = [];

        if (count($_FILES)) {
            $files = $_FILES['newimages'];
            $newIds = insertIntoNewImages($db, $_PUT["sectionId"], $files);
        }

        $imageIds = selectAllIdsImages($db, $_PUT["sectionId"]);

        $idsOldImages = [];

        if (isset($_PUT["idsOldImages"])) {
            $idsOldImages = json_decode($_PUT["idsOldImages"]);
        }

        $idsToDelete = array_diff($imageIds, $idsOldImages, $newIds);

        $response = deleteImages($db, $idsToDelete);

        echo json_encode($response);
        break;
}
