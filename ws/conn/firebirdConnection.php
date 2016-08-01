<?php
class connect{
	private $SERVER="";
	private $USER="";
	private $PASSWORD="";
	private $connection;
	public $error;
	function __construct(){
		
	}

	function connect(){
		$gconnectfirebird = ibase_connect ($this->SERVER, $this->USER, $this->PASSWORD, 'ISO8859_1', '0', '1') ;
		$this->connection = $gconnectfirebird;
		if(!$this->connection){
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
		$search = ibase_query($this->connection, $sql);
		$arrReturn = array();
		$i = 0;
		while ($row = ibase_fetch_assoc($search)) {
			$arrReturn[$i] = $row;
			$i++;
		}
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
		$set = ibase_query($this->connection,$sql);
		if(!ibase_errmsg()){
			ibase_free_result($pes);
			return true;
		}
		$this->error = ibase_errmsg();
		//var_dump($this->erro);
		
		return false;
		
	}
}

?>