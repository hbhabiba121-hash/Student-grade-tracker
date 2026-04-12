from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    """Handles all CRUD operations for Student."""
    
    queryset = Student.objects.all().order_by('last_name')
    serializer_class = StudentSerializer