var SPARQL_ENDPOINT = 'http://dev-vm.fair-dtls.vm.surfsara.nl:8891/sparql?query='

var TEMPLATE_QUERIES = {
        1 : {
		text : 'Get number of biosamples from donors with a specific phenotype', 
                variables: ['phenotype'], 
                query : readFile('sparqlQueries/template1.sparql', 'text')
		
            },
        2 : {
		text : 'Get number of persons with a specific phenotype', 
                variables: ['phenotype'], 
                query : readFile('sparqlQueries/template7.sparql', 'text')
		
            },    
	3 : {
		text : 'Get number of biosamples from donors with a specific disease', 
                variables: ['disease'], 
                query : readFile('sparqlQueries/template2.sparql', 'text')
		
            },
        4 : {
		text : 'Get number of biosamples from donors with a specific phenotype and from a specific region', 
                variables: ['phenotype', 'region'], 
                query : readFile('sparqlQueries/template3.sparql', 'text')
		
            },    
        
        5 : {
		text : 'Get biosamples from donors with a specific phenotype and specific sampletypes', 
                variables: ['phenotype', 'sampleType'], 
                query : readFile('sparqlQueries/template9.sparql', 'text')
		
            },    
	6 : {
		text : 'Get biosamples from donors with a specific disease and a specific karyotype', 
                variables: ['disease', 'karyotype'], 
                query : readFile('sparqlQueries/template4.sparql', 'text')
            }, 
	7 : {
                text : 'Get biosamples from donors with a specific disease, a specific karyotype and specific sampletypes', 
                variables: ['disease', 'sampleType', 'karyotype'], 
                query : readFile('sparqlQueries/template5.sparql', 'text')
            },
	8 : {
                text : 'Get biosamples from donors with a specific disease, a specific karyotype, a specific breakpoint localization and a specific sampletype', 
                variables: ['disease', 'sampleType', 'karyotype', 'breakpoint'], 
                query : readFile('sparqlQueries/template6.sparql', 'text')
	},
        9 : {
		text : 'Get diseases sharing phenotypes', 
                variables: ['disease'], 
                query : readFile('sparqlQueries/template8.sparql', 'text')
		
            },
        10 : {
		text : 'Get biosamples from donors sharing phenotypes', 
                variables: ['disease'], 
                query : readFile('sparqlQueries/template10.sparql', 'text')
		
            }    
    };

var VARIABLE_QUERIES = {
        phenotype: readFile('sparqlQueries/getPhenotypes.sparql', 'text'),
	disease: readFile('sparqlQueries/getDiseases.sparql', 'text'),
	sampleType: readFile('sparqlQueries/getSampleTypes.sparql', 'text'),
        region: readFile('sparqlQueries/getRegions.sparql', 'text'),
        karyotype: readFile('sparqlQueries/getKaryotypes.sparql', 'text'),
	breakpoint: readFile('sparqlQueries/getBreakpoints.sparql', 'text')

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


