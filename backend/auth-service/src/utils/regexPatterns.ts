interface IRegexPatterns {
    [key:string] : RegExp;
}

export const regexPatterns : IRegexPatterns = {
    password : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    

}