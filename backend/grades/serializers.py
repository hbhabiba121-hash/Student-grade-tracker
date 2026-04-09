from rest_framework import serializers
from .models import Grade
from students.serializers import StudentSerializer
from subjects.serializers import SubjectSerializer

class GradeSerializer(serializers.ModelSerializer):
    """Serializer for the Grade model."""
    
    student_detail = StudentSerializer(source='student', read_only=True)
    subject_detail = SubjectSerializer(source='subject', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_detail', 'subject', 'subject_detail', 'score', 'created_at']