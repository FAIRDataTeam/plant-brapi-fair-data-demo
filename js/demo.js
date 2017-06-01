$(document).ready(function () {
    $("#step2").addClass('hidden');
    $("#step3").addClass('hidden');
    $("#errorPanel").addClass('hidden');
    $("#infoPanel").addClass('hidden');
    $("#noResultPanel").addClass('hidden');

    /* load template queries */
    var template = document.getElementById('template');
    var templQuerySize = 0;

    for (var key in TEMPLATE_QUERIES) {
//        template.options[template.options.length] = new Option(
//                TEMPLATE_QUERIES[key].text, key);

        var text = TEMPLATE_QUERIES[key].text;
        var keyIndex = parseInt(key) - 1;
        template.options[template.options.length] = new Option(text, key);
        console.log("Template Text" + text);
        templQuerySize += 1;

    }
    template.setAttribute("size", templQuerySize);
});

document.getElementById("template").onchange = function () {

    $("#species").addClass('hidden');
    $("#phenotype").addClass('hidden');
    $("#errorPanel").addClass('hidden');
    $('#results_table').empty();
    $("#noResultPanel").addClass('hidden');

    var selected = $("#template").val();
    console.log(TEMPLATE_QUERIES[selected]);

    if (TEMPLATE_QUERIES[selected].variables.indexOf('species') > -1) {
        $("#species").removeClass('hidden');
    }
    if (TEMPLATE_QUERIES[selected].variables.indexOf('phenotype') > -1) {
        $("#phenotype").removeClass('hidden');
    }
    // Fill step2  	
    TEMPLATE_QUERIES[selected].variables.forEach(function (entry) {

        var service = encodeURI(SPARQL_ENDPOINT + VARIABLE_QUERIES[entry]
                + '&format=json').replace(/#/g, "%23");

        $.ajax({url: service, dataType: 'jsonp', async: false,
            success: function (result) {
                var inputOption = document.getElementById(entry + 'Option');
                var dataList = document.getElementById(entry + 'Datalist');
                $(inputOption).empty();
                $(inputOption).val('');
                if (dataList != null) {
                    $(dataList).empty();
                }
                result.results.bindings.forEach(function (v) {
                    var option = document.createElement('option');
                    option.setAttribute('width', '70%');
                    if (v.url !== undefined) {
                        //option.text = v.url.value;
                        option.value = v.value.value;
                        option.setAttribute('data-input-value', v.url.value);
                    } else {
                        //option.text = v.value.value;
                        option.value = v.value.value;
                        option.setAttribute('data-input-value', v.value.value);
                    }
                    if (dataList !== null) {
                        dataList.appendChild(option);
                    }

                });
            },
            error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });
    });

    $("#step2").removeClass('hidden');
    $("#step3").addClass('hidden');
}

document.getElementById("process").onclick = function () {
    $("#errorPanel").addClass('hidden');
    $("#infoPanel").addClass('hidden');
    $("#step3").addClass('hidden');
    $("#noResultPanel").addClass('hidden');
    var selected = $("#template").val();
    var query = TEMPLATE_QUERIES[selected].query
    var isValueMissing = false;

    //Replace variable values in the query 	
    TEMPLATE_QUERIES[selected].variables.forEach(function (entry) {
        var selectedValue = null;
        var selectedOption = $('#' + (entry + 'Option'));
        //$('#' + (entry+'Option')).css( "border", "3px");
        if (selectedOption.val() === '') {
            var errorMessage = "<strong>Input error : </strong>Choose a value for "
            errorMessage = errorMessage + "<strong>" + entry + "</strong> ";
            isValueMissing = true;
            $("#errorPanel").html(errorMessage);
            $("#errorPanel").removeClass('hidden');
            //$('#' + (entry+'Option')).css( "border", "3px solid red" );
            return false;
        } else {

            $('#' + (entry + 'Datalist') + ' option').each(function (index, value) {
                if ($(value).val() === selectedOption.val()) {
                    selectedValue = $(value).attr('data-input-value');
                    console.log('selected option = [' + selectedValue + "]");
                    return false;
                }
            });

        }
        query = query.replace('#' + entry + '#', selectedValue);
    });

    if (!isValueMissing) {
        $('#process').buttonLoader('start');
        console.log("SPARQL query \n" + query);
        var service = encodeURI(SPARQL_ENDPOINT + query + '&format=json').
                replace(/#/g, '%23');
        $("#infoPanel").html('<strong>Info :</strong> Some queries take more time to process, thanks for being patient');
        //$("#infoPanel").fadeIn(8000).removeClass('hidden');
        $.ajax({url: service, dataType: 'jsonp', success: function (result) {
                console.log(result);
                fillTable(result)
            },
            error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });
    }
}

function fillTable(result) {
    $("#infoPanel").addClass('hidden');
    $("#noResultPanel").addClass('hidden');
    $('#process').buttonLoader('stop');
    $("#step3").removeClass('hidden');
    $("#results_table").removeClass('hidden');
    var hasResult = false;
    var table = '<thead><tr>'
    result.head.vars.forEach(function (entry) {
        if (entry.indexOf("URI") === -1) {
            table += '<th>' + entry + '</th>'
        }

    });

    table += '</tr></thead><tbody>'
    result.results.bindings.forEach(function (value) {
        table += '<tr>'
        result.head.vars.forEach(function (head) {
            if (head.indexOf("URI") === -1 && value[head] !== undefined) {
                var resource = value[head + "URI"];
                var displayName = value[head].value;
                hasResult = true;
                if (resource !== undefined) {
                    var resourceURI = resource.value;
                    table += '<td><a target="_blank" href="' + resourceURI
                            + '" resource="' + resourceURI + '"> <span property="rdfs:label">'
                            + displayName + '</span></a></td>';
                } else {
                    table += '<td><span>' + displayName + '</span></td>';
                }
            }
        });
        table += '</tr>';
    });
    table += '</tr></tbody>'
    $("#pagingContainer").empty();
    $('#results_table').html(table);
    $('#results_table').simplePagination({
        perPage: 10,
        previousButtonText: 'Prev',
        nextButtonText: 'Next',
        previousButtonClass: "btn btn-primary btn-xs",
        nextButtonClass: "btn btn-primary btn-xs"
    });

    if (!hasResult) {
        $("#noResultPanel").removeClass('hidden');
        $("#results_table").addClass('hidden');
    }
}

function getRDFaTriple(element, property, resourceType, resource, content, closeElement) {
    var triple = "<" + element + " ";

    if (property !== undefined && property !== '' && property !== null) {
        triple += 'property="' + property + '" ';
    }
    if (resourceType !== undefined && resourceType !== '' && resourceType !== null) {
        triple += 'typeof="' + resourceType + '" ';
    }
    if (resource !== undefined && resource !== '' && resource !== null) {
        triple += 'resource="' + resource + '" ';
    }
    if (content !== undefined && content !== '' && content !== null) {
        triple += 'content="' + content + '" ';
    }
    triple += ">";
    if (Boolean(closeElement)) {
        triple += "</" + element + ">";
    }
    return triple;

}
