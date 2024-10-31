# %%

import pandas as pd

# Define common date formats
common_date_formats = [
    '%Y-%m-%d',     # 2024-10-30
    '%d/%m/%Y',     # 30/10/2024
    '%m-%d-%Y',     # 10-30-2024
    '%Y/%m/%d',     # 2024/10/30
    '%d-%b-%Y',     # 30-Oct-2024
    '%b %d, %Y',    # Oct 30, 2024
    '%m/%d/%y',     # 10/30/24
]

def infer_date_format(date_str):
    for date_format in common_date_formats:
        try:
            return pd.to_datetime(date_str, format=date_format)
        except ValueError:
            pass
    return None

def infer_and_convert_data_types(df):
    for col in df.columns:
        # Attempt to convert to numeric first
        df_converted = pd.to_numeric(df[col], errors='coerce')
        if not df_converted.isna().all():  # If at least one value is numeric
            df[col] = df_converted
            continue

        # Attempt to convert to datetime
        try:
            df[col] = pd.to_datetime(df[col])
            continue
        except (ValueError, TypeError):
            pass

        # Check if the column should be categorical
        if len(df[col].unique()) / len(df[col]) < 0.5:  # Example threshold for categorization
            df[col] = pd.Categorical(df[col])

    return df

# Test the function with your DataFrame
df = pd.read_csv('sample_data.csv')
print("Data types before inference:")
print(df.dtypes)

df = infer_and_convert_data_types(df)

print("\nData types after inference:")
print(df.dtypes)

# %%
