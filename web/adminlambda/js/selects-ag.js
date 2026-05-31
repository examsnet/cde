const categoryType = [
    { catid: 'category_exams', title: "Exams" },
    { catid: 'category_menu', title: "Menu Items" },
    { catid: 'category_metadata', title: "Metadata" },
    { catid: 'category_notes', title: "Notes" },
    { catid: 'category_statelevel', title: "State Level" },
    { catid: 'category_utils', title: "Utilities" }
]; 
const categoryTypeOptions = categoryType.map(role => role.catid);
const categoryTypeParams = { values: categoryTypeOptions } 
function categoryTypeFormatter(params) {
    const urole = categoryType.find(role => role.catid === params.value);
    return urole ? urole.title : params.value;
}




const decisions = [   
    { decsid: 'false', title: "False" },
    { decsid: 'true', title: "True" }
];

const decisionOptions = decisions.map(decsion => decsion.decsid);
const decisionParams = { values: decisionOptions }

function decisionFormatter(params) {
    const decsion = decisions.find(decsion => decsion.decsid === params.value);
    return decsion ? decsion.title : params.value;
}


const cdnRoots = [
    { key: 'CDN1', title: 'CDN 1' },
    { key: 'CDN2', title: 'CDN 2' }
];

const cdnRootOptions = cdnRoots.map(root => root.key);
const cdnRootParams = { values: cdnRootOptions }

function cdnRootFormatter(params) {
    const root = cdnRoots.find(root => root.key === params.value);
    return root ? root.title : (params.value || 'CDN 1');
}




const userroles = [
    { roleid: 1, title: "None" },
    { roleid: 2, title: "Basic" },
    { roleid: 3, title: "Maker" },
    { roleid: 4, title: "Checker" },
    { roleid: 5, title: "Admin" }
];

const userRoleOptions = userroles.map(role => role.roleid);
const userRoleParams = { values: userRoleOptions }


function userRoleFormatter(params) {
    const urole = userroles.find(role => role.roleid === params.value);
    return urole ? urole.title : params.value;
}







const languages = [
    { langid: 'bn', title: "Bengali" },
    { langid: 'en', title: "English" },
    { langid: 'gu', title: "Gujarati" },
    { langid: 'hi', title: "Hindi" },
    { langid: 'kn', title: "Kannada" },
    { langid: 'ml', title: "Malayalam" },
    { langid: 'mr', title: "Marathi" },
    { langid: 'or', title: "Odia" },
    { langid: 'pa', title: "Punjabi" },
    { langid: 'ta', title: "Tamil" },
    { langid: 'te', title: "Telugu" }
];

const languageOptions = languages.map(lang => lang.langid);
const languageParams = { values: languageOptions }


function languageFormatter(params) {
    const lang = languages.find(lang => lang.langid === params.value);
    return lang ? lang.title : params.value;
}





const sortOrder = [   
    { sortid: 'asc', title: "Ascending" },
    { sortid: 'desc', title: "Descending" },
    { sortid: 'none', title: "None" }
];



const sortOrderOptions = sortOrder.map(order => order.sortid);
const sortOrderParams = { values: sortOrderOptions }


function sortOrderFormatter(params) {
    const usort = sortOrder.find(order => order.sortid === params.value);
    return usort ? usort.title : params.value;
}

 
