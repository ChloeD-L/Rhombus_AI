# data_processing/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload_and_infer/', views.upload_and_infer, name='upload_and_infer'),
]
