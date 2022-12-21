<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
require("DbConnect.php");

$conn = new DbConnect;
$db = $conn->connect();
$method = $_SERVER['REQUEST_METHOD'];

function _parsePut()
{
    global $_PUT;

    /* PUT data comes in on the stdin stream */
    $putdata = fopen("php://input", "r");

    /* Open a file for writing */
    // $fp = fopen("myputfile.ext", "w");

    $raw_data = '';

    /* Read the data 1 KB at a time
       and write to the file */
    while ($chunk = fread($putdata, 1024))
        $raw_data .= $chunk;

    /* Close the streams */
    fclose($putdata);

    // Fetch content and determine boundary
    $boundary = substr($raw_data, 0, strpos($raw_data, "\r\n"));

    if (empty($boundary)) {
        parse_str($raw_data, $data);
        $GLOBALS['_PUT'] = $data;
        return;
    }

    // Fetch each part
    $parts = array_slice(explode($boundary, $raw_data), 1);
    $data = array();

    foreach ($parts as $part) {
        // If this is the last part, break
        if ($part == "--\r\n") break;

        // Separate content from headers
        $part = ltrim($part, "\r\n");
        list($raw_headers, $body) = explode("\r\n\r\n", $part, 2);

        // Parse the headers list
        $raw_headers = explode("\r\n", $raw_headers);
        $headers = array();
        foreach ($raw_headers as $header) {
            list($name, $value) = explode(':', $header);
            $headers[strtolower($name)] = ltrim($value, ' ');
        }

        // Parse the Content-Disposition to get the field name, etc.
        if (isset($headers['content-disposition'])) {
            $filename = null;
            $tmp_name = null;
            preg_match(
                '/^(.+); *name="([^"]+)"(; *filename="([^"]+)")?/',
                $headers['content-disposition'],
                $matches
            );
            list(, $type, $name) = $matches;

            //Parse File
            if (isset($matches[4])) {
                //if labeled the same as previous, skip
                // if (isset($_FILES[$matches[2]])) {
                //     continue;
                // }

                //get filename
                $filename = $matches[4];

                //get tmp name
                $filename_parts = pathinfo($filename);
                $tmp_name = tempnam(ini_get('upload_tmp_dir'), $filename_parts['filename']);

                //populate $_FILES with information, size may be off in multibyte situation
                $_FILES[$matches[2]][] = array(
                    'error' => 0,
                    'name' => $filename,
                    'tmp_name' => $tmp_name,
                    'size' => strlen($body),
                    'type' => $value
                );

                //place in temporary directory
                file_put_contents($tmp_name, $body);
            }
            //Parse Field
            else {
                $data[$name] = substr($body, 0, strlen($body) - 2);
            }
        }
    }
    $GLOBALS['_PUT'] = $data;
    return;
}

function executeSql($stmt)
{
    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => "Record successfully created"];
    } else {
        $response = ['status' => 0, 'message' => "Failed to create record."];
    }

    return $response;
}

function insertIntoSection($db)
{
    $section = json_decode($_POST["section"]);
    $sql = "INSERT INTO sections(id, title, comment, page_id, sequence) values(null, :title, :comment, :page_id, :sequence)";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':title', $section->title);
    $stmt->bindParam(':comment', $section->comment);
    $stmt->bindParam(':page_id', $section->page_id);
    $stmt->bindParam(':sequence', $section->sequence);
    return executeSql($stmt);
}

function insertIntoImages($db)
{
    $lastId = $db->lastInsertId();

    foreach ($_FILES['images']['tmp_name'] as $file) {
        $sql = "INSERT INTO images(id, img, section_id) values(null, :img, :section_id)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':img', file_get_contents($file));
        $stmt->bindParam(':section_id', $lastId);

        $response = executeSql($stmt);
    }

    return $response;
}

function updateSection($db, $section)
{
    $sql = "UPDATE sections SET title= :title, comment= :comment, sequence= :sequence WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $section->id);
    $stmt->bindParam(':title', $section->title);
    $stmt->bindParam(':comment', $section->comment);
    $stmt->bindParam(':sequence', $section->sequence);

    return executeSql($stmt);
}

function insertIntoNewImages($db, $section)
{
    $ids = [];
    foreach ($_FILES['newimages'] as $file) {
        $sql = "INSERT INTO images(id, img, section_id) values(null, :img, :section_id)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':img', file_get_contents($file["tmp_name"]));
        $stmt->bindParam(':section_id', $section->id);

        executeSql($stmt);
        $ids[] = $db->lastInsertId();
    }
    return $ids;
}

function selectAllIdsImages($db, $section)
{
    $sql = "SELECT id FROM images WHERE section_id = :section_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(":section_id", $section->id);
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
    if (is_array($ids)) {
        foreach ($ids as $id) {
            $sql = "DELETE FROM images WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id);

            $response = executeSql($stmt);
        }
        return $response;
    }
}

switch ($method) {
    case "POST":
        $response = insertIntoSection($db);
        $lastId = $db->lastInsertId();
        if ($response) {
            if (count($_FILES)) {
                $response = insertIntoImages($db);
            }
        }
        $response = ['status' => 1, 'lastId' => $lastId];
        echo json_encode($response);
        break;
    case "PUT":
        _parsePut();
        $section = json_decode($_PUT["section"]);

        $response = updateSection($db, $section);
        if ($response) {
            $ids = [];
            if (count($_FILES)) {
                $ids = insertIntoNewImages($db, $section);
            }

            $imageIds = selectAllIdsImages($db, $section);
            $oldImagesIds = json_decode($_PUT["oldImageIds"]);

            $idsToDelete = array_diff($imageIds, $oldImagesIds, $ids);

            $response = deleteImages($db, $idsToDelete);
        }

        echo json_encode($response);
        break;
    case "DELETE":
        $id = json_decode(file_get_contents('php://input'));
        $sql = "DELETE FROM sections WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);

        $response = executeSql($stmt);
        echo json_encode($response);
        break;
}
