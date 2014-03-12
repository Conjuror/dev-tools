import requests
import json

baseURL = 'https://moztrap.mozilla.org'
postURL = 'https://moztrap.mozilla.org/api/v1/suitecase/?username=atsai&api_key=dec0aa2d-64ea-4b73-a9b0-43b64f0e621d&format=json'
getURL = 'https://moztrap.mozilla.org/api/v1/case/?username=atsai&product=16&api_key=dec0aa2d-64ea-4b73-a9b0-43b64f0e621d&limit=200&format=json'

order = 2
r = requests.get(getURL, verify=False)

#read content
l = json.loads(r.text)

noSuiteCases = []

while True:
    for case in l['objects']:
        if len(case['suites']) == 0:
            n = case['id']
            noSuiteCases.append(case['id'])
            print n

            # d = {u'case': u'/api/v1/case'+unicode(n)+u'/', u'suite': u'/api/v1/suite/579/'}
            # d['order'] = len(noSuiteCases)+order
            # print json.dumps(d)
    if l['meta']['total_count'] > l['meta']['offset']+l['meta']['limit']:
        r = requests.get(baseURL+l['meta']['next'], verify=False)
        if r.status_code == 200:
            l = json.loads(r.text)
        else:
            print r.status_code
            break
    else:
        break

print 'Total: ' + str(len(noSuiteCases)) + ' cases belong to no SUITES'

# for i, n in enumerate(noSuiteCases):
#     d = {u'case': u'/api/v1/case/'+unicode(n)+u'/', u'suite': u'/api/v1/suite/579/'}
#     d['order'] = i+order
#     r = requests.post(postURL, data=json.dumps(d), verify=False)
#     if r.status_code != 201:
#         print str(n) + ' ' + str(r.status_code)
#     else:
#         print "Done: " + json.dumps(d)
