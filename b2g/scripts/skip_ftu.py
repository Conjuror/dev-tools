# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from marionette import Marionette
from gaiatest import GaiaData
import mozdevice
import sys

def ftu_toggler(skip_ftu=True):
    dm = mozdevice.DeviceManagerADB(runAdbAsRoot=True)
    dm.forward("tcp:2828", "tcp:2828")

    m = Marionette()
    m.start_session()
    data_layer = GaiaData(m)
    url = "null" if skip_ftu else "app://ftu.gaiamobile.org/manifest.webapp"
    data_layer.set_setting('ftu.manifestURL', url)
    m.close()

    # restart b2g to enable
    dm.reboot()

if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == 'on':
            ftu_toggler(True)
    elif len(sys.argv) == 2 and sys.argv[1] == 'off':
            ftu_toggler(False)
    else:
        print("Usage: python skip_ftu.py [option]\n")
        print("[Option]: on - to disable FTU")
        print("          off - to enable FTU")