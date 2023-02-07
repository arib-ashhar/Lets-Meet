from django.db import models

# Create your models here.
class meetMember(models.Model):
    userName = models.CharField(max_length=200)
    UserID = models.CharField(max_length=200)
    meetName = models.CharField(max_length=200)

    def __str__(self):
        return self.userName