export interface IUser {
    email:string,
    password:string,
    role : 'employee' | 'compnay' | 'deptHead' | 'sudo'
}