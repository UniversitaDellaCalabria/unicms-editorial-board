import site

from django.core.management.base import BaseCommand
from pynpm import NPMPackage


class Command(BaseCommand):
    help = 'Install and build NPM packages'

    def handle(self, *args, **options):
        pkg = NPMPackage(f'{site.getsitepackages()[0]}/unicms_editorial_board/unicms_editorial_board_vue/package.json')
        pkg.install()
        pkg.run_script('build', '--report')
