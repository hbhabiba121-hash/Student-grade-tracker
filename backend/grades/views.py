from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg
from .models import Grade
from .serializers import GradeSerializer

class GradeViewSet(viewsets.ModelViewSet):
    """Handles all CRUD operations for Grade plus average calculation."""
    
    queryset = Grade.objects.all().order_by('student')
    serializer_class = GradeSerializer

    @action(detail=False, methods=['get'], url_path='average/(?P<student_id>[^/.]+)')
    def calculateStudentAverage(self, request, student_id=None):
        """Calculate average score for a specific student."""
        
        studentGrades = Grade.objects.filter(student_id=student_id)
        if not studentGrades.exists():
            return Response({'average': None, 'message': 'No grades found for this student'})
        
        averageScore = studentGrades.aggregate(Avg('score'))['score__avg']
        return Response({'student_id': student_id, 'average': round(averageScore, 2)})