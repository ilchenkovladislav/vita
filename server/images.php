<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
require("DbConnect.php");

$conn = new DbConnect;
$db = $conn->connect();
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        if (count($_FILES)) {
            foreach ($_FILES["images"]["error"] as $key => $error) {
                if ($error == UPLOAD_ERR_OK) {
                    $tmp_name = $_FILES["images"]["tmp_name"][$key];

                    $uploaddir = 'C:\OSPanel\domains\vita\server\images\\';
                    $uploadfile = $uploaddir . basename($_FILES["images"]["name"][$key]);
                    move_uploaded_file($tmp_name, $uploadfile);
                }
            }
        }

        if (count($_POST)) {
            $page = json_decode($_POST["json"]);
            $idSection = isset($_POST["id"]) ? $_POST["id"] : count($page->sections) - 1;
            foreach ($page->sections[$idSection]->images as $image) {
                $image->path = 'http://vita/server/images/' . $image->path;
            }
        }

        $page->sections = json_encode($page->sections);

        $sql = "UPDATE pages SET page= :page WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $page->id);
        $stmt->bindParam(':page', $page->sections);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;
}
