# students/models.py
from django.db import models
from core.constants import MAX_NAME_LENGTH
from classes.models import SchoolClass

class Student(models.Model):
    first_name = models.CharField(max_length=MAX_NAME_LENGTH)
    last_name = models.CharField(max_length=MAX_NAME_LENGTH)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, null=True, blank=True , related_name='students')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['last_name', 'first_name']
        db_table = "students_student"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"