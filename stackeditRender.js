// Mermaid initialization
var mermaidConfig = {
    startOnLoad:true
};
mermaid.initialize(mermaidConfig);

var articleMarkdown = document.getElementById('articleMarkdown');
var articleHTML = document.getElementById('articleHTML');
var stackedit = new Stackedit();
var fileName = "randomfilename";

stackedit.openFile({
    name: fileName,
    content: {
      text: "Type here...."
    }
});

stackedit.on('fileChange', (file) => {
    articleMarkdown.textContent = file.content.text;
    articleHTML.innerHTML = file.content.html;
});

stackedit.on('close', () => {
    mermaidRender();
    katexRender();                
});


// Find, parse and render Mermaid code
function mermaidRender(){
    var mermaidElements = articleHTML.getElementsByClassName("language-mermaid");
    var mermaidElementsArrLen = mermaidElements.length;

    if (mermaidElementsArrLen > 0){
        for(var i = mermaidElementsArrLen-1 ; i >= 0; i--){
            var currElement = mermaidElements[i];

            /* Using 'innerHTML' instead of 'textContent' will parse the
               contents of an element as HTML and hence will include HTML escaping.
               If Mermaid is invoked on HTML escaped string it will throw 'parseError'.
               Therefore, use 'textContent' to get unescaped content. */
            var graphDefinition = currElement.textContent;

            try{
                // Check if mermaid syntax is correct. If yes, then render.
                if(mermaid.parse(graphDefinition) === undefined){
                    var insertSvg = function(svgCode, bindFunctions){
                        var preTag = currElement.parentElement;
                        preTag.insertAdjacentHTML('beforebegin', svgCode);
                        preTag.remove();
                    };
                    var graph = mermaid.render(randStrGenerator(5), graphDefinition, insertSvg);
                }
            }
            catch(err){
                // Catch mermaid 'parseError'
                alert(err.str, '\n', err.hash);
            }
        }
    }
}


// Find, parse and render KaTeX code
function katexRender(){
    var katexElements = document.querySelectorAll('span[class^="katex--"]');
    var katexElementsArrLen = katexElements.length;

    if (katexElementsArrLen > 0){
        for(var i = katexElementsArrLen-1 ; i >= 0; i--){
            var currElement = katexElements[i];
            var katexDefinition = currElement.textContent;

            try{
                var katexHTML = katex.renderToString(katexDefinition, {displayMode: currElement.className=="katex--display"});
                currElement.insertAdjacentHTML('beforebegin', katexHTML);
                currElement.remove();
            }
            catch(err){
                // Catch mermaid 'parseError'
                alert(err);
            }
        }
    }
}


// Generate random string of certain length
function randStrGenerator(len){
    var i;
    var generatedStr = '';
    for(i = 0; i < len; i++){
        generateChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        generatedStr += generateChar;
    }
    return generatedStr;
}


// Edit button event handler
var editArticle = function (){
    stackedit.openFile({                    
    name: fileName,
    content: {
      text: articleMarkdown.textContent
        }
    });
}
