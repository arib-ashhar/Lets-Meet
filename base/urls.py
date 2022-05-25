from django.urls import path
from . import views

urlpatterns = [
    path('', views.join),
    path('lets_meet/', views.meet),
]