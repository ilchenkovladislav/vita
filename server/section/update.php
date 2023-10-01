<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../config/database.php";
include_once "../objects/section.php";
include_once "../objects/image.php";
require "../utility/createServerResponse.php";
require_once "../utility/getFullPathToFolder.php";


$database = new Database();
$db = $database->getConnection();

$section = new Section($db);
$sections = json_decode($_POST["sections"]);

$newIds = [];

if (count($_FILES)) {
    $files = $_FILES['newImages'];
    $newIds = insertIntoNewImages($db, $sections[0]->id);
}

$imageIds = selectAllIdsImages($db, $sections[0]->id);

$idsOldImages = [];

if (isset($_POST["idsOldImages"])) {
    $idsOldImages = json_decode($_POST["idsOldImages"]);
}

$idsToDelete = array_diff($imageIds, $idsOldImages, $newIds);

$response = deleteImages($db, $idsToDelete);

function updateAll($sections, &$section)
{
    foreach ($sections as $data) {
        $section->id = $data->id;
        $section->title = $data->title;
        $section->comment = $data->comment;
        $section->pageId = $data->pageId;
        $section->sequence = $data->sequence;

        if (!$section->update()) {
            return false;
        }
    }

    return true;
}

if (updateAll($sections, $section)) {
    http_response_code(200);

    echo createServerResponse(200, "Страница обновлена", $sections);
} else {
    http_response_code(503);

    echo createServerResponse(503, "Невозможно обновить страницу");
}

function insertIntoNewImages($db, $sectionId)
{
    $images = [];

    if (empty($_FILES)) {
        return;
    }

    foreach ($_FILES["newImages"]["name"] as $index => $filename) {
        $tmpFile = $_FILES["newImages"]["tmp_name"][$index];
        $targetPath = getFullPathToFolder($filename);

        if (move_uploaded_file($tmpFile, $targetPath)) {
            $image = new Image($db);
            $image->path = $filename;
            $image->sectionId = $sectionId;

            if ($image->create()) {
                $image->id = $image->getLastId();
                $image->path = $targetPath;
                $images[] = $image;
            } else {
                $errors[] = "Error creating image: $targetPath";
            }
        } else {
            $errors[] = "Error moving uploaded file: $filename";
        }
    }

    return array_map(function($el) {
        return $el->id;
    }, $images);
}

function selectAllIdsImages($db, $sectionId)
{
    $sql = "SELECT id FROM images WHERE section_id = :section_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(":section_id", $sectionId);
    $stmt->execute();

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

            $stmt->execute();
        }

        return;
    }

    return ['status' => 1, 'message' => "Record successfully created"];
}
