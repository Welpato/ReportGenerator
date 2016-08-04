$(".name").append(langName);
$(".sqlBase").append(langSqlBase);
$(".inputUser").append(langInputUser);
$(".save").append(langSave);
$(".help").append(langHelp);
$(".helpText").append(langHelpText);
$(".addNew").append(langAddNew);

reports = '';
ic = 0;
onlyGraph = false;
inputControll = new Array();
$( document ).ready(function() {
	$('#reportList').DataTable( {
		language :{
			"sEmptyTable": langReportNotFound,
		    "sInfo": "",
		    "sInfoEmpty": "",
		    "sInfoFiltered": langFilter,
		    "sInfoPostFix": "",
		    "sInfoThousands": ".",
		    "sLoadingRecords": langLoading,
		    "sProcessing": langProcessing,
		    "sZeroRecords": langReportNotFound,
		    "sSearch": langSearch,
		},
		bAutoWidth : true,
		bLengthChange  : false,				
		responsive: true,
		fixedHeader: true,
		paging: false,
			})
    buildSideMenu();
});

function buildSideMenu(){
	var t = $('#reportList').DataTable();
	url = 'ws/json.php?action=returnReports&onlyActive=0';
	t.clear().draw();
	c = 0;
	$("#modalLoading").modal('show');	
	$.getJSON(url, function(result){
		reports = result;
		$('#reportList tbody').empty();
		$.each(result, function(i, data){
			t.row.add([
			           '<li id="l'+c+'"><a href="#" onclick="reportSelection('+c+')">'+data.NAME+'</a></li>'
			           ]).draw(true);	
			c++;
		});
		$("#modalLoading").modal('hide');
	});
	
}

function addReport(){
	newSql = true;
	url = 'ws/json.php?action=insertUpdateReport&reportName='+$('#reportName').val()+'&sqlBase='+$('#sqlBase').val()+'&radioActive='+$('input[name=radioActive]:checked', '#formReport').val();	
	if($('#idReport').val() != ''){
		newSql = false;
		url += '&reportId='+$('#idReport').val();
	}
	$("#modalLoading").modal('show');
	$.getJSON( url, function( data ) {
	  if(data['0']['RESP'] > 0){
		  if(newSql){
			  $('#idReport').val(data['0']['RESP']);
		  }	
		  if($(inputControll).size() > 0){
			  inputControll.forEach(insertInput);
		  }
		  
		  buildSideMenu();
		  alert(alertSuccess);
	  }else{
		  alert(alertError);
	  }
	  $("#modalLoading").modal('hide');
	});
}

function reportSelection(reportSelected){
	$('li').removeClass("active");
	onlyGraph = true;
	inputControll.forEach(removeInput);
	onlyGraph = false;
	inputControll = new Array();
	ic = 0;
	if(reportSelected != 'NEW'){
		document.getElementById('l'+reportSelected).className+= 'active';		
		$('#idReport').val(reports[reportSelected].ID);		
		$('#reportName').val(reports[reportSelected].NAME);
		$('#sqlBase').val(reports[reportSelected].SQL_BASE);
		if(reports[reportSelected].ACTIVE == 1){
			$('input:radio[name=radioActive]').filter('[value=1]').prop('checked', true);
		}else{
			$('input:radio[name=radioActive]').filter('[value=0]').prop('checked', true);	
		}
		reportInputs(reports[reportSelected].ID);
	}else{
		document.getElementById('lNew').className+= 'active';
		$('#idReport').val('');
		$('#reportName').val('');
		$('#sqlBase').val('');
		$('input:radio[name=radioActive]').filter('[value=1]').prop('checked', true);
	}
}

function reportInputs(reportId){
	url = 'ws/json.php?action=returnReportInputs&reportId='+reportId;
	$("#modalLoading").modal('show');
	$.getJSON( url, function(result) {
		$.each(result, function(i, data){
			addInput(data.ID, data.EXHIBITION_NAME, data.COLUMN_NAME, data.NOT_NULL, data.INP_TYPE);			
		});
		$("#modalLoading").modal('hide');
	});
}

function addInput(idInput = "", exhibitionName = "", inputName = "", inputNotNull = 1, inputType = 1){
	ic++;
	inputControll.push(ic);
	input = '<div id="div'+ic+'"class="form-group form-inline">';
	input +='<a href="#" onclick="removeInput('+ic+','+ic+');return false;"><img src="img/remove.png" height="24" width="24"></a>  ';
	input +='<input type="hidden" id="idInput'+ic+'" value="'+idInput+'">'; 
	input +='<label for="inputType'+ic+'">'+langType+'</label>';
	input +='<select id="inputType'+ic+'" class="form-control"><option value="1" '+(inputType == 1?'selected':'')+'>'+langText+'</option><option value="2" '+(inputType == 2?'selected':'')+'>'+langDate+'</option><option value="3" '+(inputType == 3?'selected':'')+'>'+langBoolean+'</option><option value="4" '+(inputType == 4?'selected':'')+'>'+langInteger+'</option></select>';
	input +='<label for="exhibitionName">'+langExhibitionText+'</label>';
	input +='<input type="text" class="form-control" id="exhibitionName'+ic+'" maxlenght="30" value="'+exhibitionName+'">';
	input +='<label for="inputName">'+langColumnName+'</label>';
	input +='<input type="text" class="form-control" id="inputName'+ic+'"  maxlenght="50" value="'+inputName+'">';
	input +='<label for="divActive">'+langNotNull+'</label>';
	input +='<label>';
	input +='<input type="radio" name="inputNotNull'+ic+'" id="inputNotNull'+ic+'" value="1" '+(inputNotNull == 1?'checked':'')+'>';
	input +=langYes;
	input +='</label>';
	input +='<label>';
	input +='<input type="radio" name="inputNotNull'+ic+'" id="inputNotNull'+ic+'" value="0" '+(inputNotNull == 0?'checked':'')+'>';
	input +=langNo;
	input +='</label>';					
	input +='</div>';
	$('#divInput').append(input);
}

function removeInput(inputRemove,index){
	if(onlyGraph == false){
		var r = confirm(alertRemoveInput);
		if (r == true) {		
			url = 'ws/json.php?action=deleteInput&inputId='+$('#idInput'+inputRemove).val();
			$.getJSON( url, function(data) {
			});		
		}
	}
	if(r == true || onlyGraph == true){
		inputControll = $.grep(inputControll, function(val, index) {
			return val != inputRemove;
		});
		$('#div'+inputRemove).remove();
	}
	
}

function insertInput(inputAdd,index){
	newSql = true;
	url = 'ws/json.php?action=insertUpdateInput&reportId='+$('#idReport').val()+'&type='+$('#inputType'+inputAdd).val()+'&exhibitionName='+$('#exhibitionName'+inputAdd).val()+'&name='+$('#inputName'+inputAdd).val()+'&notNull='+$('input[name=inputNotNull'+inputAdd+']:checked', '#formReport').val();
	console.log(url);
	if($('#idInput'+inputAdd).val() != ''){
		newSql = false;
		url += '&inputId='+$('#idInput'+inputAdd).val();
	}
	$("#modalLoading").modal('show');
	$.getJSON( url, function(data) {
		if(data['0']['RESP'] > 0){
			if(newSql){				  
				$('#idInput'+inputAdd).val(data['0']['RESP']);
			}	
		}else{
			alert(alertErrorInput);
		}
		$("#modalLoading").modal('hide');
	});
}


