from rest_framework import serializers
from .models import Subject

class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for the Subject model."""
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description', 'created_at']