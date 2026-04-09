# classes/models.py
from django.db import models
from core.constants import MAX_NAME_LENGTH
from subjects.models import Subject

class SchoolClass(models.Model):
    name = models.CharField(max_length=MAX_NAME_LENGTH, unique=True)
    session = models.CharField(max_length=20)  # e.g., "2025-2026"
    subjects = models.ManyToManyField(Subject, blank=True, related_name='classes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        db_table = "classes_class"

    def __str__(self):
        return f"{self.name} ({self.session})"