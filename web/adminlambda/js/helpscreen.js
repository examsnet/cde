$(function () {
    $(document).on('input', '#helpTextSrc', function (event) {
        let destval = getFormulaText($(this).val());
        $('#helpPreview').html(destval);
    });



    $(document).on('click', '#createtable', function (event) {
        stopscroll(event)
        buildTable();

    });

    $(document).on('click', '#formatcode', function (event) {
        stopscroll(event);
        const content = $('#helpTextSrc').val();
        const formatted = html_beautify(content, {
            indent_size: 4,
            space_in_empty_paren: true
        });
        $('#helpTextSrc').val(formatted);
        $('#helpTextSrc').trigger('input');
    });

    $(document).on('click', '#createtabletilde', function (event) {
        stopscroll(event)
        createTableFromTildeSeparatedText(event, false);

    });

    $(document).on('click', '#createtabletildeh', function (event) {
        stopscroll(event)
        createTableFromTildeSeparatedText(event, true);

    });


    $(document).on('click', '#applytex', function (event) {
        stopscroll(event);
        replaceSelectedText(latex_to_js(getselectedText()));
    });


    $(document).on('click', '#cleantable', function (event) {
        stopscroll(event);
        cleanTableStyles(event);
    });


    $(document).on('click', '#asciitable', function (event) {
        stopscroll(event);
        asciitabletoTable(event);
    });

    $(document).on('click', '#asciitable2', function (event) {
        stopscroll(event);
        asciitabletoTableHardcoded(event);
    });


    $(document).on('click', '#markdowntable', function (event) {
        stopscroll(event);
        markDownToHTMLTables(event);
    });

    $(document).on('click', '#applytextest', function (event) {
        stopscroll(event);
        replaceSelectedText(latex_to_js_test(getselectedText()));
    });





});

function buildTable() {
    bootbox.confirm(
        `<form id='infos' action=''>
            <div>No Of Rows:
            <input type='text' name='rows' value='3' class='form-control form-control-sm' /></div>
            <div>No Of Columns: 
            <input type='text' name='columns' value='3' class='form-control form-control-sm' /></div>
            <div class="d-flex" style="float:left;">Header? &emsp;
            <input type='checkbox' name='header' class='form-control form-control-sm' /></div>
        </form>`,
        function (result) {
            if (result) {
                const rows = parseInt($('#infos input[name="rows"]').val(), 10);
                const columns = parseInt($('#infos input[name="columns"]').val(), 10);
                const hasHeader = $('#infos input[name="header"]').is(':checked');

                let table = '<div class="hscrollenable"><table class="table-bordered">\n';

                if (hasHeader) {
                    table += '<tr>\n';
                    for (let k = 0; k < columns; k++) {
                        table += '<th>&nbsp;</th>\n';
                    }
                    table += '</tr>\n';
                }

                for (let i = 0; i < rows; i++) {
                    table += '<tr>\n';
                    for (let j = 0; j < columns; j++) {
                        table += '<td>&nbsp;</td>\n';
                    }
                    table += '</tr>\n';
                }

                table += '</table></div>';
                $('#helpTextSrc').val(table);
                $('#helpTextSrc').trigger('input');
            }
        }
    );
}



function createTableFromTildeSeparatedText(event, hasHeader) {
    let output = '';
    const selectedText = getselectedText();

    if (selectedText) {
        const data = selectedText.split("~");
        if (data.length > 0) {
            output += '<table class="table-bordered">';
            let columnCount = parseInt(data[0].trim(), 10);

            if (isNaN(columnCount) || columnCount <= 0) {
                columnCount = 1;
            }

            const rowCount = Math.ceil((data.length - 1) / columnCount);
            let index = 1;

            for (let i = 0; i < rowCount; i++) {
                output += '<tr>';
                for (let j = 0; j < columnCount; j++) {
                    if (index < data.length) {
                        if (hasHeader && i === 0) {
                            output += `<th>${data[index++]}</th>`;
                        } else {
                            output += `<td>${data[index++]}</td>`;
                        }
                    } else {
                        output += '<td>&nbsp;</td>';
                    }
                }
                output += '</tr>';
            }
            output += '</table>';
            replaceSelectedText(output);
            $('#helpTextSrc').trigger('input');
        }
    }
}



function asciitabletoTable(vent) {

    //var temp = $('#fbuilder').val();
    var temp = getselectedText();
    var tt = temp.replace(/\"/g, '');
    var ttt = tt.replace(/\]([^\]]*)$/, ''); // last occurance of ]
    var tttt = ttt.replace(/\[/, '');

    var splits = tttt.split('],[');

    var table = '<table class="table-bordered"><tbody>'
    for (var i = 0; i < splits.length; i++) {
        table += '<tr>'
        var subsplits = splits[i].split(',');
        for (var j = 0; j < subsplits.length; j++) {
            table += '<td>' + subsplits[j] + '</td>'
        }
        table += '</tr>'
    }
    table += '</tbody></table>'
    //$('#fbuilder').val('<div class="hscrollenable">'+table+'</div>');
    replaceSelectedText('<div class="hscrollenable">' + table + '</div>');
}


