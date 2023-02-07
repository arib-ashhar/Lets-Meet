from django.shortcuts import render, redirect
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random, time, json
from .models import meetMember
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def getToken(request):
    appId = '54cb0fb3b05e41c785a318ce37509239'
    appCertificate = 'e643705ba3c246a39f01b2a70b6318ac'
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeInSeconds = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token, 'uid':uid}, safe=False)

def join(request):
    return render(request, 'lmt_join_page.html')

def meet(request):
    return render(request, 'lmt_meet_page.html')

@csrf_exempt
def createMeetMember(request):
    data = json.loads(request.body)
    member, created = meetMember.objects.get_or_create(
        userName = data['userName'],
        UserID = data['UserID'],
        meetName = data['meetName']
    )
    return JsonResponse({'userName':data['userName']}, safe=False)

def getMeetMember(request):
    UserID = request.GET.get('UserID')
    meetName = request.GET.get('meetName')
    member = meetMember.objects.get(
        UserID = UserID,
        meetName = meetName
    )
    userName = member.userName
    return JsonResponse({'userName':member.userName}, safe=False)

@csrf_exempt
def deleteMeetMember(request):
    data = json.loads(request.body)
    member = meetMember.objects.get(
        userName = data['userName'],
        UserID = data['UserID'],
        meetName = data['meetName']
    )
    member.delete()
    return JsonResponse('member deleted safely', safe=False)