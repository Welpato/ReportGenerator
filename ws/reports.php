<?php
require_once 'dbController.php';
class negRelatorio{
	private $dbController;
	
	function __construct(){
		$this->dbController = new dbController();
	}	
	
	function returnReports($reportId = '', $onlyActives = true){
		return $this->dbController->searchReport($reportId, $onlyActives);
	}
	
	function returnInputs($reportId = '', $onlyActives = true){
		return $this->dbController->returnReportInputs($reportId, $onlyActives);
	}
	
	function insertUpdateReport($name, $sqlBase, $active,$reportId=""){
		if($reportId != ""){
			return $this->dbController->updateReport($reportId, $name, $sqlBase, $active);
		}else{
			return $this->dbController->insertReport($name, $sqlBase, $active);
		}
	}
	
	function insertUpdateInput($reportId, $type, $exhibitionName, $name, $notNull, $inputId=""){
		if($inputId != ""){
			return $this->dbController->updateInput($inputId, $reportId, $type, $exhibitionName, $name, $notNull);
		}else{
			return $this->dbController->insertInput($reportId, $type, $exhibitionName, $name, $notNull);
		}
	}
	
	function deleteInput($inputId){
		return $this->dbController->deleteInput($inputId);
	}
	
	function returnReportInputs($reportId){
		return $this->dbController->returnReportInputs($reportId);
	}
	
	function executeSql($sql){
		return $this->dbController->executeSql($sql);
	}
	
}