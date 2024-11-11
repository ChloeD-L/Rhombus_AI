from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.response import Response
import pandas as pd
from .utils.infer_data_types import infer_and_convert_data_types

# View for handling file upload
@csrf_exempt
def upload(request):
    # Only allow POST requests
    if request.method != 'POST':
        return JsonResponse({'error': 'Request method must be POST'}, status=400)

    # Check if file is included in the request
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'File not found in request'}, status=400)

    file = request.FILES['file']
    try:
        # Read the uploaded file into a DataFrame
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            return JsonResponse({'error': 'Unsupported file type'}, status=400)

        # Process the DataFrame using the data type inference function
        processed_df = infer_and_convert_data_types(df)

        # Convert the processed DataFrame to JSON format
        data = processed_df.to_dict(orient='records')

        # Get inferred data types for each column
        data_types = processed_df.dtypes.apply(lambda x: str(x)).to_dict()

        # Return the data and inferred data types as JSON response
        return JsonResponse({
            'data': data,
            'data_types': data_types
        }, safe=False)

    # Handle any exceptions during the process
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# API endpoint for user registration
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Check if the username already exists
    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already exists'}, status=400)

    # Create a new user and generate an authentication token
    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)

# API endpoint for user login
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Authenticate the user with provided credentials
    user = authenticate(username=username, password=password)
    if user:
        # Generate or get the existing token for the user
        token, _ = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key}, status=200)

    # Return error if credentials are invalid
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# API endpoint for user logout
@api_view(['POST'])
def logout(request):
    token = request.auth

    # Check if the token is valid and delete it
    if token:
        token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

    # Return error if the token is invalid
    return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
