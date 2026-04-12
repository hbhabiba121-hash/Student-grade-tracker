from rest_framework import serializers
from .models import SchoolClass
from subjects.models import Subject
from django.db.models import Avg

class ClassSerializer(serializers.ModelSerializer):

    subjects = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Subject.objects.all()
    )

    subject_names = serializers.SerializerMethodField()
    subject_ids = serializers.SerializerMethodField()

    student_count = serializers.SerializerMethodField()
    subject_count = serializers.SerializerMethodField()

    class Meta:
        model = SchoolClass
        fields = [
            'id',
            'name',
            'session',
            'subjects',
            'subject_ids',
            'subject_names',
            'student_count',
            'subject_count',
        ]

    # 🔥 REQUIRED FOR MANYTOMANY CREATE
    def create(self, validated_data):
        subjects = validated_data.pop('subjects', [])
        obj = SchoolClass.objects.create(**validated_data)
        obj.subjects.set(subjects)
        return obj

    # 🔥 REQUIRED FOR UPDATE
    def update(self, instance, validated_data):
        subjects = validated_data.pop('subjects', None)

        instance.name = validated_data.get('name', instance.name)
        instance.session = validated_data.get('session', instance.session)
        instance.save()

        if subjects is not None:
            instance.subjects.set(subjects)

        return instance

    def get_subject_names(self, obj):
        return list(obj.subjects.values_list('name', flat=True))

    def get_subject_ids(self, obj):
        return list(obj.subjects.values_list('id', flat=True))

    def get_student_count(self, obj):
        return obj.students.count()

    def get_subject_count(self, obj):
        return obj.subjects.count()