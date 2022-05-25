from django.shortcuts import render, redirect

# Create your views here.
def join(request):
    return render(request, 'lmt_join_page.html')

def meet(request):
    return render(request, 'lmt_meet_page.html')