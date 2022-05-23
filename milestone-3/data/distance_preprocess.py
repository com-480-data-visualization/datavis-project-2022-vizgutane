import pandas as pd
import json
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv('./yummly28k2.csv')

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)

dataset = {}

for index, row in df.iterrows():
    try:
        flavors = json.loads(row['flavors'])
        cuisines = json.loads(row['cuisine'])
    
        for cuisine in cuisines:
            if cuisine == 'Kid-Friendly' or cuisine == 'Asian':
                continue
            
            for flavor, flavour_value in flavors.items(): 
                if dataset.get(cuisine, {}).get(flavor) == None:
                    if dataset.get(cuisine) == None:
                        dataset[cuisine] = {}
                    dataset[cuisine][flavor] = 0

                dataset[cuisine][flavor] += flavour_value
            if dataset.get(cuisine, {}).get("count") == None:
                dataset[cuisine]["count"] = 0

            dataset[cuisine]["count"] += 1    
    except:
        pass

# Normalization 
for cuisine, cuisine_values in dataset.items():
    for item_name, item_value in cuisine_values.items():
        dataset[cuisine][item_name] =  dataset[cuisine][item_name] / dataset[cuisine]["count"]
    
    dataset[cuisine].pop('count', None)

# Euc dist
dataset2 = {}
for cuisine1, cuisine_values1 in dataset.items():
    dataset2[cuisine1] = {}
    for cuisine2, cuisine_values2 in dataset.items():
        dist = 0
        for flavor, flavour_value in cuisine_values2.items():
            dist += (cuisine_values1[flavor] - cuisine_values2[flavor])**2
        dist = np.sqrt(dist)

        dataset2[cuisine1][cuisine2] = dist

df4 = pd.DataFrame.from_dict(dataset2)
df4.to_csv('cuisine_distance_matrix.csv')
            
