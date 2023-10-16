<?php

class Setting
{
    private $conn;
    private $table_name = "settings";

    public $id;
    public $theme;
    public $pageId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
    {
        $query = "SELECT * FROM " . $this->table_name;

        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        return $stmt;
    }

    function getTheme()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE page_id=:pageId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":pageId", $this->pageId);

        $stmt->execute();
        return $stmt;
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
        SET
            theme=:theme,
            page_id=:page_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':theme', $this->theme);
        $stmt->bindParam(':page_id', $this->pageId);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function update()
    {
        $query = "UPDATE " . $this->table_name . " SET theme=:theme WHERE page_id=:page_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':page_id', $this->pageId);
        $stmt->bindParam(':theme', $this->theme);

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
