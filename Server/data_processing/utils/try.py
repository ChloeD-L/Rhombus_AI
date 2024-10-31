import numpy as np

list = np.random.choice(['A', 'B', 'C', 'D', 'F'], size=1000)
unique_count = len(np.unique(list))
ratio = unique_count / len(list)

print("Unique count:", unique_count)
print("Ratio:", ratio)