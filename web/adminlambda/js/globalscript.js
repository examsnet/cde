
$(window).on("paste", function(e) { 
    const clipboardData = e?.originalEvent?.clipboardData;
    if (clipboardData) {
        //clipboardText = clipboardData.getData('text/plain');
        clipboardTextData = clipboardData.getData('Text');
        //clipboardHtml = clipboardData.getData('text/html');
    } 

    setTimeout(function() {
        $(e.target).closest('div').find('.getclonetestdetails').trigger('click');
    }, 200); // Delay of 200 milliseconds
});

function windowLevelKeyDown(event) { 
    if (event.code == 'KeyQ') {
        pasteQuestionAndAnswers();
    }
} 
 

window.addEventListener('keydown', windowLevelKeyDown);

function handleCtrlKey(e, element) {
    
    switch (e.code) {
        case 'Space': // TAB KEY LOGIC
            e.preventDefault();
            let start = element.selectionStart;
            let end = element.selectionEnd;
            let val = element.value;
            let selected = val.substring(start, end);
            let re = /^/gm;
            let count = selected.match(re).length;
            let replacementchars = '&nbsp;&nbsp;';
            element.value = val.substring(0, start) + selected.replace(re, replacementchars) + val.substring(end);
            element.selectionStart = start + replacementchars.length;
            element.selectionEnd = start + replacementchars.length;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            addsymbols(element, '←');
            break;
        case 'ArrowUp':
            e.preventDefault();
            appendsymbols(element, '↖{', '}');
            break;
        case 'ArrowRight':
            e.preventDefault();
            addsymbols(element, '→');
            break;
        case 'ArrowDown':
            e.preventDefault();
            appendsymbols(element, '↙{', '}');
            break;
        case 'Digit1':
            e.preventDefault();
            addsymbols(element, ' <br> ');
            break;
        case 'Digit2':
            e.preventDefault();
            appendsymbols(element, '<div class="parahead">', '</div>');
            break;
        case 'Digit3':
            e.preventDefault();
            appendsymbols(element, '<span class="highlight">', '</span>');
            break;
        case 'Digit4':
            e.preventDefault();
            appendsymbols(element, ' $', '$ ');
            break;
        case 'Digit5':
            e.preventDefault();
            addsymbols(element, '÷');
            break;
        case 'Digit6':
            e.preventDefault();
            appendsymbols(element, '^{', '}');
            break;
        case 'Digit8':
            e.preventDefault();
            addsymbols(element, '×');
            break;
        case 'Digit9':
            e.preventDefault();
            appendsymbols(element, '(', ')');
            break;
        case 'KeyB':
            e.preventDefault();
            appendsymbols(element, '<b>', '</b>');
            break;
        case 'KeyD':
            e.preventDefault();
            addsymbols(element, '𝜕');
            break;
        case 'KeyE':
            e.preventDefault();
            addsymbols(element, '&emsp;');
            break;
        case 'KeyI':
            e.preventDefault();
            appendsymbols(element, '<i>', '</i>');
            break;
        case 'KeyJ':
            e.preventDefault();
            appendsymbols(element, '<pre>', '</pre>');
            break;
        case 'KeyK':
            e.preventDefault();
            replaceNewLineWithBr(element);
            break;
        case 'KeyL':
            e.preventDefault();
            convertSelectedTextWithNewLineToList(element, e);
            break;
        case 'KeyM':
            e.preventDefault();
            appendsymbols(element, '<strong>', '</strong>');
            break;
        case 'KeyR':
            e.preventDefault();
            addsymbols(element, '⇒');
            break;
        case 'KeyS':
            e.preventDefault();
            $($(e.currentTarget).closest('#question').find('.savequestion')[0]).trigger('click');
            break;
        case 'KeyT':
            e.preventDefault();
            $('#latexToJQMath').trigger('click');
            break;
        case 'KeyU':
            e.preventDefault();
            appendsymbols(element, '<u>', '</u>');
            break;
        case 'KeyW':
            e.preventDefault();
            addsymbols(element, 'ω');
            break;
        case 'Semicolon':
            e.preventDefault();
            replaceSpaceWithEMSP(element);
            break;
        case 'Slash':
            e.preventDefault();
            appendComments(element, '/*', '*/');
            break;
        case 'Backquote':
            e.preventDefault();
            appendsymbols(element, '\\text "', '"');
            break;
        case 'BracketLeft':
            e.preventDefault();
            appendsymbols(element, '{', '}');
            break;
        case 'Backslash':
            e.preventDefault();
            appendsymbols(element, '<div class="hscrollenable">', '</div>');
            break;
        case 'Numpad8':
            e.preventDefault();
            appendsymbols(element, '<sup>', '</sup>');
            break;
        case 'Numpad2':
            e.preventDefault();
            appendsymbols(element, '<sub>', '</sub>');
            break;
        case 'Numpad1':
            e.preventDefault();
            addsymbols(element, '\\;\\;\\;⋅⋅⋅⋅⋅⋅⋅(i)');
            break;
        case 'Numpad3':
            e.preventDefault();
            addsymbols(element, '\\;\\;\\;⋅⋅⋅⋅⋅⋅⋅(iii)');
            break;
        case 'Minus':
            e.preventDefault();
            appendsymbols(element, '_{', '}');
            break;
        default:
            return true;
    }
}

