from django.shortcuts import render

# Create your views here.
# data_processing/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
import pandas as pd
from .utils.infer_data_types import infer_and_convert_data_types
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

@csrf_exempt
def upload(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Request method must be POST'}, status=400)

    if 'file' not in request.FILES:
        return JsonResponse({'error': 'File not found in request'}, status=400)

    file = request.FILES['file']
    try:
        # 读取上传的文件为 DataFrame
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            return JsonResponse({'error': 'Unsupported file type'}, status=400)

        # 调用数据类型推断函数
        processed_df = infer_and_convert_data_types(df)

        # 将 DataFrame 转换为 JSON 格式的数据
        data = processed_df.to_dict(orient='records')

        # 获取每一列的推断数据类型
        data_types = processed_df.dtypes.apply(lambda x: str(x)).to_dict()

        # 返回包含数据和数据类型的响应
        return JsonResponse({
            'data': data,
            'data_types': data_types
        }, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already exists'}, status=400)
    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key}, status=200)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout(request):
    token = request.auth
    if token:
        token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)