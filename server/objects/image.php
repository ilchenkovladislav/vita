<?php

class Image
{
    private $conn;
    private $table_name = "images";

    public $id;
    public $path;
    public $sectionId;


    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE section_id=:id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);

        $stmt->execute();
        return $stmt;
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
        SET
            path=:path,
            section_id=:sectionId";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":path", $this->path);
        $stmt->bindParam(":sectionId", $this->sectionId);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function update()
    {
        $query = "UPDATE " . $this->table_name . "
        SET
            path=:path,
            section_id=:sectionId
        WHERE
            id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":path", $this->path);
        $stmt->bindParam(":sectionId", $this->sectionId);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function getLastId()
    {
        return $this->conn->lastInsertId();
    }
}
