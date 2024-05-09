# from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.http.request import split_domain_port
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _

from cms.contexts.models import WebSite

# @staff_member_required
@login_required
def board_base(request):
    if not request.user.is_staff:
        raise PermissionDenied

    # if MAIN_WEBSITE set in settings
    # then access to /editorial-board path only from main domain
    # else access from any website
    if hasattr(settings, 'MAIN_WEBSITE'):
        current_site = split_domain_port(request.get_host())[0]
        main_pk = getattr(settings, 'MAIN_WEBSITE')
        main_website = WebSite.objects.filter(pk=main_pk).first()
        main_domain = main_website.domain
        if main_domain != current_site:
            raise Http404(_("Access this path from main domain {}".format(main_domain)))

    template = "board.html"
    return render(request, template)
