$(".reportNotFound").append(langReportNotFound);
$(".exportToExcel").append(langExportToExcel);
reports = '';
arrayInput = new Array();
$( document ).ready(function() {		
    buildSideMenu();   
});

function buildSideMenu(){
	url = 'ws/json.php?action=returnReports';
	$('#sideMenu').empty();
	c = 0;
	$("#modalLoading").modal('show');
	$.getJSON(url, function(result){
		reports = result;
		$.each(result, function(i, data){
			$('#sideMenu').append('<li id="l'+c+'"><a href="#" onclick="reportSelection('+c+')">'+data.NAME+'</a></li>');
			c++;
		});
		$("#modalLoading").modal('hide');
	});
}

function reportSelection(reportSelected){	
	arrayInput = new Array();
	$('li').removeClass("active");
	document.getElementById('l'+reportSelected).className+= 'active';
	$('#divReport').css('display','none');
	$('#divInputs').css('display','none');
	$('#divNotFind').css('display','none');
	$('#reportName').text(reports[reportSelected].NAME);
	$('#formInput').remove();
	$('#divInputs').append('<form id="formInput" onSubmit="generateReportInput('+reportSelected+');return false;"></form>');
	url = 'ws/json.php?action=returnReportInputs&reportId='+reports[reportSelected].ID;
	$("#modalLoading").modal('show');
	$.getJSON( url, function(result) {		
		$.each(result, function(i, data){
			$('#divInputs').css('display','block');
			addInput(data.ID, data.EXHIBITION_NAME, data.INP_TYPE, data.NOT_NULL, data.COLUMN_NAME);
			arrayInput.push(data.ID);
		});
		if($.isEmptyObject(result)){
			
			$('#reportName').text(reports[reportSelected].NAME);
			executeSql(reports[reportSelected].SQL_BASE);
		}else{			
			$('#formInput').append('<br><button id="btnReportGenerate" type="button" class="btn btn-primary" onclick="generateReportInput('+reportSelected+');return false;">'+btnGenReport+'</button>');
		}
		$("#modalLoading").modal('hide');
	});			
}

function generateReportInput(reportSelected){
	inputSQL = ' WHERE ';
	first = 0;
	notExecute = false;
	arrayInput.forEach(function(val, index){
		if(first >0){
			inputSQL+= ' AND ';
		}
		if($('#notNull'+val).val() == 0 ||  ($('#notNull'+val).val() == 1 && $('#input'+val).val() != '' && $('#input'+val).val() != null)){
			if($('#input'+val).val() != '' && $('#input'+val).val() != null && $('#type'+val).val() != 3){
				if($('#type'+val).val() == 2){
					inputSQL+= $('#column'+val).val()+'= "'+$('#input'+val).val()+'"';
				}else if($('#type'+val).val() == 4){
					inputSQL+= $('#column'+val).val()+' = '+$('#input'+val).val();
				}else{
					inputSQL+= $('#column'+val).val()+' LIKE "%'+$('#input'+val).val()+'%"';
				}		
				first++;
			}else if($('#type'+val).val() == 3 && $('input[name=input'+val+']:checked').val() != undefined){		
				inputSQL+= $('#column'+val).val()+' = '+ +$('#input'+val).prop('checked');				
				first++;
			}			
		}else{
			alert(alertNotNull.replace("[NAME]", $('#exhibitionName'+val).text()));
			notExecute = true;
			return false;
		}
		
	});
	if(first == 0){
		inputSQL = "";
	}
	if(notExecute == false){
		executeSql(reports[reportSelected].SQL_BASE.replace("[WHERE]", inputSQL));
		return false;
	}
	
}

function addInput(idInput,exhibitionName,type,notNull, colName){
	input = '';
	input +='<label id="exhibitionName'+idInput+'">'+exhibitionName+'</label>';
	input +='<input type="hidden" id="column'+idInput+'" value="'+colName+'">';
	input +='<input type="hidden" id="notNull'+idInput+'" value="'+notNull+'">';
	input +='<input type="hidden" id="type'+idInput+'" value="'+type+'">';
	if(type == 2){
		input +='<input type="text" class="form-control" onkeypress="return event.charCode >= 48 && event.charCode <= 57" OnKeyUp="maskDate(this);" maxlength="10" id="input'+idInput+'">';				
	}else if(type == 3){
		input +='<div id="radioDiv'+idInput+'" name="radioDiv'+idInput+'" class="radio">';
		input +='<label>';
		input +='<input type="radio" id="input'+idInput+'" name="input'+idInput+'" value="1" '+(notNull== 1?'checked':'')+'>';
		input += langYes+'&nbsp&nbsp&nbsp';
		input +='</label>';
		input +='<label>';
		input +='<input type="radio" id="input'+idInput+'" name="input'+idInput+'" value="0">';
		input += langNo;
		input +='</label>';
		input +='</div>';
	}else if(type == 4){
		input +='<input type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57" class="form-control" id="input'+idInput+'" value="">';
	}
	else{
		input +='<input type="text" class="form-control" id="input'+idInput+'" value="">';
	}
	
	$('#formInput').append(input);
}


function executeSql(sql){
	url = 'ws/json.php?action=executeSql&sql='+sql;
	c = 0;
	$('#report').find('thead').find('tr').empty();
	$('#report').find('tbody').empty();	
	$('#divReport').css('display','none');
	$('#divNotFind').css('display','none');
	$("#modalLoading").modal('show');
	$.getJSON(url, function(result){
		if($.isEmptyObject(result)){
			$('#divReport').css('display','none');
			$('#divNotFind').css('display','block');
			$("#modalLoading").modal('hide');			
		}else{
			$.each(result, function(i, data){
				if(c == 0){
					for(var val in Object.getOwnPropertyNames(data)){
						$('#report').find('thead').find('tr').append('<th>'+String(Object.getOwnPropertyNames(data)[val])+'</th>');
					}
				}
				line = '<tr>';
				for(var val in data){				
					line+='<th>'+data[val]+'</th>';
				}
				line+= '</tr>';
				$('#report').find('tbody').append(line);
				
				c++;
			});
			$("#modalLoading").modal('hide');
			$('#divReport').css('display','block');
		}
		
	});
}

function exportExcel(){
	$("#report").excelexportjs({
        containerid: "report"
       , datatype: 'table'
    });
}

function maskDate(inputDate){
    var data = inputDate.value;
    if (data.length == 2){
        data = data + '/';
        inputDate.value = data;
        return true;              
    }
    if (data.length == 5){
        data = data + '/';
        inputDate.value = data;
        return true;
    }
}