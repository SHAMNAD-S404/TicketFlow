export const regexPatterns = {
    searchInputField : /^[a-zA-Z0-9]+([@.][a-zA-Z]+)*$/,
    alphabatesOnly : /^[A-Za-z]+$/,
    alphabatesAndNumberOnly : /^[A-Za-z0-9]+$/,
    uuid_v4 :/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i,
    alphabatesAndSpaces :  /^[a-zA-Z][a-zA-Z\s]*$/,
    textWithSpaceAndCommas :/^[a-zA-Z][a-zA-Z\s,]*$/,
    textAreaValidation :/^[a-zA-Z0-9"'.(),/\-\s]+(?<![().])$/, 
    objectIdRegex : /^[A-Za-z0-9]+$/,
    

} 