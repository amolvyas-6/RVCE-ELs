import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import date, datetime


LAUNCH_ANGLE = 44.1490  # degree
LAUNCH_DISTANCE = 1.0626  # AU
AU = 1  # AU to Km
PRECISION = 7


df = pd.read_csv('Planet Distances.csv')
df['Dates'] = pd.to_datetime(df['Dates'],format='%d/%m/%Y')  # Convert to datetime type


def distance():
    start_year = int(input('Enter Start year (Upto 2019):'))
    start_index = (start_year - 2000) * 365
    end_index = start_index + 4 * 365 - 1
    target_planet = int(input('Enter the Planet to observe \n1.Earth \n2.Mars \n3.Venus \n4.Mercury \n'))
    avgDistanceArray = {}
    leastDistanceArray = {}
    avgTimeArray = {}
    print()

    def leastDistance(planet):
        i = planet.idxmin()
        minimum = round(planet.min(), PRECISION)
        return str(minimum) + ' AU on ' + str(dates[i])

    def averageClosestApproach(planet):
        
        minima_indices = (planet.diff() >= 0) & (planet.shift(-1).diff() <= 0)

        # Calculate time differences between consecutive minima
        minima_times = df['Dates'][minima_indices]
        time_intervals = np.diff(minima_times).astype('timedelta64[D]').astype(int)

        # Calculate the  average of time intervals
        mean_interval = np.mean(time_intervals)
        return round(mean_interval)


    dates = df.loc[start_index:end_index, 'Dates']
    if target_planet == 1:
        planet1 = df.loc[start_index:end_index, 'E_Mercury']
        planet2 = df.loc[start_index:end_index, 'E_Venus']
        planet3 = df.loc[start_index:end_index, 'E_Mars']

        fig, ax = plt.subplots(2,2)
        x = df.loc[start_index:end_index, ['Dates']]
        y1 = df.loc[start_index:end_index, ['E_Mercury']]
        y2 = df.loc[start_index:end_index, ['E_Venus']]
        y3 = df.loc[start_index:end_index, ['E_Mars']]
        y4 = df.loc[start_index:end_index, ['E_Mercury','E_Venus','E_Mars']]
        
        ax[0,0].plot(x, y1)
        ax[0,1].plot(x, y2, color = 'sandybrown')
        ax[1,0].plot(x, y3, color = 'green')
        ax[1,1].plot(x, y4)

        ax[0,0].set_ylabel('Distance in AU')
        ax[0,1].set_ylabel('Distance in AU')
        ax[1,0].set_ylabel('Distance in AU')
        ax[1,1].set_ylabel('Distance in AU')

        ax[0,0].set_title('Distance between Earth and Mercury')
        ax[0,1].set_title('Distance between Earth and Venus')
        ax[1,0].set_title('Distance between Earth and Mars')

        plt.show()


        print('Average distance between Earth and Mercury =', round(planet1.mean(), PRECISION), 'AU')
        print('Average distance between Earth and Venus =', round(planet2.mean(), PRECISION), 'AU')
        print('Average distance between Earth and Mars =', round(planet3.mean(),PRECISION), 'AU')
        avgDistanceArray['Mercury'] = round(planet1.mean(), PRECISION)
        avgDistanceArray['Venus'] = round(planet2.mean(), PRECISION)
        avgDistanceArray['Mars'] = round(planet3.mean(), PRECISION)

        print()

        print('Least Distance between Earth and Mercury was', leastDistance(planet1))
        print('Least Distance between Earth and Venus was', leastDistance(planet2))
        print('Least Distance between Earth and Mars was', leastDistance(planet3))
        leastDistanceArray['Mercury'] = round(planet1.min(), PRECISION)
        leastDistanceArray['Venus'] = round(planet2.min(), PRECISION)
        leastDistanceArray['Mars'] = round(planet3.min(), PRECISION)

        print()
        print('Average Time of Closest Approach between Earth and Mercury is :',averageClosestApproach(df['E_Mercury']), 'days')
        print('Average Time of Closest Approach between Earth and Venus is :',averageClosestApproach(df['E_Venus']), 'days')
        print('Average Time of Closest Approach between Earth and Mars is :',averageClosestApproach(df['E_Mars']), 'days')
        avgTimeArray['Mercury'] = averageClosestApproach(df['E_Mercury'])
        avgTimeArray['Venus'] = averageClosestApproach(df['E_Venus'])
        avgTimeArray['Mars'] = averageClosestApproach(df['E_Mars'])

    elif target_planet == 2:
        planet1 = df.loc[start_index:end_index, 'M_Mercury']
        planet2 = df.loc[start_index:end_index, 'M_Venus']
        planet3 = df.loc[start_index:end_index, 'M_Earth']
        
        fig, ax = plt.subplots(2,2)
        x = df.loc[start_index:end_index, ['Dates']]
        y1 = df.loc[start_index:end_index, ['M_Mercury']]
        y2 = df.loc[start_index:end_index, ['M_Venus']]
        y3 = df.loc[start_index:end_index, ['M_Earth']]
        y4 = df.loc[start_index:end_index, ['M_Mercury','M_Venus','M_Earth']]
        
        ax[0,0].plot(x, y1)
        ax[0,1].plot(x, y2, color = 'sandybrown')
        ax[1,0].plot(x, y3, color = 'green')
        ax[1,1].plot(x, y4)

        ax[0,0].set_ylabel('Distance in AU')
        ax[0,1].set_ylabel('Distance in AU')
        ax[1,0].set_ylabel('Distance in AU')
        ax[1,1].set_ylabel('Distance in AU')


        ax[0,0].set_title('Distance between Mars and Mercury')
        ax[0,1].set_title('Distance between Mars and Venus')
        ax[1,0].set_title('Distance between Mars and Earth')

        plt.show()

        print('Average distance between Mars and Mercury =',round(planet1.mean(), PRECISION), 'AU' )
        print('Average distance between Mars and Venus =', round(planet2.mean(), PRECISION), 'AU')
        print('Average distance between Mars and Earth =', round(planet3.mean(),PRECISION), 'AU')
        avgDistanceArray['Mercury'] = round(planet1.mean(), PRECISION)
        avgDistanceArray['Venus'] = round(planet2.mean(), PRECISION)
        avgDistanceArray['Earth'] = round(planet3.mean(), PRECISION)

        print()
        
        print('Least Distance between Mars and Mercury was', leastDistance(planet1))
        print('Least Distance between Mars and Venus was', leastDistance(planet2))
        print('Least Distance between Mars and Earth was', leastDistance(planet3))
        leastDistanceArray['Mercury'] = round(planet1.min(), PRECISION)
        leastDistanceArray['Venus'] = round(planet2.min(), PRECISION)
        leastDistanceArray['Earth'] = round(planet3.min(), PRECISION)

        print()
        print('Average Time of Closest Approach between Mars and Mercury is :',averageClosestApproach(df['M_Mercury']), 'days')
        print('Average Time of Closest Approach between Mars and Venus is :',averageClosestApproach(df['M_Venus']), 'days')
        print('Average Time of Closest Approach between Mars and Earth is :',averageClosestApproach(df['M_Earth']), 'days')
        avgTimeArray['Mercury'] = averageClosestApproach(df['M_Mercury'])
        avgTimeArray['Venus'] = averageClosestApproach(df['M_Venus'])
        avgTimeArray['Earth'] = averageClosestApproach(df['M_Earth'])

    
    elif target_planet == 3:
        planet1 = df.loc[start_index:end_index, 'V_Mercury']
        planet2 = df.loc[start_index:end_index, 'V_Earth']
        planet3 = df.loc[start_index:end_index, 'V_Mars']
        
        fig, ax = plt.subplots(2,2)
        x = df.loc[start_index:end_index, ['Dates']]
        y1 = df.loc[start_index:end_index, ['V_Mercury']]
        y2 = df.loc[start_index:end_index, ['V_Earth']]
        y3 = df.loc[start_index:end_index, ['V_Mars']]
        y4 = df.loc[start_index:end_index, ['V_Mercury','V_Earth','V_Mars']]
        
        ax[0,0].plot(x, y1)
        ax[0,1].plot(x, y2, color = 'sandybrown')
        ax[1,0].plot(x, y3, color = 'green')
        ax[1,1].plot(x, y4)

        ax[0,0].set_ylabel('Distance in AU')
        ax[0,1].set_ylabel('Distance in AU')
        ax[1,0].set_ylabel('Distance in AU')
        ax[1,1].set_ylabel('Distance in AU')


        ax[0,0].set_title('Distance between Venus and Mercury')
        ax[0,1].set_title('Distance between Venus and Earth')
        ax[1,0].set_title('Distance between Venus and Mars')

        plt.show()

        print('Average distance between Venus and Mercury =', round(planet1.mean(), PRECISION), 'AU')
        print('Average distance between Venus and Earth =', round(planet2.mean(),PRECISION), 'AU')
        print('Average distance between Venus and Mars =', round(planet3.mean(),PRECISION))
        avgDistanceArray['Mercury'] = round(planet1.mean(), PRECISION)
        avgDistanceArray['Earth'] = round(planet2.mean(), PRECISION)
        avgDistanceArray['Mars'] = round(planet3.mean(), PRECISION)

        print()

        print('Least Distance between Venus and Mercury was', leastDistance(planet1), 'AU')
        print('Least Distance between Venus and Earth was', leastDistance(planet2), 'AU')
        print('Least Distance between Venus and Mars was', leastDistance(planet3), 'AU')
        leastDistanceArray['Mercury'] = round(planet1.min(), PRECISION)
        leastDistanceArray['Earth'] = round(planet2.min(), PRECISION)
        leastDistanceArray['Mars'] = round(planet3.min(), PRECISION)

        print()
        print('Average Time of Closest Approach between Venus and Mercury is :',averageClosestApproach(df['V_Mercury']), 'days')
        print('Average Time of Closest Approach between Venus and Earth is :',averageClosestApproach(df['V_Earth']), 'days')
        print('Average Time of Closest Approach between Venus and Mars is :',averageClosestApproach(df['V_Mars']), 'days')
        avgTimeArray['Mercury'] = averageClosestApproach(df['V_Mercury'])
        avgTimeArray['Earth'] = averageClosestApproach(df['V_Earth'])
        avgTimeArray['Mars'] = averageClosestApproach(df['V_Mars'])
        

    
    elif target_planet == 4:
        planet1 = df.loc[start_index:end_index, 'Me_Earth']
        planet2 = df.loc[start_index:end_index, 'Me_Venus']
        planet3 = df.loc[start_index:end_index, 'Me_Mars']
        
        fig, ax = plt.subplots(2,2)
        x = df.loc[start_index:end_index, ['Dates']]
        y1 = df.loc[start_index:end_index, ['Me_Earth']]
        y2 = df.loc[start_index:end_index, ['Me_Venus']]
        y3 = df.loc[start_index:end_index, ['Me_Mars']]
        y4 = df.loc[start_index:end_index, ['Me_Earth','Me_Venus','Me_Mars']]
        
        ax[0,0].plot(x, y1)
        ax[0,1].plot(x, y2, color = 'sandybrown')
        ax[1,0].plot(x, y3, color = 'green')
        ax[1,1].plot(x, y4)

        ax[0,0].set_ylabel('Distance in AU')
        ax[0,1].set_ylabel('Distance in AU')
        ax[1,0].set_ylabel('Distance in AU')
        ax[1,1].set_ylabel('Distance in AU')


        ax[0,0].set_title('Distance between Mercury and Earth')
        ax[0,1].set_title('Distance between Mercury and Venus')
        ax[1,0].set_title('Distance between Mercury and Mars')

        plt.show()

        print('Average distance between Mercury and Earth =', round(planet1.mean(), PRECISION), 'AU')
        print('Average distance between Mercury and Venus =', round(planet2.mean(),PRECISION), 'AU')
        print('Average distance between Mecury and Mars =', round(planet3.mean(),PRECISION), 'AU')
        avgDistanceArray['Earth'] = round(planet1.mean(), PRECISION)
        avgDistanceArray['Venus'] = round(planet2.mean(), PRECISION)
        avgDistanceArray['Mars'] = round(planet3.mean(), PRECISION)

        print()

        print('Least Distance between Mercury and Earth was', leastDistance(planet1))
        print('Least Distance between Mercury and Venus was', leastDistance(planet2))
        print('Least Distance between Mercury and Mars was', leastDistance(planet3))
        leastDistanceArray['Earth'] = round(planet1.min(), PRECISION)
        leastDistanceArray['Venus'] = round(planet2.min(), PRECISION)
        leastDistanceArray['Mars'] = round(planet3.min(), PRECISION)

        print()
        print('Average Time of Closest Approach between Mercury and Earth is :',averageClosestApproach(df['Me_Earth']), 'days')
        print('Average Time of Closest Approach between Mercury and Venus is :',averageClosestApproach(df['Me_Venus']), 'days')
        print('Average Time of Closest Approach between Mercury and Mars is :',averageClosestApproach(df['Me_Mars']), 'days')
        avgTimeArray['Earth'] = averageClosestApproach(df['Me_Earth'])
        avgTimeArray['Venus'] = averageClosestApproach(df['Me_Venus'])
        avgTimeArray['Mars'] = averageClosestApproach(df['Me_Mars'])


    print('--------------------------------------------------------------------------------------')
    print()
    

    x_pos = [0,1,2]
    x = list(avgDistanceArray.keys())
    leastDist = list(leastDistanceArray.values())
    avgTime = list(avgTimeArray.values())
    avgDistance = list(avgDistanceArray.values())

    
    fig, ax = plt.subplots(1,2)

    # Plot the line graph
    ax[0].plot(x, avgDistance, color='red', label='Avg Distance', marker = 'o')

    # Create a bar graph on a secondary y-axis
    ax2 = ax[0].twinx()
    ax2.bar(x, leastDist, alpha=0.5, label='Least Distance')

    # Set labels and title
    ax[0].set_xlabel('Planet')
    ax[0].set_ylabel('Distance')
    ax2.set_ylabel('Distance')

    ax[0].legend(loc = 'upper left')
    ax2.legend(loc = 'upper right')

    ax[1].plot(x,avgTime, marker = 'o')
    ax[1].set_ylabel('Number of Days')
    ax[1].set_title('Average Time for Closest Approach')
    # Show the plot
    plt.show()