function asciitabletoTableHardcoded(vent) {

    //var temp = $('#fbuilder').val();
    var temp = getselectedText();
    var tt = temp.replace(/\"/g, '');
    var ttt = tt.replace(/\]([^\]]*)$/, ''); // last occurance of ]
    var tttt = ttt.replace(/\[/, '');

    var splits = tttt.split('],[');
    var alphabets = ["(a)", "(b)", "(c)", "(d)", "(e)", "(f)"]
    var table = '<table class="table-bordered"><tbody>'
    for (var i = 0; i < splits.length; i++) {
        if (i == 0) {
            table += '<tr><th>&nbsp;</th>'
        } else {
            table += '<tr><td>' + alphabets[i - 1] + '</td>'
        }
        var subsplits = splits[i].split(',');
        for (var j = 0; j < subsplits.length; j++) {
            if (i == 0) {
                table += '<th>' + subsplits[j] + '</th>'
            } else {
                table += '<td>' + subsplits[j] + '</td>'
            }
        }
        table += '</tr>'
    }
    table += '</tbody></table>'
    // $('#fbuilder').val('<div class="hscrollenable">'+table+'</div>');
    replaceSelectedText('<div class="hscrollenable">' + table + '</div>');

}


function markDownToHTMLTables(vent) {

    // var markdown = $('#fbuilder').val();
    var markdown = getselectedText();

    var markedlines = markdown.split('\n');

    var table = "<table class='table-bordered'><tbody>"
    var firstRowProcessed = false;

    if (markedlines) {
        for (var i = 0; i < markedlines.length; i++) {
            var row = markedlines[i];

            // Skip empty rows
            if (!row || row.trim() === "") continue;

            // Check for separator row (e.g. | :--- | or |---|) and skip it
            if (row.indexOf(":---") !== -1 || (row.indexOf("---") !== -1 && row.indexOf("|") !== -1)) {
                continue;
            }

            var isHeader = false;
            // If this is the first content row we are processing, check if the NEXT row is a separator
            if (!firstRowProcessed) {
                for (var k = i + 1; k < markedlines.length; k++) {
                    var nextRow = markedlines[k];
                    if (!nextRow || nextRow.trim() === "") continue; // Skip empty lines looking for next row

                    // If next row is separator, then CURRENT row is a header
                    if (nextRow.indexOf(":---") !== -1 || (nextRow.indexOf("---") !== -1 && nextRow.indexOf("|") !== -1)) {
                        isHeader = true;
                    }
                    break; // We found the next row, stop looking
                }
                firstRowProcessed = true;
            }

            table += '<tr>'
            var rowvals = row.split('|')
            if (rowvals) {
                // Remove potential empty first/last elements from split if pipe is at start/end
                if (rowvals.length > 0 && rowvals[0].trim() === "") rowvals.shift();
                if (rowvals.length > 0 && rowvals[rowvals.length - 1].trim() === "") rowvals.pop();

                for (var j = 0; j < rowvals.length; j++) {
                    var val = rowvals[j];

                    var colspan = 1;
                    while (j + colspan < rowvals.length && rowvals[j + colspan].trim() === "") {
                        colspan++;
                    }

                    var cellContent = val.trim();
                    cellContent = cellContent.replace(/\" \"/g, "");

                    var tagName = isHeader ? 'th' : 'td';

                    var cellHtml = '<' + tagName;
                    if (colspan > 1) {
                        cellHtml += ' colspan="' + colspan + '"';
                    }
                    cellHtml += '>';

                    if (cellContent.length > 0) {
                        console.log("MarkDownOperations");
                        cellHtml += performLatexOperations(cellContent);
                    } else {
                        cellHtml += "&nbsp;";
                    }

                    cellHtml += '</' + tagName + '>';
                    table += cellHtml;

                    // Skip the cells we just merged
                    j += (colspan - 1);
                }
            }
            table += '</tr>'
        }
    }
    table += '</tbody></table>';

    // $('#fbuilder').val('<div class="hscrollenable">'+table+'</div>');
    replaceSelectedText('<div class="hscrollenable">' + table + '</div>');
}

function cleanTableStyles(vent) {
    // var temptable = '<div>'+$('#fbuilder').val();+'</div>';
    var temptable = '<div>' + getselectedText() + '</div>';
    console.log('test');
    var domtable = $(temptable);
    $(domtable).find('*').removeAttr("style").removeAttr('id');
    $(domtable).find('table').addClass('table table-bordered');
    var tbhead = $(domtable).find('tr:first-child');
    var nhead = '';
    $(tbhead).find('td').each(function (i, v) { nhead += '<th>' + $(v).html() + '</th>' });
    $(domtable).find('tr:first-child').html(nhead);
    // $('#fbuilder').val('<div class="hscrollenable">'+$(domtable).html()+'</div>');
    replaceSelectedText('<div class="hscrollenable">' + $(domtable).html() + '</div>');
}