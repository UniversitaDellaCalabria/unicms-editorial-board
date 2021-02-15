from django.conf import settings
from django.urls import re_path, path, include

from . views import *


# CMS_PATH_PREFIX = getattr(settings, 'CMS_PATH_PREFIX', '')
_board_base = 'editorial-board'

urlpatterns = []

urlpatterns += [
    path(f'{_board_base}/', board_base, name='board_base'),
]