function handleAltKey(e, element) {
    switch (e.code) {
        case 'Digit0':
            e.preventDefault();
            addsymbols(element, '°');
            break;
        case 'Digit6':
            e.preventDefault();
            addsymbols(element, '⋁');
            break;
        case 'KeyA':
            e.preventDefault();
            addsymbols(element, 'α');
            break;
        case 'KeyB':
            e.preventDefault();
            addsymbols(element, 'β');
            break;
        case 'KeyC':
            e.preventDefault();
            appendsymbols(element, '<code>', '</code>');
            break;
        case 'KeyD':
            e.preventDefault();
            addsymbols(element, 'δ');
            break;
        case 'KeyE':
            e.preventDefault();
            addsymbols(element, 'ε');
            break;
        case 'KeyG':
            e.preventDefault();
            addsymbols(element, 'γ');
            break;
        case 'KeyH':
            e.preventDefault();
            addsymbols(element, 'ℏ');
            break;
        case 'KeyI':
            e.preventDefault();
            addsymbols(element, '∫');
            break;
        case 'KeyL':
            e.preventDefault();
            addsymbols(element, 'λ');
            break;
        case 'KeyM':
            e.preventDefault();
            addsymbols(element, 'µ');
            break;
        case 'KeyN':
            e.preventDefault();
            addsymbols(element, '∩');
            break;
        case 'KeyO':
            e.preventDefault();
            addsymbols(element, 'ϕ');
            break;
        case 'KeyP':
            e.preventDefault();
            addsymbols(element, 'π');
            break;
        
        case 'KeyR':
            e.preventDefault();
            addsymbols(element, '₹');
            break;
        case 'KeyS':
            e.preventDefault();
            addsymbols(element, 'σ');
            break;
        case 'KeyT':
            e.preventDefault();
            addsymbols(element, 'θ');
            break;
        case 'KeyU':
            e.preventDefault();
            addsymbols(element, 'υ');
            break;
        case 'KeyV':
            e.preventDefault();
            addsymbols(element, '√');
            break;
        case 'KeyW':
            e.preventDefault();
            addsymbols(element, 'ω');
            break;
        case 'KeyZ':
                e.preventDefault();
                replaceSelectedText(latex_to_js(getselectedText())); 
                break;
        case 'Semicolon':
            e.preventDefault();
            addsymbols(element, '∴');
            break;
        case 'Equal':
            e.preventDefault();
            addsymbols(element, '≠');
            break;
        case 'Comma':
            e.preventDefault();
            addsymbols(element, '≤');
            break;
        case 'Period':
            e.preventDefault();
            addsymbols(element, '≥');
            break;
        case 'Backquote':
            e.preventDefault();
            appendsymbols(element, '<div class="floatright">', '</div>');
            break;
        case 'Backslash':
            e.preventDefault();
            addsymbols(element, '∥');
            break;
        default:
            return true;
    }
}

function handleAltShiftKey(e, element) {
    switch (e.code) {
        case 'Digit6':
            e.preventDefault();
            addsymbols(element, '⋀');
            break;
        case 'KeyD':
            e.preventDefault();
            addsymbols(element, 'Δ');
            break;
        case 'KeyE':
            e.preventDefault();
            addsymbols(element, '∊');
            break;
        case 'KeyG':
            e.preventDefault();
            addsymbols(element, 'Γ');
            break;
        case 'KeyI':
            e.preventDefault();
            addsymbols(element, '∞');
            break;
        case 'KeyM':
            e.preventDefault();
            addsymbols(element, 'Ø');
            break;
        case 'KeyO':
            e.preventDefault();
            addsymbols(element, 'Φ');
            break;
        case 'KeyP':
            e.preventDefault();
            addsymbols(element, '∏');
            break;
        case 'KeyS':
            e.preventDefault();
            addsymbols(element, 'Σ');
            break;
        case 'KeyT':
            e.preventDefault();
            addsymbols(element, 'Θ');
            break;
        case 'KeyU':
            e.preventDefault();
            addsymbols(element, '∪');
            break;
        case 'KeyV':
            e.preventDefault();
            addsymbols(element, 'ϑ');
            break;
        case 'KeyW':
            e.preventDefault();
            addsymbols(element, 'Ω');
            break;
        case 'Period':
            e.preventDefault();
            addsymbols(element, '⋅');
            break;
        case 'Equal':
            e.preventDefault();
            addsymbols(element, '±');
            break;
        case 'Comma':
            e.preventDefault();
            addsymbols(element, '∠');
            break;
        default:
            return true;
    }
}

