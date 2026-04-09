from rest_framework import serializers
from .models import Class

class ClassSerializer(serializers.ModelSerializer):
    """Serializer for the Class model."""
    
    class Meta:
        model = Class
        fields = ['id', 'name', 'created_at']