from rest_framework import serializers
from .models import Student
from classes.serializers import ClassSerializer

class StudentSerializer(serializers.ModelSerializer):
    """Serializer for the Student model."""
    
    student_class_detail = ClassSerializer(source='school_class', read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'school_class', 'student_class_detail', 'created_at']