function handleCtrlAltKey(e, element) {
    if (e.code === 'KeyW') {
        e.preventDefault();
        appendAnchorTag(element);
    } else {
        return true;
    }
}
  

function keyHandler(e) { 
     
    if (e.ctrlKey && e.altKey) {
        return handleCtrlAltKey(e, this);
    } else if (e.ctrlKey) {
        return handleCtrlKey(e, this);
    } else if (e.altKey && e.shiftKey) {
        return handleAltShiftKey(e, this);
    } else if (e.altKey) {
        return handleAltKey(e, this);
    } else {
        return true;
    }
}

$(document).on('keydown', 'input[type=text], textarea', function(e) {
    //e.preventDefault();
    //e.stopPropagation();
    keyHandler(e);
}); 



function scrollToEle(ele) {
    if (ele && $(ele).offset()) {
        var pos = $(ele).offset().top;
        $('html, body').animate({
            scrollTop: pos
        }, 100);
    }

}

function getselectedText(){
    var text = ''; 
    if (window.getSelection) {
        text = window.getSelection();

    } else if (document.getSelection) {
        text = document.getSelection();

    } else if (document.selection) {
        text = document.selection.createRange().text;
    } 
    return text.toString();
}
function replaceSelectedText(replacementText) {
    if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, replacementText);
    } else {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    }
}


function appendsymbols(ele, s1, s2) { 
    replaceSelectedText(s1+getselectedText()+s2);
}


