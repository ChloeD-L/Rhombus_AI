from django.shortcuts import render

# Create your views here.
# data_processing/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
from .utils.infer_data_types import infer_and_convert_data_types

@csrf_exempt  # 临时用于开发阶段
def upload_and_infer(request):
    if request.method == 'POST' and request.FILES.get('file'):
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

            # 将 DataFrame 转换为 JSON
            data = processed_df.to_dict(orient='records')

            return JsonResponse({'data': data}, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)

