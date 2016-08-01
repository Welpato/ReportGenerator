<?php
require_once 'conn/connection.php';
class dbController{
	private $con;

	function __construct(){
		$this->con = new connect();
	}
	
	function searchReport($reportId = '', $onlyActives = true){
		$sql = "SELECT ID, NAME, SQL_BASE, ACTIVE
				FROM REPORT ";
		$cond = "WHERE ";
		if($onlyActives){
			$sql.= $cond."ACTIVE = 1";
			$cond = " AND ";
		}
		if($reportId != ""){
			$sql.= $cond."ID = ".$reportId;
		}
		$r = $this->con->executeSearch($sql);
		if(!is_array($r)){
			return false;
		}else{
			return $r;
		}
	}
	
	function returnReportInputs($reportId){
		$sql = "SELECT ID, REPORT_ID, INP_TYPE, EXHIBITION_NAME, COLUMN_NAME, NOT_NULL
				FROM INPUTS
				WHERE REPORT_ID = ".$reportId;
		$r = $this->con->executeSearch($sql);
		if(!is_array($r)){
			return false;
		}else{
			return $r;
		}
	}
	
	function insertReport($reportName, $sqlBase, $active){
		$sql = "INSERT INTO REPORT(ID,NAME, SQL_BASE, ACTIVE)
				VALUES((SELECT MAX(ID)+1 FROM REPORT),'$reportName', '$sqlBase', $active)";
		$r = $this->con->executeCommand($sql);
		if($r){
			return $this->con->executeSearch('SELECT MAX(ID) AS RESP FROM REPORT');
		}
		return array("0"=>array("RESP"=>$r));
	}
	
	function insertInput($reportId, $type, $exhibitionName, $name, $notNull){
		$sql = "INSERT INTO INPUTS(ID, REPORT_ID, INP_TYPE, EXHIBITION_NAME, COLUMN_NAME, NOT_NULL)
				VALUES((SELECT MAX(CAMP_CODIGO)+1 FROM TS_REL_CAMPOS), $reportId, $type, '$exhibitionName', '$name', $notNull)";
		$r = $this->con->executeCommand($sql);
		if($r){
			return $this->con->executeSearch('SELECT MAX(ID) AS RESP FROM INPUTS');
		}
		return array("0"=>array("RESP"=>$r));
	}
	
	function updateReport($reportId, $name, $sqlBase,$active){
		$sql = "UPDATE REPORT SET
				NAME = '".$name."',
				SQL_BASE = '".$sqlBase."',
				ACTIVE = ".$active."
				WHERE ID = ".$reportId;
		$r = $this->con->executeCommand($sql);
		return array("0"=>array("RESP"=>$r));
	}
	
	function updateInput($inputId, $reportId, $type, $exhibitionName, $name, $notNull){
		$sql = "UPDATE INPUTS SET
				INP_TYPE = ".$type.",
				EXHIBITION_NAME = '".$exhibitionName."',
				COLUMN_NAME = '".$name."',
				REPORT_ID = ".$reportId.",		
				NOT_NULL = ".$notNull."
				WHERE ID = ".$inputId;
		$r = $this->con->executeCommand($sql);
		return array("0"=>array("RESP"=>$r));
	}
	
	function deleteInput($inputId){
		$sql = "DELETE FROM INPUTS WHERE ID = ".$inputId;
		$r = $this->con->executeCommand($sql);
	}
	
	function executeSql($sql){
		$r = $this->con->executeSearch($sql);
		if(!is_array($r)){
			return false;
		}else{
			array_walk_recursive($r, function(&$value, $key) {
				if (is_string($value)) {
					$value = utf8_encode($value);
				}
			});
			return $r;
		}
	}
	
}