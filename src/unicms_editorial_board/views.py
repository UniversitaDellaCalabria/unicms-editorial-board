# from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.shortcuts import render


# @staff_member_required
@login_required
def board_base(request):
    if not request.user.is_staff:
        raise PermissionDenied
    template = "board.html"
    return render(request, template)
