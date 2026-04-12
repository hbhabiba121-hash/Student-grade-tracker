from rest_framework import viewsets
from .models import SchoolClass
from .serializers import ClassSerializer

class ClassViewSet(viewsets.ModelViewSet):
    """Handles all CRUD operations for SchoolClass."""
    
    queryset = SchoolClass.objects.all().order_by('name')
    serializer_class = ClassSerializer