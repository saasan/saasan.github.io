#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import csv
import urllib2
import jinja2
import codecs
from datetime import datetime

APP_PATH = os.path.dirname(__file__)
TEMPLATE = 'template.html'
OUTPUT = 'index.html'
OUTPUT_PATH = os.path.join(APP_PATH, OUTPUT)

class Dojo:
    def __init__(self, lv, rank, id, type, leader):
        self.lv = lv
        self.rank = rank
        self.id = id
        self.type = type
        self.leader = leader

def unicode_csv_reader(utf8_csv_data, dialect=csv.excel, **kwargs):
    reader = csv.reader(utf8_csv_data, dialect=dialect, **kwargs)
    for row in reader:
        yield [unicode(cell, 'utf-8') for cell in row]

def format_datetime(value):
    return value.strftime('%Y-%m-%d %H:%M')

url = 'https://spreadsheets.google.com/pub?key=0Aq6mv2GCHMGLdERhLURsdEZwdVFvREdiYjE4Sy1FUnc&output=csv&range=b9:h308'

try:
    result = urllib2.urlopen(url)
except urllib2.URLError, e:
    print e.reason
    sys.exit()

dojos =[]

reader = unicode_csv_reader(result)
for lv, rank, id, type, smart_phone, cheer, leader in reader:
    dojos.append(Dojo(lv, rank.replace('.', ''), id, type, leader))

for dojo in dojos:
    print dojo.lv + ", " + dojo.rank + ", " + dojo.id + ", " + dojo.type + ", " + dojo.leader

template_values = {
    'dojos': dojos,
    'now': datetime.now()
}

jinja = jinja2.Environment(loader=jinja2.FileSystemLoader(APP_PATH))
jinja.filters['datetime'] = format_datetime
template = jinja.get_template(TEMPLATE)

try:
    output = template.render(template_values)
except jinja2.TemplateError, e:
    print e.reason
    sys.exit()

f = codecs.open(OUTPUT_PATH, 'w', 'utf-8')
try:
    f.write(output)
finally:
    f.close()
