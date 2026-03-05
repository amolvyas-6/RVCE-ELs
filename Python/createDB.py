from skyfield.api import load
import csv


ts = load.timescale()

planets = load('de421.bsp')  # ephemerides DE421

def calc_distance(earth):
    f =  open('Planet Distances.csv', 'a')
    writer = csv.writer(f)
    row = []
    days = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31}
    Mercury = planets['Mercury']
    Venus = planets['Venus']
    Mars = planets['Mars']
    for year in range(2000, 2030):
        for month in range(1,13):
            for day in range(1, days[month]+1):
                row = []
                row.append(str(day)+'/'+str(month)+'/'+str(year))
                t = ts.utc(year, month, day)
                d = earth.at(t).observe(Mercury).apparent().distance()
                row.append(d.au)
                d = earth.at(t).observe(Venus).apparent().distance()
                row.append(d.au)
                d = earth.at(t).observe(Mars).apparent().distance()
                row.append(d.au)
                
                d = Mars.at(t).observe(Mercury).apparent().distance()
                row.append(d.au)
                d = Mars.at(t).observe(Venus).apparent().distance()
                row.append(d.au)
                d = Mars.at(t).observe(earth).apparent().distance()
                row.append(d.au)
                
                d = Venus.at(t).observe(Mercury).apparent().distance()
                row.append(d.au)
                d = Venus.at(t).observe(earth).apparent().distance()
                row.append(d.au)
                d = Venus.at(t).observe(Mars).apparent().distance()
                row.append(d.au)
                
                d = Mercury.at(t).observe(earth).apparent().distance()
                row.append(d.au)
                d = Mercury.at(t).observe(Venus).apparent().distance()
                row.append(d.au)
                d = Mercury.at(t).observe(Mars).apparent().distance()
                row.append(d.au)

                writer.writerow(row)
    
with open('Planet Distances.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(('Dates','E_Mercury','E_Venus','E_Mars','M_Mercury','M_Venus','M_Earth','V_Mercury','V_Earth','V_Mars','Me_Earth','Me_Venus','Me_Mars'))

earth = planets['Earth']
Mercury = planets['Mercury']
Venus = planets['Venus']
Mars = planets['Mars']
#start_year = int(input('Enter the Start Year:'))
calc_distance(earth)
#print(type('{:4e}'.format(earth.at(ts.utc(2005,1,1)).observe(planets['Mars']).apparent().distance().km)))
