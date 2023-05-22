from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.template import loader
from .models import Student


def active(request):
    template = loader.get_template('active.html')
    return HttpResponse(template.render())


def add(request):
    template = loader.get_template('add.html')
    return HttpResponse(template.render({}, request))


def department(request):
    template = loader.get_template('department.html')
    return HttpResponse(template.render())


def edit(request):
    template = loader.get_template('edit.html')
    return HttpResponse(template.render())


def home(request):
    template = loader.get_template('home.html')
    return HttpResponse(template.render())


def project_homepage(request):
    template = loader.get_template('project_homepage.html')
    return HttpResponse(template.render())


def search(request):
    myStudents = Student.objects.all().values()
    template = loader.get_template('search.html')
    context = {
        'students': myStudents
    }
    return HttpResponse(template.render(context, request))


def delete(request, id):
    student = Student.objects.get(id=id)
    student.delete()
    return HttpResponseRedirect(reverse('search'))

def addrecord(request):
    name = request.POST['name']
    id = request.POST['id']
    email = request.POST['email']
    phone = request.POST['phone']
    dob = request.POST['dob']
    status = request.POST['status']
    gender = request.POST['gender']
    gpa = request.POST['gpa']
    level = request.POST['level']
    department = 'General'

    if int(level) > 2:
        department = request.POST['department']
    student = Student(name=name, id=id, email=email, phone_number=phone, birthDate=dob, status=status, gender=gender, gpa=gpa,
                      level=level, department=department)
    student.save()
    return HttpResponseRedirect(reverse('add'))