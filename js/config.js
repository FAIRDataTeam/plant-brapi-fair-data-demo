var SPARQL_ENDPOINT = 'http://localhost:8890/sparql?query='

var TEMPLATE_QUERIES = {
        1 : {
		text : 'Give me number of studies related to particular species', 
                variables: ['species'], 
                query : readFile('sparqlQueries/template3.sparql', 'text')
		
            },
        2 : {
		text : 'Give me studies related to particular species', 
                variables: ['species'], 
                query : readFile('sparqlQueries/template1.sparql', 'text')
		
            },
        3 : {
		text : 'Give me studies related to  particular phenotype and particular species', 
                variables: ['species', 'phenotype'], 
                query : readFile('sparqlQueries/template2.sparql', 'text')
		
            }   
    };

var VARIABLE_QUERIES = {
        phenotype: readFile('sparqlQueries/getPhenotypes.sparql', 'text'),
	species: readFile('sparqlQueries/getSpecies.sparql', 'text')

}

function readFile(url, dataType) {
    var content = null;    
    $.ajax({            
        url: url,            
        async: false,   
        cache: false,
        dataType: dataType,
        success: function(response) {   
            content = response;  
            console.log("Content of the file < " + url +"> is read successful")
        },
        error: function(xhr){
            var errorMsg = ("An error reading file : " + xhr.status + " " + 
                    xhr.statusText);
            alert(errorMsg);
            console.log(errorMsg)
        }
    });       
    return content;
}


