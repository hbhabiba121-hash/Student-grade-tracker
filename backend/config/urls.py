from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from classes.views import ClassViewSet
from students.views import StudentViewSet
from subjects.views import SubjectViewSet
from grades.views import GradeViewSet

router = DefaultRouter()
router.register(r'classes', ClassViewSet, basename='SchoolClass')
router.register(r'students', StudentViewSet, basename='Student')
router.register(r'subjects', SubjectViewSet, basename='Subject')
router.register(r'grades', GradeViewSet, basename='Grade')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]