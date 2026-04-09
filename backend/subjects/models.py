MAX_NAME_LENGTH = 100
from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=MAX_NAME_LENGTH)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name