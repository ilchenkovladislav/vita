<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/database.php";
require_once "../objects/section.php";
require_once "../objects/image.php";
require_once "../utility/createServerResponse.php";
require_once "../utility/getFullPathToFolder.php";

$database = new Database();
$db = $database->getConnection();
$section = new Section($db);

//$data = json_decode(file_get_contents("php://input"));
$data = json_decode($_POST["section"]);

if ($data) {
    $section->title = $data->title;
    $section->comment = $data->comment;
    $section->pageId = $data->pageId;
    $section->sequence = $data->sequence;

    $errors = [];

    if ($section->create()) {
        $section->id = $section->getLastId();
        $images = moveAndCreateImages($db, $section->id, $errors);

        if (empty($errors)) {
            http_response_code(201);
            echo createServerResponse(201, "Section created.", ["section" => $section, "images" => $images]);
        } else {
            http_response_code(500);
            echo createServerResponse(500, "Some images couldn't be created.", ["errors" => $errors]);
        }
    } else {
        http_response_code(500);
        echo createServerResponse(500, "Unable to create section.");
    }
} else {
    http_response_code(400);
    echo createServerResponse(400, "Invalid JSON data received.");
}

function moveAndCreateImages($db, $sectionId, &$errors)
{
    $images = [];

    if (empty($_FILES)) {
        return;
    }

    foreach ($_FILES["images"]["name"] as $index => $filename) {
        $tmpFile = $_FILES["images"]["tmp_name"][$index];
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

    return $images;
}
