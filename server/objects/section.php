<?php

class Section
{
    private $conn;
    private $table_name = "sections";

    public $id;
    public $title;
    public $comment;
    public $sequence;
    public $pageId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    function readAll()
    {
        $query = "SELECT * FROM " . $this->table_name;

        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        return $stmt;
    }

    function read($page_id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE page_id =:page_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':page_id', $page_id);

        $stmt->execute();
        return $stmt;
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
        SET
            title=:title,
            comment=:comment,
            page_id=:page_id,
            sequence=:sequence";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':comment', $this->comment);
        $stmt->bindParam(':page_id', $this->pageId);
        $stmt->bindParam(':sequence', $this->sequence);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function update()
    {
        $query = "UPDATE " . $this->table_name . "
        SET
            title=:title,
            comment=:comment,
            page_id=:page_id,
            sequence=:sequence
        WHERE
            id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':comment', $this->comment);
        $stmt->bindParam(':page_id', $this->pageId);
        $stmt->bindParam(':sequence', $this->sequence);
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
