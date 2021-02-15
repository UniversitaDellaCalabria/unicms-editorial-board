from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render


@staff_member_required
def board_base(request):
    template = "board.html"
    return render(request, template)
