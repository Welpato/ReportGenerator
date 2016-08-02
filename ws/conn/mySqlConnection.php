<?php
class connect{
	private $SERVER="";
	private $USER="";
	private $PASSWORD="";
	private $DBNAME="";
	private $connection;
	public $error;
	function __construct(){
		
	}

	function connect(){
		$this->connection = new mysqli($this->SERVER, $this->USER, $this->PASSWORD,$this->DBNAME) ;
		if($this->connection->connect_error){
			$this->error = "Error on DB connect!";
		}
	}
	
	function executeSearch($sql){
		$this->connect();
		
		if(isset($this->error)){
			return false;
		}
		if(!isset($sql) || $sql == ''){
			$this->erro = "SQL command not informed!";
			return false;
		}
		$search = $this->connection->query($sql);
		$arrReturn = array();
		$i = 0;
		if($search->num_rows > 0){
			while ($row = $search->fetch_assoc()) {
				$arrReturn[$i] = $row;
				$i++;
			}
			
		}
		$this->connection->close();
		return $arrReturn;
	}
	
	function executeCommand($sql){
		$this->connect();
		if(isset($this->erro)){			
			return false;
		}
		if(!isset($sql) || $sql == ''){
			$this->error = "SQL command not informed!";
			return false;
		}
		$resp = $this->connection->query($sql);
		$this->connection->close();
		return $resp;
		
		return false;
		
	}
}

?>