def nextLaunchWindow():
    year = int(input('Enter year after which launch should occur (upto 2028):'))
    start = int((year-2000)*365.25)
    data = df.loc[start:, ['Dates','E_Mars']]
    dates = data.loc[:, 'Dates']
    distances = data.loc[:, 'E_Mars']
    validDates = []
    
    for i in range(start, len(df['Dates'])):
        if abs(distances[i] - LAUNCH_DISTANCE)/distances[i] <= 0.001:
            validDates.append(dates[i])
    
    print('\nThe dates on which a satellite can be launched to Mars are:\n')
    for i in validDates:
        print(i)
    print('--------------------------------------------------------------------------------------')
    print()


def dateOfClosestApproach():
    today = pd.to_datetime(date.today())
    delta = today - datetime(2000,1,1)

    p1 = {1:'Me', 2:'V', 3:'E', 4:'M'}
    p2 = {1:'Mercury', 2:'Venus', 3:'Earth', 4:'Mars'}
    print('1.Mercury\n2:Venus\n3:Earth\n4:Mars\n')
    n1 = int(input('Enter 1st planet:'))
    n2 = int(input('Enter 2nd planet:'))
    if n1 == n2:
        print('ERROR!!\nBoth planets cannot be the same!!')
        return
    dist = p1[n1]+'_'+p2[n2]
    
    filtered_df = df[df['Dates'] > today]
    minima_indices = np.argwhere((filtered_df[dist].values[:-2] > filtered_df[dist].values[1:-1]) & (filtered_df[dist].values[1:-1] < filtered_df[dist].values[2:])) + 1
    next_date_local_min = filtered_df.loc[minima_indices[0].item() + delta.days, 'Dates']

    print("Next date of closest approach", next_date_local_min)

while True:
    print('1.Distance between planets')
    print('2.Next Launch Window to launch rocket to Mars')
    print('3.Next Date of closest distance of approach between 2 planets')
    print('4.Exit')
    choice = int(input('Enter your choice:'))
    print('--------------------------------------------------------------------------------------')

    if choice == 1:
        distance()
    
    elif choice == 2:
        nextLaunchWindow()
    
    elif choice == 3:
        dateOfClosestApproach()
    
    else:
        print('Exiting...')
        break