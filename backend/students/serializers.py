from rest_framework import serializers
from .models import Student
from django.db.models import Avg

EXCELLENT_THRESHOLD = 16
GOOD_THRESHOLD = 13
AVERAGE_THRESHOLD = 10

class StudentSerializer(serializers.ModelSerializer):
    """Serializer for the Student model with average, status and class name."""

    full_name = serializers.SerializerMethodField(method_name='getFullName')
    average_score = serializers.SerializerMethodField(method_name='getAverageScore')
    status = serializers.SerializerMethodField(method_name='getStatus')
    class_name = serializers.SerializerMethodField(method_name='getClassName')
    

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'first_name', 'last_name', 'school_class',
          'class_name', 'average_score', 'status', 'created_at']

    def getFullName(self, obj):
        """Combines first and last name for display."""
        return f"{obj.first_name} {obj.last_name}"

    def getClassName(self, obj):
        """Return the name of the class this student belongs to."""
        if obj.school_class:
            return obj.school_class.name
        return None

    def getAverageScore(self, obj):
        """Calculate the average of all grades for this student."""
        result = obj.grades.aggregate(average=Avg('score'))
        avg = result['average']
        return round(avg, 1) if avg is not None else None

    def getStatus(self, obj):
        """Determine academic status based on average score."""
        avg = self.getAverageScore(obj)
        if avg is None:
            return "No grades"
        if avg >= EXCELLENT_THRESHOLD:
            return "Excellent"
        if avg >= GOOD_THRESHOLD:
            return "Good"
        if avg >= AVERAGE_THRESHOLD:
            return "Average"
        return "Failing"