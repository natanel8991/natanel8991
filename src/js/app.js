import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {ParsedCodeHandler} from './code-analyzer';

let table=null;
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        if(table!=null)
            table.remove();
        let codeToParse
            = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        //console.log("22222");
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let result=ParsedCodeHandler(parsedCode);
        table=tableCreate(result);



    });
});

function CreateFirstRowOFTable(tr){

    var td = tr.insertCell();
    td.appendChild(document.createTextNode('line'));
    td.style.border = '1px solid black';
    td = tr.insertCell();
    td.appendChild(document.createTextNode('type'));
    td.style.border = '1px solid black';
    td = tr.insertCell();
    td.appendChild(document.createTextNode('name'));
    td.style.border = '1px solid black';
    td = tr.insertCell();
    td.appendChild(document.createTextNode('conditiion'));
    td.style.border = '1px solid black';
    td = tr.insertCell();
    td.appendChild(document.createTextNode('value'));
    td.style.border = '1px solid black';
}

function tableCreate(array){
    var body = document.body,
        tbl  = document.createElement('table');
    tbl.style.width  = '200px';
    tbl.style.border = '1px solid black';
    var tr = tbl.insertRow();
    CreateFirstRowOFTable(tr);

    for(var i = 0; i < array.length; i++){
        tr = tbl.insertRow();
        for(var j=0;j<array[i].length;j++) {
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(array[i][j]));
            td.style.border = '1px solid black';
        }

    }
    body.appendChild(tbl);
    return tbl;
}


