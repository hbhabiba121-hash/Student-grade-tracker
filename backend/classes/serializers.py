from rest_framework import serializers
from .models import SchoolClass  
from django.db.models import Avg

class ClassSerializer(serializers.ModelSerializer):
    average_score = serializers.SerializerMethodField()

    class Meta:
        model = SchoolClass
        fields = ['id', 'name', 'average_score']

    #def get_average_score(self, obj):
        #"""Calculates the overall average score for all students in this class."""
        #from grades.models import Grade
        # On filtre les notes par la classe de l'étudiant
        #avg = Grade.objects.filter(student__school_class=obj).aggregate(Avg('score'))['value__avg']
        #return round(avg, 1) if avg is not None else None
    def get_average_score(self, obj):
        """Calculates the overall average score for all students in this class."""
        from grades.models import Grade
        # On donne aussi le nom 'average' ici
        result = Grade.objects.filter(student__school_class=obj).aggregate(average=Avg('score'))
        avg = result['average']
        return round(avg, 1) if avg is not None else None