function addsymbols(ele, symbol) {
    replaceSelectedText(symbol); 
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function replaceBRwithNewLineAndBR(str) { 
    str = str.replace(/<br>/g, "\n <br>");
    str = str; 
    var matches = str.match(/\$(?:[^\$\\]|\\.)*\$/g);
    if (matches && matches.length > 0) {
        matches.forEach(function(match) { 
            str = str.replace(match, '\n' + match + '\n'); 
        });
    }
    str = str.replace(/\n+/g, '\n');
    return str;
}


function getFormulaText(text) {   
    var matches = text.match(/\$(?:[^\$\\]|\\.)*\$/g);
    if (matches && matches.length > 0) {
        
        matches.forEach(function(match) {
            var temp = match.substring(1, match.length - 1); // to remove dollars 
            temp = M.sToMathE(temp, true);
            var tempEle = $(document.createElement('div')).html(temp).html();
            text = text.replace(match, tempEle);
        });
    }
    return text;
}


function downloadJsonAsFile(filename, json) {
    const jsonStr = JSON.stringify(json);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


$(function () {

  $(document).on('click', '.gptsolutionsonline', function (event) {
    stopscroll(event);
    gptsolutionsonline(event);
  }); 

  $(document).on('click', '.splitoptionsbynewline', function (event) {
    stopscroll(event);
    paste4OptionsAlone(event);
  }); 

  $(document).on('click', '.makejqmath', function (event) {
    stopscroll(event);
    replaceSelectedText(latex_to_js(getselectedText()));
  }); 
  $(document).on('click', '.makeanchor', function (event) {
    stopscroll(event);
    replaceSelectedText("<a href='javascript:void(0)' class='openinbrowser' ahref='" + getselectedText() + "'>" + getselectedText() + "</a>");
  });

  $(document).on('click', '.makeitalic', function (event) {
    stopscroll(event);
    replaceSelectedText("<i>" + getselectedText() + "</i>");
  });

  $(document).on('click', '.makestrong', function (event) {
    stopscroll(event);
    replaceSelectedText("<strong>" + getselectedText() + "</strong>");
  });

  $(document).on('click', '.makebold', function (event) {
    stopscroll(event);
    replaceSelectedText("<b>" + getselectedText() + "</b>");
  });

  $(document).on('click', '.makeunderline', function (event) {
    stopscroll(event);
    replaceSelectedText("<u>" + getselectedText() + "</u>");
  });


  $(document).on('click', '.makefloatright', function (event) {
    stopscroll(event);
    replaceSelectedText('<div class="floatright">' + getselectedText() + '</div>');
  });


  $(document).on('click', '.makeunorderedlist', function (event) {
    stopscroll(event);
    replaceSelectedText('<ul>' + getselectedText() + '</ul>');
  });

  $(document).on('click', '.makeorderedlist', function (event) {
    stopscroll(event);
    replaceSelectedText('<ol>' + getselectedText() + '</ol>');
  });

  $(document).on('click', '.makelist', function (event) {
    stopscroll(event);
    replaceSelectedText('<li>' + getselectedText() + '</li>');
  });

  $(document).on('click', '.makeunorderedlist1', function (event) {
    stopscroll(event);
    replaceSelectedText(textToList(getselectedText()));
  });

  $(document).on('click', '.previewaction', function (event) {
    console.log('preview fired')
    $(this).closest('.previewspan').find('.previewdest').toggleClass('hidelem');
  });


  $(document).on('click', '.formathtmlBR', function (event) {
    let value = $(this).closest('.previewspan').find('.previewsrc').val();
    let formattedHtml = replaceBRwithNewLineAndBR(value);
    let lines = formattedHtml.split('\n').length;
    $(this).closest('.previewspan').find('.previewsrc').val(formattedHtml); 
    if (lines > 4) {
      if (lines > 25) { lines = 25 }
      $(this).closest('.previewspan').find('.previewsrc').attr('rows', lines);
    } 
  });
  $(document).on('click', '.formathtml', function (event) { 
    let value = $(this).closest('.previewspan').find('.previewsrc').val(); 
    const formattedHtml = html_beautify(value, {
        indent_size: 4,
        space_in_empty_paren: true
    }); 
    let lines = formattedHtml.split('\n').length;
    $(this).closest('.previewspan').find('.previewsrc').val(formattedHtml); 
    if (lines > 4) {
      if (lines > 25) { lines = 25 }
      $(this).closest('.previewspan').find('.previewsrc').attr('rows', lines);
    } 
  });


  $(document).on('input', '.previewsrc', function (event) {
    $(this).closest('.previewspan').find('.valuetextbox').val($(this).val())
    let destval = getFormulaText($(this).val());
    $(this).closest('.previewspan').find('.previewdest').html(destval) 
  });


  $(document).on('click', '.copyimagetag', function (event) {
    stopscroll(event);
    copyImageTag(this, event)
  });


  
  $(document).on('click', '#scrolltop', function (event) {
    stopscroll(event);
    scrollTo(0, 0);
  });


  $(document).on('click', '#scrollbottom', function (event) {
    stopscroll(event);
    setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 1)
  });

 

});


function textToList(text) {
    // Split the text by period followed by a space or newline, to break it into sentences
    const sentences = text.split(/[\.\n]\s*/).filter(sentence => sentence.trim().length > 0);
    
    // Create an unordered list element
    const ul = document.createElement('ul');
    
    // Iterate through each sentence and create a list item
    sentences.forEach(sentence => {
        const li = document.createElement('li');
        li.innerHTML = sentence.trim();  // Add each sentence as HTML content
        ul.appendChild(li);
    });
    
    return ul.outerHTML;  // Return the constructed unordered list as a string
}



function gptsolutionsonline(event) {
    getMCQSolution(event);
}


async function getMCQSolution(event) {
    // Get the container for this question
    const $container = $(event.currentTarget).closest('#question');

    // Extract question text
    const questionText = $container.find('#questionText').val() || $container.find('#questionText').text();

    // Extract all 4 answers
    const answers = $container.find('#ansvaltextbox').map(function() {
        return $(this).val() || $(this).text();
    }).get();

    if (!questionText || answers.length === 0) {
        console.error('Question or answers are missing');
        return;
    }

    // Prepare payload
    const payload = {
        data: {
            question: questionText,
            options: answers,
            maxtokens: 500  // optional, can be dynamic
        }
    };

    try {
        // Call your Node.js server
        const res = await fetch('/data/getgptMCQSolution', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.status === 'success' && data.solution) {
            // Populate solution textbox in the same container
             const $hiddenInput = $container.find('#solutionText');

            // Set hidden input value
            $hiddenInput.val(data.solution);

            // Find only the neighbor textarea inside the same container
            const $visibleTextarea = $hiddenInput.closest('.input-group').find('textarea.previewsrc');

            // Set value and trigger change for preview
            $visibleTextarea.val(data.solution).trigger('change');
        } else {
            console.error('Error fetching solution:', data.msg || 'Unknown error');
        }

    } catch (err) {
        console.error('Error calling GPT solution API:', err);
    }
}

