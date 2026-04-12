# subjects/models.py
from django.db import models
from core.constants import MAX_NAME_LENGTH

class Subject(models.Model):
    name = models.CharField(max_length=MAX_NAME_LENGTH, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        db_table = "subjects_subject"

    def __str__(self):
        return self.name