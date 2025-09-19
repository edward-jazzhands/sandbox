"""
1 Jan 1900 was a Monday.
Thirty days has September,
April, June and November.
All the rest have thirty-one,
Saving February alone,
Which has twenty-eight, rain or shine.
And on leap years, twenty-nine.
A leap year occurs on any year evenly divisible by 4, but not on a century
unless it is divisible by 400.

How many Sundays fell on the first of the month during the twentieth century
(1 Jan 1901 to 31 Dec 2000)?
"""

months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

def is_leap_year(year: int) -> bool:
    return True if (year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)) else False

# Jan 1 1901 was a Tuesday
day_of_week_counter = 1   # 0 = monday, 1 = tuesday
sundays_on_first = 0

for year in range(1901, 2001):
    
    leap_year = is_leap_year(year)
    for month in range((len(months))):
        
        if month == 1 and leap_year:
            days_in_month = 29
        else:
            days_in_month = months[month]
        
        for day in range(1, days_in_month+1):
            if day_of_week_counter == 6:  # 6 = sunday
                if day == 1:
                    sundays_on_first += 1
                day_of_week_counter = 0
            else:
                day_of_week_counter += 1
            
print(f"Total sundays on first: {sundays_on_first}")
    
    
    
        
