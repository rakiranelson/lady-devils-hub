export default function getFormattedDate(daysFromToday: number): string {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysFromToday);

    const date = `${(newDate.getMonth() + 1).toString().padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}-${newDate.getFullYear()}`;

    return date
}