import numpy as np
import pandas as pd
from infer_data_types import infer_and_convert_data_types  # 假设你的文件名是 infer_data_types.py
from datetime import datetime, timedelta  # 修改导入

def run_tests():
    # 测试用的小型数据集
    print("Testing with small dataset...")
    small_data = {
        'Name': ['Alice', 'Bob', 'Charlie', 'David'],
        'Birthdate': ['2024-10-30', '2024-11-15', 'Invalid', '2024-12-01'],
        'Score': ['100', '200.5', 'NaN', '300'],
        'Grade': ['A', 'B', 'C', 'A']
    }
    small_df = pd.DataFrame(small_data)
    print("\nSmall Dataset Before Inference:")
    print(small_df.dtypes)
    inferred_small_df = infer_and_convert_data_types(small_df)
    print("\nSmall Dataset After Inference:")
    print(inferred_small_df.dtypes)
    print(inferred_small_df)

    # 测试用的中等数据集
    print("\nTesting with medium dataset...")
    np.random.seed(0)
    medium_data = {
        'Name': [f'Name_{i}' for i in range(100)],
        'Birthdate': [datetime(2020, 1, 1) + timedelta(days=np.random.randint(0, 365)) for _ in range(100)],
        'Score': [np.random.choice([np.random.randint(50, 300), np.nan], p=[0.9, 0.1]) for _ in range(100)],
        'Grade': np.random.choice(['A', 'B', 'C', 'D', 'F'], size=100)
    }
    medium_df = pd.DataFrame(medium_data)
    print("\nMedium Dataset Before Inference:")
    print(medium_df.dtypes)
    inferred_medium_df = infer_and_convert_data_types(medium_df)
    print("\nMedium Dataset After Inference:")
    print(inferred_medium_df.dtypes)
    print(inferred_medium_df)

    # 测试用的大型数据集
    print("\nTesting with large dataset...")
    np.random.seed(1)
    large_data = {
        'Name': [f'Person_{i}' for i in range(1000)],
        'Birthdate': [datetime(2000, 1, 1) + timedelta(days=np.random.randint(0, 7300)) for _ in range(1000)],
        'Score': [np.random.uniform(0, 500) if i % 10 != 0 else np.nan for i in range(1000)],
        'Grade': np.random.choice(['A', 'B', 'C', 'D', 'F'], size=1000),
        'Random_Notes': np.random.choice(['Note 1', 'Note 2', 'Comment', 'Remark', np.nan], size=1000)
    }
    large_df = pd.DataFrame(large_data)
    print("\nLarge Dataset Before Inference:")
    print(large_df.dtypes)
    inferred_large_df = infer_and_convert_data_types(large_df)
    print("\nLarge Dataset After Inference:")
    print(inferred_large_df.dtypes)
    print(inferred_large_df)

if __name__ == "__main__":
    run_tests()
