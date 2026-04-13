from django.db import models
from core.constants import MAX_NAME_LENGTH

DEFAULT_COEFFICIENT = 1
MIN_COEFFICIENT = 1
MAX_COEFFICIENT = 10

class Subject(models.Model):
    name = models.CharField(max_length=MAX_NAME_LENGTH, unique=True)
    description = models.TextField(blank=True, null=True)
    coefficient = models.PositiveIntegerField(default=DEFAULT_COEFFICIENT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        db_table = "subjects_subject"

    def __str__(self):
        return self.name