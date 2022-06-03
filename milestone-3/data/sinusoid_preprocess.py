from cmath import sin
import pandas as pd
import json
import matplotlib.pyplot as plt
import numpy as np
import math

df = pd.read_csv('./milestone-3/data/cuisine_timeseries.csv')
cuisines = df.columns.values.tolist()
del cuisines[0]
for i in range(1,1000):
    variable = math.sin(0.01*i)
    to_append = [str(i)]

    for cuisine in cuisines:
        to_append.append(df[cuisine].values[0] + variable*df[cuisine].values[0]*0.1)
        
    series = pd.Series(to_append, index = df.columns)
    df = df.append(series, ignore_index=True)

#print(df.head(10))    
df.to_csv('./milestone-3/data/out.csv', index=False)