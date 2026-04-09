# grades/serializers.py
from rest_framework import serializers
from .models import Grade
from students.serializers import StudentSerializer
from subjects.serializers import SubjectSerializer

class GradeSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    subject_detail = SubjectSerializer(source='subject', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'school_class', 'student', 'student_detail', 'subject', 'subject_detail', 'score', 'created_at']