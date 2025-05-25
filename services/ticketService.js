// services/ticketService.js
function generateTicketNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
    const randomDigit = () => Math.floor(Math.random() * 10);

    // Format: A544L9
    return `${randomLetter()}${randomDigit()}${randomDigit()}${randomDigit()}${randomLetter()}${randomDigit()}`;
}

function getCurrentDate() {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 8); // HH:MM:SS
}

module.exports = {
    generateTicketNumber,
    getCurrentDate,
    getCurrentTime
};
