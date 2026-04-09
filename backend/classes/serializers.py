from rest_framework import serializers
from .models import SchoolClass
from django.db.models import Avg

PASSING_THRESHOLD = 10

class ClassSerializer(serializers.ModelSerializer):
    """Serializer for SchoolClass with counts, averages and pass rate."""

    student_count = serializers.SerializerMethodField(method_name='getStudentCount')
    subject_count = serializers.SerializerMethodField(method_name='getSubjectCount')
    average_score = serializers.SerializerMethodField(method_name='getAverageScore')
    subject_names = serializers.SerializerMethodField(method_name='getSubjectNames')
    pass_rate = serializers.SerializerMethodField(method_name='getPassRate')
    top_student = serializers.SerializerMethodField(method_name='getTopStudent')

    class Meta:
        model = SchoolClass
        fields = ['id', 'name', 'session', 'subject_names', 'student_count',
                  'subject_count', 'average_score', 'pass_rate', 'top_student', 'created_at']

    def getStudentCount(self, obj):
        """Return total number of students in this class."""
        return obj.students.count()

    def getSubjectCount(self, obj):
        """Return total number of subjects linked to this class."""
        return obj.subjects.count()

    def getSubjectNames(self, obj):
        """Return list of subject names linked to this class."""
        return list(obj.subjects.values_list('name', flat=True))

    def getAverageScore(self, obj):
        """Return average score of all students in this class."""
        from grades.models import Grade
        result = Grade.objects.filter(student__school_class=obj).aggregate(average=Avg('score'))
        avg = result['average']
        return round(avg, 1) if avg is not None else None

    def getPassRate(self, obj):
        """Return percentage of students with average score above passing threshold."""
        from grades.models import Grade
        students = obj.students.all()
        if not students.exists():
            return None
        passingCount = 0
        for student in students:
            result = Grade.objects.filter(student=student).aggregate(average=Avg('score'))
            avg = result['average']
            if avg is not None and avg >= PASSING_THRESHOLD:
                passingCount += 1
        return round((passingCount / students.count()) * 100, 1)

    def getTopStudent(self, obj):
        """Return the name and average of the student with the highest average in this class."""
        from grades.models import Grade
        students = obj.students.all()
        if not students.exists():
            return None
        topStudent = None
        highestAvg = -1
        for student in students:
            result = Grade.objects.filter(student=student).aggregate(average=Avg('score'))
            avg = result['average']
            if avg is not None and avg > highestAvg:
                highestAvg = avg
                topStudent = student
        if topStudent is None:
            return None
        return {
            'name': f"{topStudent.first_name} {topStudent.last_name}",
            'average': round(highestAvg, 1)
        }