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
    # Add more formats as needed
]

ALLOWED_TYPES = {
    'int', 'int32', 'int64', 'float', 'float32', 'float64', 'datetime', 'bool', 'category', 'object'
}

def convert_to_datetime_with_formats(series):
    """
    Tries to convert a Series to datetime format using a list of common date formats.

    Args:
    - series (pd.Series): The column data to be converted.

    Returns:
    - pd.Series: The converted Series with datetime type if successful, or with NaT for unparseable values.
    """
    for date_format in common_date_formats:
        try:
            converted_series = pd.to_datetime(series, format=date_format, errors='coerce')
            if converted_series.notna().sum() > 0:  # Check if any values were successfully parsed
                return converted_series
        except Exception:
            continue  # Try the next format
    # Fallback to automatic parsing if all specified formats fail
    return pd.to_datetime(series, errors='coerce')

def infer_and_convert_data_types(df, column_types=None, threshold=0.5, chunk_size=1000):
    """
    Infers and converts data types for columns in a DataFrame, suitable for large datasets.

    Args:
    - df (pd.DataFrame): The DataFrame to be processed.
    - column_types (dict, optional): A dictionary specifying user-defined types for columns.
    - threshold (float, optional): The minimum proportion of valid numeric values required to convert a column.
    - chunk_size (int, optional): The size of data chunks to process at a time to reduce memory usage.

    Returns:
    - pd.DataFrame: The DataFrame with inferred and converted data types.
    """
    # Apply user-specified data types first
    if column_types:
        for col, dtype in column_types.items():
            if isinstance(dtype, dict) and dtype.get('type') == 'datetime':
                date_format = dtype.get('format', None)
                try:
                    df[col] = pd.to_datetime(df[col], format=date_format, errors='coerce')
                    print(f"Column '{col}' converted to datetime with format '{date_format}'.")
                except Exception as e:
                    print(f"Could not convert column '{col}' to datetime with format '{date_format}': {e}")
                    df[col] = df[col].astype('object')
            elif dtype in ALLOWED_TYPES:
                try:
                    df[col] = df[col].astype(dtype)
                except Exception as e:
                    print(f"Could not convert column '{col}' to '{dtype}': {e}")
                    df[col] = df[col].astype('object')

    # Automatically infer types for columns not specified by the user
    for col in df.columns:
        if column_types and col in column_types:
            continue

        # Check if chunking is necessary
        if len(df) > chunk_size:
            for start in range(0, len(df), chunk_size):
                chunk = df.loc[start:start + chunk_size, col]

                # Attempt to convert to numeric type
                numeric_data = pd.to_numeric(chunk, errors='coerce')
                if numeric_data.notna().sum() / len(chunk) >= threshold:
                    if numeric_data.dropna().apply(lambda x: isinstance(x, float) and x.is_integer()).all():
                        numeric_data = numeric_data.fillna(0)
                        max_val = numeric_data.max()
                        min_val = numeric_data.min()
                        if min_val >= -128 and max_val <= 127:
                            df.loc[start:start + chunk_size, col] = numeric_data.astype('int8')
                        elif min_val >= -32768 and max_val <= 32767:
                            df.loc[start:start + chunk_size, col] = numeric_data.astype('int16')
                        elif min_val >= -2147483648 and max_val <= 2147483647:
                            df.loc[start:start + chunk_size, col] = numeric_data.astype('int32')
                        else:
                            df.loc[start:start + chunk_size, col] = numeric_data.astype('int64')
                    else:
                        if numeric_data.max() < 3.4e38 and numeric_data.min() > -3.4e38:
                            df.loc[start:start + chunk_size, col] = numeric_data.astype('float32')
                        else:
                            df.loc[start:start + chunk_size, col] = numeric_data.astype('float64')
                    continue

                # Attempt to convert to datetime type
                datetime_data = convert_to_datetime_with_formats(chunk)
                if datetime_data.notna().sum() > 0:
                    df.loc[start:start + chunk_size, col] = datetime_data
                    continue

                # Check if column qualifies as category type
                unique_ratio = chunk.nunique() / len(chunk)
                if unique_ratio < 0.1:
                    df.loc[start:start + chunk_size, col] = chunk.astype('category')
                else:
                    df.loc[start:start + chunk_size, col] = chunk.astype('object')
        else:
            # Process the entire column directly if chunking is not needed
            chunk = df[col]

            # Attempt to convert to numeric type
            numeric_data = pd.to_numeric(chunk, errors='coerce')
            if numeric_data.notna().sum() / len(chunk) >= threshold:
                if numeric_data.dropna().apply(lambda x: isinstance(x, (int, float)) and float(x).is_integer()).all():
                    numeric_data = numeric_data.fillna(0)
                    max_val = numeric_data.max()
                    min_val = numeric_data.min()
                    if min_val >= -128 and max_val <= 127:
                        df[col] = numeric_data.astype('int8')
                    elif min_val >= -32768 and max_val <= 32767:
                        df[col] = numeric_data.astype('int16')
                    elif min_val >= -2147483648 and max_val <= 2147483647:
                        df[col] = numeric_data.astype('int32')
                    else:
                        df[col] = numeric_data.astype('int64')
                else:
                    if numeric_data.max() < 3.4e38 and numeric_data.min() > -3.4e38:
                        df[col] = numeric_data.astype('float32')
                    else:
                        df[col] = numeric_data.astype('float64')
                continue

            # Attempt to convert to datetime type
            datetime_data = convert_to_datetime_with_formats(chunk)
            if datetime_data.notna().sum() > 0:
                df[col] = datetime_data
                continue

            # Check if column qualifies as category type
            unique_ratio = chunk.nunique() / len(chunk)
            print(f"Unique ratio for column '{col}': {unique_ratio}")
            if unique_ratio < 0.5:
                df[col] = chunk.astype('category')
            else:
                df[col] = chunk.astype('object')

    return df


# Example test to run the function
# if __name__ == "__main__":
#     data = {
#         'Name': ['Alice', 'Bob', 'Charlie', 'David'],
#         'Birthdate': ['2024-10-30', '2024-11-15', 'invalid date', '2024-12-01'],
#         'Score': ['100', '200.5', 'NaN', '300'],
#         'Grade': ['A', 'B', 'C', 'A']
#     }
#     df = pd.DataFrame(data)

#     print("Data types before inference:")
#     print(df.dtypes)

#     df = infer_and_convert_data_types(df)

#     print("Data types after inference:")
#     print(df.dtypes)
#     print(df)

# Test the function with your DataFrame
# df = pd.read_csv('sample_data.csv')
# print("Data types before inference:")
# print(df.dtypes)

# df = infer_and_convert_data_types(df)

# print("\nData types after inference:")
# print(df.dtypes)