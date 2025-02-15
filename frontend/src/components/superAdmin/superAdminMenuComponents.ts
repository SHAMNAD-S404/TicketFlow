import CompanyManagement from "./CompanyManagement";

interface MenuConfig {
    [key : string] : React.FC;
}

export const superAdminMenuComponents : MenuConfig = {
    "Company Management" : CompanyManagement,
}