from rest_framework import viewsets
from .models import Class
from .serializers import ClassSerializer

class ClassViewSet(viewsets.ModelViewSet):
    """Handles all CRUD operations for Class."""
    
    queryset = Class.objects.all().order_by('name')
    serializer_class = ClassSerializer