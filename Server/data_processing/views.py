from django.shortcuts import render

# Create your views here.
# data_processing/views.py
from django.http import JsonResponse
from .utils.infer_data_types4 import infer_and_convert_data_types
import pandas as pd

def upload_and_infer(request):
    if request.method == 'POST' and request.FILES.get('file'):
        # 读取上传的文件
        file = request.FILES['file']
        df = pd.read_csv('/Users/duanlin/Desktop/contract_Job/Rhombus_AI/Server/data_processing/utils/sample_data.csv') # 假设上传的是 CSV 文件

        # 调用 infer_data_types 函数处理数据
        processed_df = infer_and_convert_data_types(df)

        # 返回处理结果的示例，实际可以根据需求格式化
        data = processed_df.to_dict()
        return JsonResponse(data)
    return JsonResponse({'error': 'Invalid request'}, status=400)
