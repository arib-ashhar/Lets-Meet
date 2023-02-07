from django.urls import path
from . import views

urlpatterns = [
    path('', views.join),
    path('lets_meet/', views.meet),
    path('get_token/', views.getToken),
    path('create_member/', views.createMeetMember),
    path('get_member/',views.getMeetMember),
    path('delete_member/',views.deleteMeetMember),
]