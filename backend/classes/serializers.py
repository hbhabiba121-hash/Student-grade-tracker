from rest_framework import serializers
from .models import SchoolClass
from subjects.models import Subject


class ClassSerializer(serializers.ModelSerializer):

    # 🔗 Relations
    subjects = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Subject.objects.all()
    )

    # 📊 Computed fields
    subject_names = serializers.SerializerMethodField()
    subject_ids = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()
    subject_count = serializers.SerializerMethodField()
    average_score = serializers.SerializerMethodField()
    pass_rate = serializers.SerializerMethodField()

    # 🥇 NEW
    students_ranked = serializers.SerializerMethodField()
    top_student = serializers.SerializerMethodField()

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
            'average_score',
            'pass_rate',
            'students_ranked',   # ✅ NEW
            'top_student',       # ✅ NEW
        ]

    # 🔥 CREATE
    def create(self, validated_data):
        subjects = validated_data.pop('subjects', [])
        obj = SchoolClass.objects.create(**validated_data)
        obj.subjects.set(subjects)
        return obj

    # 🔥 UPDATE
    def update(self, instance, validated_data):
        subjects = validated_data.pop('subjects', None)

        instance.name = validated_data.get('name', instance.name)
        instance.session = validated_data.get('session', instance.session)
        instance.save()

        if subjects is not None:
            instance.subjects.set(subjects)

        return instance

    # 📚 Subjects
    def get_subject_names(self, obj):
        return list(obj.subjects.values_list('name', flat=True))

    def get_subject_ids(self, obj):
        return list(obj.subjects.values_list('id', flat=True))

    # 👨‍🎓 Counts
    def get_student_count(self, obj):
        return obj.students.count()

    def get_subject_count(self, obj):
        return obj.subjects.count()

    # 🧠 Helper: weighted avg per student
    def calculate_student_avg(self, student, obj):
        grades = student.grades.filter(school_class=obj).select_related('subject')

        total = 0
        coef_sum = 0

        for grade in grades:
            coef = grade.subject.coefficient if grade.subject else 1
            total += float(grade.score) * coef
            coef_sum += coef

        if coef_sum == 0:
            return None

        return total / coef_sum

    # 📊 Class average (correct)
    def get_average_score(self, obj):
        students = obj.students.all()

        total = 0
        count = 0

        for student in students:
            avg = self.calculate_student_avg(student, obj)
            if avg is not None:
                total += avg
                count += 1

        if count == 0:
            return None

        return round(total / count, 2)

    # 📈 Pass rate (correct)
    def get_pass_rate(self, obj):
        students = obj.students.all()

        total_students = students.count()
        if total_students == 0:
            return None

        passed = 0

        for student in students:
            avg = self.calculate_student_avg(student, obj)
            if avg is not None and avg >= 10:
                passed += 1

        return round((passed / total_students) * 100, 2)

    # 🥇 FULL RANKING
    def get_students_ranked(self, obj):
        students = obj.students.all()

        ranked = []

        for student in students:
            avg = self.calculate_student_avg(student, obj)

            if avg is not None:
                ranked.append({
                    "id": student.id,
                    "name": str(student),
                    "average": round(avg, 2)
                })

        # sort descending
        ranked.sort(key=lambda x: x["average"], reverse=True)

        # assign rank
        for i, s in enumerate(ranked, start=1):
            s["rank"] = i

        return ranked

    # 🔥 TOP STUDENT
    def get_top_student(self, obj):
        ranked = self.get_students_ranked(obj)

        if not ranked:
            return None

        return ranked[0]