# %%

import pandas as pd

# List of common date formats to attempt when parsing datetime columns
common_date_formats = [
    '%Y-%m-%d',     # Format: 2024-10-30
    '%d/%m/%Y',     # Format: 30/10/2024
    '%m-%d-%Y',     # Format: 10-30-2024
    '%Y/%m/%d',     # Format: 2024/10/30
    '%d-%b-%Y',     # Format: 30-Oct-2024
    '%b %d, %Y',    # Format: Oct 30, 2024
    '%Y年%m月%d日',  # Non-standard format: 2024年10月30日
    '%m/%d/%y',     # Format: 10/30/24
    # Additional formats can be added as needed
]

# Allowed data types for user-specified conversions
ALLOWED_TYPES = {
    'int', 'int32', 'int64', 'float', 'float32', 'float64', 'datetime', 'bool', 'category', 'object', 'complex'
}

def convert_to_datetime_with_formats(series):
    """
    Attempts to convert a Series to datetime format using a list of common date formats.

    Args:
    - series (pd.Series): The column data to be converted.

    Returns:
    - pd.Series: The converted Series with datetime type if successful, or with NaT for unparseable values.
    """
    for date_format in common_date_formats:
        try:
            # Try parsing the series with the current date format
            converted_series = pd.to_datetime(series, format=date_format, errors='coerce')
            if converted_series.notna().sum() > 0:  # Check if any values were successfully converted
                return converted_series
        except Exception:
            continue  # If parsing fails, move to the next format
    # Fallback to automatic parsing if all specified formats fail
    return pd.to_datetime(series, errors='coerce')

def infer_and_convert_data_types(df, column_types=None, threshold=0.8, chunk_size=1000):
    """
    Infers and converts data types for columns in a DataFrame, suitable for large datasets.

    Args:
    - df (pd.DataFrame): The DataFrame to be processed.
    - column_types (dict, optional): A dictionary specifying user-defined types for columns. Format: {'col_name': 'type' or {'type': 'datetime', 'format': '%Y-%m-%d'}}
    - threshold (float, optional): The minimum proportion of valid numeric values required to convert a column. Default is 0.8.
    - chunk_size (int, optional): The size of data chunks to process at a time to reduce memory usage. Default is 1000.

    Returns:
    - pd.DataFrame: The DataFrame with inferred and converted data types.
    """
    # Apply user-specified data types first
    if column_types:
        for col, dtype in column_types.items():
            if isinstance(dtype, dict) and dtype.get('type') == 'datetime':
                # Handle datetime conversion with a user-specified format
                date_format = dtype.get('format', None)
                try:
                    df[col] = pd.to_datetime(df[col], format=date_format, errors='coerce')
                    print(f"Column '{col}' converted to datetime with format '{date_format}'.")
                except Exception as e:
                    # Fallback to object type if conversion fails
                    print(f"Could not convert column '{col}' to datetime with format '{date_format}': {e}")
                    df[col] = df[col].astype('object')
            elif dtype == 'complex':
                # Attempt to convert the column to a complex type
                try:
                    df[col] = df[col].astype('complex')
                except Exception as e:
                    print(f"Could not convert column '{col}' to complex: {e}")
                    df[col] = df[col].astype('object')
            elif dtype in ALLOWED_TYPES:
                # Convert the column to any allowed user-specified type
                try:
                    df[col] = df[col].astype(dtype)
                except Exception as e:
                    print(f"Could not convert column '{col}' to '{dtype}': {e}")
                    df[col] = df[col].astype('object')

    # Automatically infer types for columns not specified by the user
    for col in df.columns:
        if column_types and col in column_types:
            continue  # Skip columns that have already been converted based on user input

        # Process the column in chunks to minimize memory usage
        for start in range(0, len(df), chunk_size):
            chunk = df[col].iloc[start:start + chunk_size]

            # Attempt to convert the chunk to a numeric type
            numeric_data = pd.to_numeric(chunk, errors='coerce')
            if numeric_data.notna().sum() / len(chunk) >= threshold:
                # Determine if numeric values are integers and assign the appropriate type
                if numeric_data.dropna().apply(float.is_integer).all():
                    max_val = numeric_data.max()
                    min_val = numeric_data.min()
                    # Assign the smallest suitable integer type
                    if min_val >= -128 and max_val <= 127:
                        df[col].iloc[start:start + chunk_size] = numeric_data.astype('int8')
                    elif min_val >= -32768 and max_val <= 32767:
                        df[col].iloc[start:start + chunk_size] = numeric_data.astype('int16')
                    elif min_val >= -2147483648 and max_val <= 2147483647:
                        df[col].iloc[start:start + chunk_size] = numeric_data.astype('int32')
                    else:
                        df[col].iloc[start:start + chunk_size] = numeric_data.astype('int64')
                else:
                    # Assign float type based on the range of values
                    if numeric_data.max() < 3.4e38 and numeric_data.min() > -3.4e38:
                        df[col].iloc[start:start + chunk_size] = numeric_data.astype('float32')
                    else:
                        df[col].iloc[start:start + chunk_size] = numeric_data.astype('float64')
                continue

            # Check if the chunk can be converted to a complex type
            try:
                complex_data = chunk.astype('complex')
                if complex_data.notna().sum() > 0:
                    df[col].iloc[start:start + chunk_size] = complex_data
                    continue
            except ValueError:
                pass  # Not a complex type, continue with other type checks

            # Attempt to convert the chunk to datetime format
            datetime_data = convert_to_datetime_with_formats(chunk)
            if datetime_data.notna().sum() > 0:
                df[col].iloc[start:start + chunk_size] = datetime_data
                continue

            # Check if the chunk qualifies as a category type based on unique value ratio
            unique_ratio = chunk.nunique() / len(chunk)
            if unique_ratio < 0.1:  # If a small proportion of unique values
                df[col].iloc[start:start + chunk_size] = chunk.astype('category')
            else:
                # Default to object type for columns that don't match other types
                df[col].iloc[start:start + chunk_size] = chunk.astype('object')

    return df


# Test the function with your DataFrame
df = pd.read_csv('sample_data.csv')
print("Data types before inference:")
print(df.dtypes)

df = infer_and_convert_data_types(df)

print("\nData types after inference:")
print(df.dtypes)

# %%
