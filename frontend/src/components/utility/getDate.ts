

const getDate = (date : string) : string => {
    return new Date(date).toLocaleDateString();
}
export default getDate;