/* jqmath-to-latex.js: Reverse conversion from jqMath notation to LaTeX
 * This module reverses the transformations done by latex-to-jqmath.js
 * 
 * Usage:
 *   var latex = jqmath_to_latex(jqmathString);
 * 
 * Created by reverse engineering latex_to_js() transformations
 * 
 * IMPORTANT: All helper functions are wrapped in IIFE to avoid global namespace pollution
 * and conflicts with latex-to-jqmath.js
 */

(function (global) {
    'use strict';

    /**
     * Main conversion function: jqMath → LaTeX
     * @param {string} input - jqMath formatted string (can contain HTML with math)
     * @returns {string} - LaTeX formatted string
     */
    function jqmath_to_latex(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }

        var st1 = input;

        // Process dollar-delimited math blocks first
        st1 = processMathBlocks(st1);

        // Clean up any remaining HTML entities and formatting
        st1 = cleanupHtml(st1);

        return st1;
    }

    /**
     * Process content within $...$ blocks
     */
    function processMathBlocks(text) {
        // Find all $...$ blocks and process them
        var matches = text.match(/\$(?:[^\$\\]|\\.)*\$/g);
        if (matches && matches.length > 0) {
            matches.forEach(function (match) {
                var temp = match.substring(1, match.length - 1); // Remove dollars
                temp = performJqmathToLatexOperations(temp);
                text = text.replace(match, '$' + temp + '$');
            });
        }
        return text;
    }

    /**
     * Core conversion: jqMath operators to LaTeX
     */
    function performJqmathToLatexOperations(st1) {
        // 1. Handle complex constructs first (order matters!)
        st1 = convertCases(st1);
        st1 = convertMatrices(st1);
        st1 = convertText(st1);

        // 2. Handle fractions
        st1 = convertFractions(st1);

        // 3. Handle roots
        st1 = convertRoots(st1);

        // 4. Handle integrals, summations, products, and limits with arrows
        st1 = convertIntegrals(st1);
        st1 = convertSummations(st1);
        st1 = convertProducts(st1);
        st1 = convertLimits(st1);

        // 5. Handle vectors, hats, and other arrow notations
        st1 = convertVectors(st1);
        st1 = convertHats(st1);
        st1 = convertOverline(st1);
        st1 = convertUnderset(st1);
        st1 = convertStackrel(st1);
        st1 = convertExtendedArrows(st1);

        // 6. Handle special functions (det, log, binomial, floor/ceiling)
        st1 = convertBinomials(st1);
        st1 = convertFloorCeiling(st1);

        // 7. Convert arrow notation (↖ ↙) to superscripts/subscripts
        st1 = convertArrows(st1);

        // 8. Convert symbols
        st1 = convertSymbols(st1);

        // 9. Clean up trig functions and spacing
        st1 = cleanupTrigFunctions(st1);
        st1 = cleanupSpacing(st1);

        return st1;
    }

    /**
     * Convert \\text "content" back to \\text{content}
     */
    function convertText(input) {
        // Match \\text "..." with optional \\; spacing before/after
        input = input.replace(/\\;\\text\s*"([^"]*)"\s*\\;/g, '\\text{$1}');
        input = input.replace(/\\text\s*"([^"]*)"/g, '\\text{$1}');
        return input;
    }

    /**
     * Convert fractions: \\;{a}/{b} → \\frac{a}{b}
     */
    function convertFractions(input) {
        // Handle nested fractions carefully - process from innermost to outermost
        var maxIterations = 20;
        var iteration = 0;

        while (iteration++ < maxIterations) {
            var beforeReplace = input;

            // Pattern: \\;{numerator}/{denominator}
            // Match simple fractions first (no nested braces)
            input = input.replace(/\\;\{([^{}]+)\}\/\{([^{}]+)\}/g, '\\frac{$1}{$2}');

            // Then handle fractions with one level of nested braces
            input = input.replace(/\\;\{([^{}]*\{[^{}]*\}[^{}]*)\}\/\{([^{}]*)\}/g, '\\frac{$1}{$2}');
            input = input.replace(/\\;\{([^{}]*)\}\/\{([^{}]*\{[^{}]*\}[^{}]*)\}/g, '\\frac{$1}{$2}');

            // If no changes were made, we're done
            if (beforeReplace === input) break;
        }

        // Also handle fractions without \\; prefix (in case they exist)
        input = input.replace(/\{([^{}]+)\}\/\{([^{}]+)\}/g, '\\frac{$1}{$2}');

        return input;
    }

    /**
     * Convert square roots: {√{x}} → \\sqrt{x}, \\;^{n}√{x} → \\sqrt[n]{x}
     */
    function convertRoots(input) {
        // nth root: \\;^{n}√{x} → \\sqrt[n]{x}
        input = input.replace(/\\;\^\{([^}]+)\}√\{([^}]+)\}/g, '\\sqrt[$1]{$2}');

        // Simple root: {√{x}} → \\sqrt{x}
        input = input.replace(/\{?√\{([^}]+)\}\}?/g, '\\sqrt{$1}');

        // Bare √ symbol
        input = input.replace(/√/g, '\\sqrt');

        return input;
    }

    /**
     * Convert integrals: ∫↙{a}↖{b} → \\int_{a}^{b}
     */
    function convertIntegrals(input) {
        // ∫↙{lower}↖{upper}
        input = input.replace(/∫↙\{([^}]+)\}↖\{([^}]+)\}/g, '\\int_{$1}^{$2}');

        // ∫↙{lower}↖upper (unbraced upper)
        input = input.replace(/∫↙\{([^}]+)\}↖([a-zA-Zπ0-9]+)/g, '\\int_{$1}^{$2}');

        // ∫↙{lower}
        input = input.replace(/∫↙\{([^}]+)\}/g, '\\int_{$1}');

        // ∫↖{upper}
        input = input.replace(/∫↖\{([^}]+)\}/g, '\\int^{$1}');

        // ∫↖upper (unbraced)
        input = input.replace(/∫↖([a-zA-Zπ0-9]+)/g, '\\int^{$1}');

        // Plain ∫
        input = input.replace(/∫/g, '\\int');

        return input;
    }

    /**
     * Convert summations: ∑↙{i=1}↖{n} → \\sum_{i=1}^{n}
     * Also handles Σ symbol
     */
    function convertSummations(input) {
        // Handle both ∑ and Σ
        var sumSymbols = ['∑', 'Σ'];

        sumSymbols.forEach(function (symbol) {
            // symbol↙{lower}↖{upper}
            var pattern1 = new RegExp(symbol + '↙\\{([^}]+)\\}↖\\{([^}]+)\\}', 'g');
            input = input.replace(pattern1, '\\sum_{$1}^{$2}');

            // symbol↙{lower}↖upper (unbraced upper)
            var pattern2 = new RegExp(symbol + '↙\\{([^}]+)\\}↖([a-zA-Zπ0-9]+)', 'g');
            input = input.replace(pattern2, '\\sum_{$1}^{$2}');

            // symbol↙{lower}
            var pattern3 = new RegExp(symbol + '↙\\{([^}]+)\\}', 'g');
            input = input.replace(pattern3, '\\sum_{$1}');

            // symbol↖{upper}
            var pattern4 = new RegExp(symbol + '↖\\{([^}]+)\\}', 'g');
            input = input.replace(pattern4, '\\sum^{$1}');

            // symbol↖upper (unbraced)
            var pattern5 = new RegExp(symbol + '↖([a-zA-Zπ0-9]+)', 'g');
            input = input.replace(pattern5, '\\sum^{$1}');

            // Plain symbol
            var pattern6 = new RegExp(symbol, 'g');
            input = input.replace(pattern6, '\\sum');
        });

        return input;
    }

    /**
     * Convert vectors: {x}↖{→} → \\overrightarrow{x} or \\vec{x}
     */
    function convertVectors(input) {
        // {content}↖{→} → \\overrightarrow{content}
        input = input.replace(/\{([^}]+)\}↖\{→\}/g, '\\overrightarrow{$1}');

        // {content}↖{←} → \\overleftarrow{content}
        input = input.replace(/\{([^}]+)\}↖\{←\}/g, '\\overleftarrow{$1}');

        // {content}↙{‾} → \\underline{content}
        input = input.replace(/\{([^}]+)\}↙\{‾\}/g, '\\underline{$1}');

        return input;
    }

    /**
     * Convert hats: {x}↖{∧} → \\hat{x}
     */
    function convertHats(input) {
        // {content}↖{∧} → \\hat{content}
        input = input.replace(/\{([^}]+)\}↖\{∧\}/g, '\\hat{$1}');

        return input;
    }

    /**
     * Convert underset: \\;{B}↙{A} → \\underset{A}{B}
     */
    function convertUnderset(input) {
        // \\;{content}↙{subscript} → \\underset{subscript}{content}
        input = input.replace(/\\;\{([^}]+)\}↙\{([^}]+)\}/g, '\\underset{$2}{$1}');

        return input;
    }

    /**
     * Convert stackrel: {B}↖{A} → \\stackrel{A}{B}
     * (but be careful not to match vectors/hats which also use ↖)
     */
    function convertStackrel(input) {
        // Only convert if it's not a vector (→) or hat (∧)
        // {content}↖{superscript} → \\stackrel{superscript}{content}
        // This is tricky - we need to exclude patterns already handled by vectors/hats
        // So we look for general alphanumeric superscripts
        input = input.replace(/\{([^}]+)\}↖\{([^→←∧}]+)\}/g, '\\stackrel{$2}{$1}');

        return input;
    }

    /**
     * Convert general arrow notation to superscripts/subscripts
     * ↖{...} → ^{...}
     * ↙{...} → _{...}
     */
    function convertArrows(input) {
        // ↖{content} → ^{content}
        input = input.replace(/↖\{([^}]+)\}/g, '^{$1}');

        // ↙{content} → _{content}
        input = input.replace(/↙\{([^}]+)\}/g, '_{$1}');

        // Unbraced arrows (single character or command)
        // ↖x → ^x
        input = input.replace(/↖([a-zA-Z0-9π])/g, '^$1');

        // ↙x → _x
        input = input.replace(/↙([a-zA-Z0-9π])/g, '_$1');

        return input;
    }

    /**
     * Convert math symbols from Unicode to LaTeX commands
     */
    function convertSymbols(input) {
        // Blackboard bold symbols (must be done before other conversions)
        input = input.replace(/ℕ/g, '\\mathbb{N}');  // Natural numbers
        input = input.replace(/ℤ/g, '\\mathbb{Z}');  // Integers
        input = input.replace(/ℚ/g, '\\mathbb{Q}');  // Rational numbers
        input = input.replace(/ℝ/g, '\\mathbb{R}');  // Real numbers
        input = input.replace(/ℂ/g, '\\mathbb{C}');  // Complex numbers
        input = input.replace(/ℙ/g, '\\mathbb{P}');  // Prime numbers / Probability

        // Greek letters - lowercase
        input = input.replace(/α/g, '\\alpha');
        input = input.replace(/β/g, '\\beta');
        input = input.replace(/γ/g, '\\gamma');
        input = input.replace(/δ/g, '\\delta');
        input = input.replace(/ε/g, '\\epsilon');
        input = input.replace(/ζ/g, '\\zeta');
        input = input.replace(/η/g, '\\eta');
        input = input.replace(/θ/g, '\\theta');
        input = input.replace(/ι/g, '\\iota');
        input = input.replace(/κ/g, '\\kappa');
        input = input.replace(/λ/g, '\\lambda');
        input = input.replace(/μ/g, '\\mu');
        input = input.replace(/µ/g, '\\mu');  // Alternative mu
        input = input.replace(/ν/g, '\\nu');
        input = input.replace(/ξ/g, '\\xi');
        input = input.replace(/ο/g, 'o');  // omicron (usually just 'o')
        input = input.replace(/π/g, '\\pi');
        input = input.replace(/ρ/g, '\\rho');
        input = input.replace(/σ/g, '\\sigma');
        input = input.replace(/ς/g, '\\varsigma');  // final sigma
        input = input.replace(/τ/g, '\\tau');
        input = input.replace(/υ/g, '\\upsilon');
        input = input.replace(/φ/g, '\\phi');
        input = input.replace(/χ/g, '\\chi');
        input = input.replace(/ψ/g, '\\psi');
        input = input.replace(/ω/g, '\\omega');

        // Greek letters - uppercase
        input = input.replace(/Α/g, 'A');  // Alpha (usually just A)
        input = input.replace(/Β/g, 'B');  // Beta (usually just B)
        input = input.replace(/Γ/g, '\\Gamma');
        input = input.replace(/Δ/g, '\\Delta');
        input = input.replace(/Ε/g, 'E');  // Epsilon (usually just E)
        input = input.replace(/Ζ/g, 'Z');  // Zeta (usually just Z)
        input = input.replace(/Η/g, 'H');  // Eta (usually just H)
        input = input.replace(/Θ/g, '\\Theta');
        input = input.replace(/Ι/g, 'I');  // Iota (usually just I)
        input = input.replace(/Κ/g, 'K');  // Kappa (usually just K)
        input = input.replace(/Λ/g, '\\Lambda');
        input = input.replace(/Μ/g, 'M');  // Mu (usually just M)
        input = input.replace(/Ν/g, 'N');  // Nu (usually just N)
        input = input.replace(/Ξ/g, '\\Xi');
        input = input.replace(/Ο/g, 'O');  // Omicron (usually just O)
        input = input.replace(/Π/g, '\\Pi');
        input = input.replace(/Ρ/g, 'P');  // Rho (usually just P)
        input = input.replace(/Σ/g, '\\Sigma');
        input = input.replace(/Τ/g, 'T');  // Tau (usually just T)
        input = input.replace(/Υ/g, '\\Upsilon');
        input = input.replace(/Φ/g, '\\Phi');
        input = input.replace(/Χ/g, 'X');  // Chi (usually just X)
        input = input.replace(/Ψ/g, '\\Psi');
        input = input.replace(/Ω/g, '\\Omega');

        // Mathematical operators
        input = input.replace(/×/g, '\\times');
        input = input.replace(/÷/g, '\\div');
        input = input.replace(/⋅/g, '\\cdot');
        input = input.replace(/⋯/g, '\\cdots');
        input = input.replace(/…/g, '\\ldots');
        input = input.replace(/±/g, '\\pm');
        input = input.replace(/∓/g, '\\mp');

        // Arrows and relations
        input = input.replace(/⇒/g, '\\Rightarrow');
        input = input.replace(/⟶/g, '\\rightarrow');
        input = input.replace(/→/g, '\\to');
        input = input.replace(/←/g, '\\leftarrow');
        input = input.replace(/⇐/g, '\\Leftarrow');
        input = input.replace(/⇔/g, '\\Leftrightarrow');
        input = input.replace(/↔/g, '\\leftrightarrow');

        // Relations
        input = input.replace(/≤/g, '\\leq');
        input = input.replace(/≥/g, '\\geq');
        input = input.replace(/≠/g, '\\neq');
        input = input.replace(/≈/g, '\\approx');
        input = input.replace(/≡/g, '\\equiv');
        input = input.replace(/∝/g, '\\propto');
        input = input.replace(/∞/g, '\\infty');
        input = input.replace(/∂/g, '\\partial');

        // Set theory
        input = input.replace(/∈/g, '\\in');
        input = input.replace(/∉/g, '\\notin');
        input = input.replace(/⊂/g, '\\subset');
        input = input.replace(/⊃/g, '\\supset');
        input = input.replace(/⊆/g, '\\subseteq');
        input = input.replace(/⊇/g, '\\supseteq');
        input = input.replace(/∪/g, '\\cup');
        input = input.replace(/∩/g, '\\cap');
        input = input.replace(/∅/g, '\\emptyset');
        input = input.replace(/∀/g, '\\forall');
        input = input.replace(/∃/g, '\\exists');

        // Other symbols
        input = input.replace(/∘/g, '\\circ');
        input = input.replace(/°/g, '^\\circ');  // degree symbol
        input = input.replace(/∠/g, '\\angle');
        input = input.replace(/⊥/g, '\\perp');
        input = input.replace(/∥/g, '\\parallel');
        input = input.replace(/△/g, '\\triangle');

        return input;
    }

    /**
     * Convert matrices/tables: {\\table ...} → \\begin{array}{c}...\\end{array}
     */
    function convertMatrices(input) {
        // Pattern: {delimiter\\table content delimiter}
        // e.g., {|\\table a,b;c,d|} → \\left|\\begin{array}{cc}a & b \\\\ c & d\\end{array}\\right|

        var tableRegex = /\{([\\|[\]()?]*)\\table\s+([^}]+)([\\|[\]()?]*)\}/g;

        input = input.replace(tableRegex, function (match, leftDelim, content, rightDelim) {
            // Clean delimiters
            leftDelim = leftDelim.replace(/\\/g, '\\');
            rightDelim = rightDelim.replace(/\\/g, '\\');

            // Process table content
            var processed = processTableContent(content);

            // Determine column count and spec
            var rows = processed.split('\\\\');
            var firstRow = rows[0];
            var colCount = (firstRow.match(/&/g) || []).length + 1;
            var colSpec = 'c'.repeat(colCount);

            // Format as LaTeX array
            var result = '';
            if (leftDelim) {
                result += '\\left' + leftDelim;
            }
            result += '\\begin{array}{' + colSpec + '}' + processed + '\\end{array}';
            if (rightDelim) {
                result += '\\right' + rightDelim;
            }

            return result;
        });

        return input;
    }

    /**
     * Process table content: convert jqMath table format to LaTeX array format
     * Converts: , → & (column separator), ; → \\\\ (row separator)
     */
    function processTableContent(content) {
        // Remove spacing artifacts like {, \\;}
        content = content.replace(/\{,\s*\\;\}/g, '');
        content = content.replace(/\{;\s*\\;\}/g, '');

        // Convert separators
        content = content.replace(/;/g, '\\\\');  // row separator
        content = content.replace(/,/g, ' & ');   // column separator

        // Clean up pipes (absolute values in table cells)
        content = content.replace(/\{?\|([^|]+)\|\}?/g, '|$1|');

        return content.trim();
    }

    /**
     * Convert cases: \\{ {\\table ...} → \\begin{cases}...\\end{cases}
     */
    function convertCases(input) {
        // Pattern: \\{ {\\table content}
        var casesRegex = /\\\\\{\s*\{\\table\s+([^}]+)\}/g;

        input = input.replace(casesRegex, function (match, content) {
            var processed = processTableContent(content);
            return '\\begin{cases}' + processed + '\\end{cases}';
        });

        return input;
    }

    /**
     * Convert products: ∏↙{i=1}↖{n} → \prod_{i=1}^{n}
     */
    function convertProducts(input) {
        // ∏↙{lower}↖{upper}
        input = input.replace(/∏↙\{([^}]+)\}↖\{([^}]+)\}/g, '\\prod_{$1}^{$2}');
        // ∏↙{lower}
        input = input.replace(/∏↙\{([^}]+)\}/g, '\\prod_{$1}');
        // ∏↖{upper}
        input = input.replace(/∏↖\{([^}]+)\}/g, '\\prod^{$1}');
        // Plain ∏
        input = input.replace(/∏/g, '\\prod');
        return input;
    }

    /**
     * Convert limits: \lim ↙{x→0} → \lim_{x\to 0}
     */
    function convertLimits(input) {
        // \lim ↙{lower}
        input = input.replace(/\\lim\s*↙\{([^}]+)\}/g, function (match, limit) {
            // Convert arrows inside limit subscript
            limit = limit.replace(/→/g, '\\to');
            return '\\lim_{' + limit + '}';
        });
        return input;
    }

    /**
     * Convert overline: \ov{x} → \overline{x}
     */
    function convertOverline(input) {
        return input.replace(/\\ov\{([^}]+)\}/g, '\\overline{$1}');
    }

    /**
     * Convert binomials: (n \choose k) usually represented in tables or special format in jqMath
     * This handles standard cases if they appear
     */
    function convertBinomials(input) {
        // Implementation depends on specific jqMath representation if unique
        // For now, handling common LaTeX-like remnants if any
        return input;
    }

    /**
     * Convert floor and ceiling: \⌊x\⌋ → \lfloor x \rfloor
     */
    function convertFloorCeiling(input) {
        input = input.replace(/\\⌊/g, '\\lfloor ');
        input = input.replace(/\\⌋/g, ' \\rfloor');
        input = input.replace(/\\⌈/g, '\\lceil ');
        input = input.replace(/\\⌉/g, ' \\rceil');
        return input;
    }

    /**
     * Clean up trig functions: remove \; after sin, cos, etc.
     */
    function cleanupTrigFunctions(input) {
        var funcs = ['sin', 'cos', 'tan', 'cot', 'sec', 'cosec', 'csc', 'log', 'ln', 'exp', 'det', 'dim', 'lim', 'min', 'max'];
        funcs.forEach(function (func) {
            // Remove \; after function name, e.g. "sin \;" -> "sin " or "\sin "
            // Also ensure backslash prefix if missing
            var regex = new RegExp('(\\\\?)' + func + '\\s*(\\\\;|\\\\ |\\s+)', 'g');
            input = input.replace(regex, '\\' + func + ' ');
        });
        return input;
    }

    /**
     * Clean up spacing and artifacts
     */
    function cleanupSpacing(input) {
        // Remove \\; spacing commands (both escaped and unescaped versions)
        input = input.replace(/\\\\;/g, ' ');
        input = input.replace(/\\;/g, ' ');

        // Remove standalone backslash-space combinations
        input = input.replace(/\\ /g, ' ');

        // Clean up multiple spaces
        input = input.replace(/\s+/g, ' ');

        // Clean up spaces around operators (but preserve spaces in regular text)
        // Only clean within math mode (between $ signs)
        input = input.replace(/\$([^$]+)\$/g, function (match, mathContent) {
            // Remove spaces before/after braces
            mathContent = mathContent.replace(/\s*\{\s*/g, '{');
            mathContent = mathContent.replace(/\s*\}\s*/g, '}');

            // Clean up spaces around common operators
            mathContent = mathContent.replace(/\s*([+\-=<>])\s*/g, ' $1 ');
            mathContent = mathContent.replace(/\s*([\(\)])\s*/g, '$1');

            // Final cleanup of multiple spaces
            mathContent = mathContent.replace(/\s+/g, ' ');

            return '$' + mathContent.trim() + '$';
        });

        return input.trim();
    }

    /**
     * Clean up HTML entities and tags
     */
    function cleanupHtml(text) {
        // Preserve HTML entities for special characters (for web display)
        // Don't convert &gt; &lt; &amp; etc as they may be intentional

        // Remove NBSP but keep as space
        text = text.replace(/&nbsp;/g, ' ');
        text = text.replace(/&emsp;/g, ' ');

        // Clean up <br> tags - convert to newline
        text = text.replace(/<br\s*\/?>/gi, '\n');

        // Clean up <div> tags but preserve content
        text = text.replace(/<div[^>]*>/gi, '\n');
        text = text.replace(/<\/div>/gi, '');

        return text;
    }

    /**
     * Helper function to extract content from HTML <fmath> elements
     * and convert to LaTeX
     */
    function convertFmathToLatex(html) {
        if (!html || typeof html !== 'string') {
            return '';
        }

        // Create a temporary container (if in browser environment)
        if (typeof document !== 'undefined') {
            var container = document.createElement('div');
            container.innerHTML = html;

            // Find all fmath elements and convert them to LaTeX
            container.querySelectorAll("fmath").forEach(function (node) {
                var tex = node.getAttribute("alttext");
                if (!tex) return;

                // Apply normalization
                tex = tex.replace(/\^\{\s*'\s*\}/g, "'");  // Fix primes
                tex = tex.replace(/\\;/g, " ");             // Remove spacing
                tex = tex.replace(/⋅/g, "\\cdot");          // Normalize dot
                tex = tex.replace(/\s+/g, " ").trim();      // Normalize spaces

                var isInline = node.classList.contains("fm-inline");
                var latex = isInline ? "$" + tex + "$" : "$$" + tex + "$$";

                node.replaceWith(document.createTextNode(latex));
            });

            // Get text content
            var output = container.textContent;
            output = output.replace(/\s+/g, " ").trim();
            return output;
        }

        // If not in browser, try basic string replacement
        return html.replace(/<fmath[^>]*alttext="([^"]*)"[^>]*>.*?<\/fmath>/gi, function (match, alttext) {
            return "$" + alttext + "$";
        });
    }


    /**
 * Convert products: ∏↙{i=1}↖{n} → \prod_{i=1}^{n}
 */
    function convertProducts(input) {
        // ∏↙{lower}↖{upper}
        input = input.replace(/∏↙\{([^}]+)\}↖\{([^}]+)\}/g, '\\prod_{$1}^{$2}');

        // ∏↙{lower}↖upper (unbraced upper)
        input = input.replace(/∏↙\{([^}]+)\}↖([a-zA-Zπ0-9]+)/g, '\\prod_{$1}^{$2}');

        // ∏↙{lower}
        input = input.replace(/∏↙\{([^}]+)\}/g, '\\prod_{$1}');

        // ∏↖{upper}
        input = input.replace(/∏↖\{([^}]+)\}/g, '\\prod^{$1}');

        // ∏↖upper (unbraced)
        input = input.replace(/∏↖([a-zA-Zπ0-9]+)/g, '\\prod^{$1}');

        // Plain ∏
        input = input.replace(/∏/g, '\\prod');

        return input;
    }

    /**
     * Convert limits: \lim ↙{x→∞} → \lim_{x\to\infty}
     */
    function convertLimits(input) {
        // Handle \lim ↙{subscript} (from latex-to-jqmath)
        input = input.replace(/\\lim\s*↙\{([^}]+)\}/g, function (match, limit) {
            limit = limit.replace(/→/g, '\\to');
            limit = limit.replace(/∞/g, '\\infty');
            return '\\lim_{' + limit + '}';
        });

        // Handle bare lim↙{subscript}
        input = input.replace(/lim↙\{([^}]+)\}/g, function (match, limit) {
            limit = limit.replace(/→/g, '\\to');
            limit = limit.replace(/∞/g, '\\infty');
            return '\\lim_{' + limit + '}';
        });

        return input;
    }

    /**
     * Convert overline: {content}↖{‾} or \ov{content} → \overline{content}
     */
    function convertOverline(input) {
        // \ov{content} (from latex-to-jqmath)
        input = input.replace(/\\ov\{([^}]+)\}/g, '\\overline{$1}');

        // {content}↖{‾}
        input = input.replace(/\{([^}]+)\}↖\{‾\}/g, '\\overline{$1}');

        return input;
    }

    /**
     * Convert extended arrows: {───────▶}↙{bottom}↖{top} → \xrightarrow[bottom]{top}
     */
    function convertExtendedArrows(input) {
        var arrow = '\\{?[\\s\\;]*───────▶[\\s\\;]*\\}?';

        // \xrightarrow[bottom]{top}
        var regexBoth = new RegExp(arrow + '↙\\{([^}]+)\\}↖\\{([^}]+)\\}', 'g');
        input = input.replace(regexBoth, '\\xrightarrow[$1]{$2}');

        // \xrightarrow[bottom]{}
        var regexBottom = new RegExp(arrow + '↙\\{([^}]+)\\}', 'g');
        input = input.replace(regexBottom, '\\xrightarrow[$1]{}');

        // \xrightarrow{top}
        var regexTop = new RegExp(arrow + '↖\\{([^}]+)\\}', 'g');
        input = input.replace(regexTop, '\\xrightarrow{$1}');

        // Plain \xrightarrow
        var regexPlain = new RegExp(arrow, 'g');
        input = input.replace(regexPlain, '\\xrightarrow');

        return input;
    }

    /**
     * Convert binomials: \\;{n}{k} → \binom{n}{k}
     * Also handles (n k) pattern
     */
    function convertBinomials(input) {
        // Pattern: \\;{n}{k} or (n k)
        input = input.replace(/\\;\{([^}]+)\}\{([^}]+)\}/g, '\\binom{$1}{$2}');

        // Also handle parenthesized form: (n k) where it looks like a binomial
        // This is tricky - we need context, so let's be conservative
        // Only convert if it matches binomial coefficient pattern
        input = input.replace(/\(\s*([a-zA-Z0-9+\-]+)\s+([a-zA-Z0-9+\-]+)\s*\)/g, function (match, n, k) {
            // Only convert if both parts are simple (likely binomial coefficient)
            if (/^[nkrm0-9]+$/.test(n) && /^[nkrm0-9]+$/.test(k)) {
                return '\\binom{' + n + '}{' + k + '}';
            }
            return match; // Keep original if not a clear binomial
        });

        return input;
    }

    /**
     * Convert floor and ceiling functions
     * ⌊x⌋ → \lfloor x \rfloor
     * ⌈x⌉ → \lceil x \rceil
     */
    function convertFloorCeiling(input) {
        // Floor function
        input = input.replace(/⌊([^⌋]+)⌋/g, '\\lfloor $1 \\rfloor');

        // Ceiling function
        input = input.replace(/⌈([^⌉]+)⌉/g, '\\lceil $1 \\rceil');

        return input;
    }

    /**
     * Clean up trigonometric and logarithmic functions
     * Ensures proper spacing and formatting
     */
    function cleanupTrigFunctions(input) {
        // Common trig functions - ensure they have backslash and proper spacing
        var functions = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot',
            'sinh', 'cosh', 'tanh', 'arcsin', 'arccos', 'arctan',
            'log', 'ln', 'exp', 'det', 'dim', 'ker', 'max', 'min',
            'sup', 'inf', 'gcd', 'lcm'];

        functions.forEach(function (fn) {
            // Match word boundaries to avoid replacing parts of other words
            var regex = new RegExp('\\b' + fn + '\\b', 'g');
            input = input.replace(regex, '\\' + fn);
        });

        // Clean up double backslashes (in case function was already escaped)
        input = input.replace(/\\\\(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|arcsin|arccos|arctan|log|ln|exp|det|dim|ker|max|min|sup|inf|gcd|lcm)/g, '\\$1');

        return input;
    }

    // Expose main functions globally
    global.jqmath_to_latex = jqmath_to_latex;
    global.convertFmathToLatex = convertFmathToLatex;

    // Export for Node.js if available
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            jqmath_to_latex: jqmath_to_latex,
            convertFmathToLatex: convertFmathToLatex
        };
    }

})(typeof window !== 'undefined' ? window : global);
