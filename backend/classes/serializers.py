from rest_framework import serializers
from .models import SchoolClass
from subjects.models import Subject

class ClassSerializer(serializers.ModelSerializer):
    """Serializer for the SchoolClass model with student and subject counts."""
    
    student_count = serializers.SerializerMethodField(method_name='getStudentCount')
    subject_count = serializers.SerializerMethodField(method_name='getSubjectCount')

    class Meta:
        model = SchoolClass
        fields = ['id', 'name','session', 'subjects', 'student_count', 'subject_count', 'created_at']

    def getStudentCount(self, obj):
        """Return total number of students in this class."""
        return obj.students.count()

    def getSubjectCount(self, obj):
        """Return total number of subjects linked to this class."""
        return obj.subjects.count()