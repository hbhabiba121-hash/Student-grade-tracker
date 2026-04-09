# grades/models.py
from django.db import models
from django.core.exceptions import ValidationError
from students.models import Student
from classes.models import SchoolClass
from subjects.models import Subject

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grades')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        db_table = "grades"
        unique_together = ('student', 'school_class', 'subject')
        indexes = [
            models.Index(fields=['school_class', 'student']),
            models.Index(fields=['school_class', 'subject']),
        ]

    def clean(self):
        if self.score < 0 or self.score > 20:
            raise ValidationError({'score': 'Score must be between 0 and 20'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.subject}: {self.score}"