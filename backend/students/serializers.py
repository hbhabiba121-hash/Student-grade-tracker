from rest_framework import serializers
from .models import Student
from django.db.models import Avg

# --- CONSTANTS ---
EXCELLENT_THRESHOLD = 16
GOOD_THRESHOLD = 13
AVERAGE_THRESHOLD = 10

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    average_score = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Student
        # On utilise les vrais noms de champs du modèle (first_name, last_name)
        fields = ['id', 'full_name', 'first_name', 'last_name', 'average_score', 'status']

    def get_full_name(self, obj):
        """Combines first and last name for the display."""
        return f"{obj.first_name} {obj.last_name}"

    #def get_average_score(self, obj):
        #"""Calculates the average of all grades for this student."""
        # On suppose que la relation dans le modèle Grade s'appelle 'grades'
        #avg = obj.grades.aggregate(Avg('score'))['value__avg']
        #return round(avg, 1) if avg is not None else None
    def get_average_score(self, obj):
        """Calculates the average of all grades for this student."""
        # On donne un nom 'average' au calcul pour ne plus avoir de KeyError
        result = obj.grades.aggregate(average=Avg('score'))
        avg = result['average']
        return round(avg, 1) if avg is not None else None

    def get_status(self, obj):
        """Determines the academic status based on the average score."""
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