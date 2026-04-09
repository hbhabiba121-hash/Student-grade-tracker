MAX_NAME_LENGTH = 100
from django.db import models
from classes.models import Class

class Student(models.Model):
    first_name = models.CharField(max_length=MAX_NAME_LENGTH)
    last_name = models.CharField(max_length=MAX_NAME_LENGTH)
    student_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"