from django.urls import path
from . import views

urlpatterns = [
    path('active.html', views.active, name="active"),
    path('add/', views.add, name="add"),
    path('add/addrecord/', views.addrecord, name='addrecord'),
    path('department.html', views.department, name="department"),
    path('edit.html', views.edit, name="edit"),
    path('home.html', views.home, name="home"),
    path('', views.project_homepage, name="project_homepage"),
    path('search.html', views.search, name="search"),
    path('delete/<int:id>', views.delete, name='delete'),
]
