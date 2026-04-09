# grades/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg

from classes.models import SchoolClass
from .models import Grade
from .serializers import GradeSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all().order_by('student')
    serializer_class = GradeSerializer

    @action(detail=False, methods=['get'], url_path='filter-options')
    def get_filter_options(self, request):
        class_id = request.query_params.get('class_id')
        if not class_id:
            return Response(
                {"error": "class_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            school_class = SchoolClass.objects.get(id=class_id)
        except SchoolClass.DoesNotExist:
            return Response(
                {"error": "Class not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        students = school_class.students.all()
        subjects = school_class.subjects.all()

        return Response({
            "students": [{"id": s.id, "name": str(s)} for s in students],
            "subjects": [{"id": sub.id, "name": sub.name} for sub in subjects],
        })

    def create(self, request, *args, **kwargs):
        school_class_id = request.data.get('school_class')
        student_id = request.data.get('student')
        subject_id = request.data.get('subject')

        if not school_class_id:
            return Response(
                {"error": "school_class is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            school_class = SchoolClass.objects.get(id=school_class_id)
        except SchoolClass.DoesNotExist:
            return Response(
                {"error": f"Class {school_class_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not school_class.students.filter(id=student_id).exists():
            return Response(
                {"error": f"Student {student_id} does not belong to class {school_class_id}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not school_class.subjects.filter(id=subject_id).exists():
            return Response(
                {"error": f"Subject {subject_id} is not taught in class {school_class_id}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)