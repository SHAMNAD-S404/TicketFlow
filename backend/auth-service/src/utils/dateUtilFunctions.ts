export function generatesubscriptionEndDate () : string {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 7 );

    const day = String(endDate.getDate()).padStart(2,'0')
    const month = String(endDate.getMonth()).padStart(2,"0")
    const year = String(endDate.getFullYear());

    return `${day}-${month}-${year}`;
}