from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    id = models.IntegerField(primary_key=True)
    phone_number = models.CharField(max_length=13)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female')
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    ACTIVE_CHOICES = (
        ('Y', 'Active'),
        ('N', 'Not active')
    )
    status = models.CharField(max_length=1, choices=ACTIVE_CHOICES, default='Y')
    gpa = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    LEVEL_CHOICES = (
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
    )
    level = models.IntegerField(choices=LEVEL_CHOICES, default=0)
    DEPARTMENT_CHOICES = (
        ('General', 'General'),
        ('AI', 'Artificial Intelligence'),
        ('CS', 'Computer Science'),
        ('IS', 'Information Systems'),
        ('DS', 'Decision Support'),
        ('IT', 'Information Technology')
    )
    department = models.CharField(max_length=10, choices=DEPARTMENT_CHOICES, null=True, blank=True)
    birthDate = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.id