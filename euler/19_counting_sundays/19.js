
// 1 Jan 1900 was a Monday.
// Thirty days has September,
// April, June and November.
// All the rest have thirty-one,
// Saving February alone,
// Which has twenty-eight, rain or shine.
// And on leap years, twenty-nine.
// A leap year occurs on any year evenly divisible by 4, but not on a century
// unless it is divisible by 400.

// How many Sundays fell on the first of the month during the twentieth century
// (1 Jan 1901 to 31 Dec 2000)?

const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isLeapYear(year) {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

// Jan 1 1901 was a Tuesday
let day_of_week_counter = 1;  // 0 = monday, 1 = tuesday
let sundays_on_first = 0;

for (let year = 1901; year < 2001; year++) {

    const leap_year = isLeapYear(year);
    
    for (let month = 0; month < 12; month++) {        

        const days_in_month = (month === 1 && leap_year === true) ? 29 : months[month];

        for (let day = 1; day < (days_in_month+1); day++) {
            // 6 == sunday
            
            if (day_of_week_counter === 6) {
                if (day === 1) {
                    sundays_on_first++;
                    console.log(`Found sunday on first`);
                };
                day_of_week_counter = 0;
            } else {
                day_of_week_counter++;
            }
        }
    }
}
console.log(`Total sundays on first: ${sundays_on_first}`)
    
    
    
        
