# data_processing/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload, name='upload'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
]
