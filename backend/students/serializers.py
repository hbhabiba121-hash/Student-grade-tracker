from rest_framework import serializers
from .models import Student

EXCELLENT_THRESHOLD = 16
GOOD_THRESHOLD = 13
AVERAGE_THRESHOLD = 10


class StudentSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField(method_name='getFullName')
    average_score = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField(method_name='getStatus')
    class_name = serializers.SerializerMethodField(method_name='getClassName')

    class Meta:
        model = Student
        fields = [
            'id',
            'full_name',
            'first_name',
            'last_name',
            'school_class',
            'class_name',
            'average_score',
            'status',
            'created_at'
        ]

    def getFullName(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def getClassName(self, obj):
        if obj.school_class:
            return obj.school_class.name
        return None

    # ✅ FIXED (INSIDE class + correct name)
    def get_average_score(self, obj):
        grades = obj.grades.select_related('subject').all()

        total = 0
        coef_sum = 0

        for grade in grades:
            coef = grade.subject.coefficient if grade.subject else 1
            total += float(grade.score) * coef
            coef_sum += coef

        if coef_sum == 0:
            return None

        return round(total / coef_sum, 1)

    def getStatus(self, obj):
        avg = self.get_average_score(obj)

        if avg is None:
            return "No grades"
        if avg >= EXCELLENT_THRESHOLD:
            return "Excellent"
        if avg >= GOOD_THRESHOLD:
            return "Good"
        if avg >= AVERAGE_THRESHOLD:
            return "Average"
        return "Failing"